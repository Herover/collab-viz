<script setup lang="ts">
import ReconnectingWebSocket from "reconnecting-websocket";
import Client from "sharedb/lib/client";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import * as json1 from "ot-json1";
import { View, parse, type Spec } from "vega";
import type { Socket } from "sharedb/lib/sharedb";
import ScalesEditor from "./ScalesEditor.vue";
import AxesEditor from "./AxesEditor.vue";
// import MarkSelector from "../components/MarkSelector.vue";

const STATUS_OK = 0;
const STATUS_WARN = 1;
const STATUS_ERROR = 2;

const viz = ref(null as unknown as HTMLElement);

const vegaSpec = ref<Spec>({});
const canRenderSpec = ref(true);
const connected = ref(false);
const scales = ref([]);
const axes = ref([]);

const statusIndicator = computed(() => {
  if (!canRenderSpec.value) return STATUS_ERROR;
  if (!connected.value) return STATUS_WARN;
  return STATUS_OK;
});

let view: View;
watch(vegaSpec, () => {
  try {
    console.log("render", vegaSpec.value);
    if (view) {
      view.finalize();
    }
    view = new View(parse(vegaSpec.value), {
      renderer: "svg",
      container: viz.value,
      hover: true,
    });
    view.run();
    canRenderSpec.value = true;
  } catch (e) {
    console.error("caught", e);
    canRenderSpec.value = false;
  }
});

const updateSpec = () => {
  console.log("update", doc.version);
  scales.value = doc.data.spec.scales;
  axes.value = doc.data.spec.axes;

  vegaSpec.value = doc.data.spec;
};

// Open WebSocket connection to ShareDB server
const socket = new ReconnectingWebSocket(
  "ws://" + window.location.hostname + ":8080"
);
socket.addEventListener("open", () => {
  connected.value = true;
});
socket.addEventListener("close", (e) => {
  connected.value = false;
  console.log("close", e);
});
socket.addEventListener("error", (e) => {
  connected.value = false;
  console.log("error", e, socket.CONNECTING, socket.CLOSED);
});
// TODO
// socket.removeEventListener("open");

Client.types.register(json1.type);
const connection = new Client.Connection(socket as Socket);

// Create local Doc instance mapped to 'examples' collection document with id 'counter'
const doc: Client.Doc = connection.get("examples", "counter");

onMounted(() => {
  console.log("subbing");
  // Get initial value of document and subscribe to changes
  doc.subscribe(() => {
    console.log("subscribed");
    updateSpec();
  });
});
onUnmounted(() => {
  console.log("unsubbing");
  doc.unsubscribe();
});

// When document changes (by this client or any other, or the server),
// update the number on the page
doc.on("op", (a, b, c) => {
  console.log("on op", a, b, c);
  updateSpec();
});

const submitOp = (data: unknown) => {
  console.log("submiting op", data);
  doc.submitOp(data);
};

const changed = (op: any) => {
  console.log("Viz editor!", op);
  submitOp(["spec"].concat([op]));
};
</script>

<template>
  <main>
    <p>
      Status:
      <span
        :class="{
          circle: true,
          ['viz-status-' + ['ok', 'warn', 'error'][statusIndicator]]: true,
        }"
      ></span>
      <span v-if="!canRenderSpec">&nbsp;specification is invalid&nbsp;</span>
      <span v-if="!connected">&nbsp;reconnecting</span>
    </p>
    <!-- <MarkSelector :initialMark="initialMark" @op="submitOp" /> -->
    <br />
    <div ref="viz"></div>
    <div class="pane-holder">
      <ScalesEditor :scales="scales" @op="changed" />
      <AxesEditor :axes="axes" @op="changed" />
    </div>
  </main>
</template>

<style>
.circle {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  top: 2px;
}
.viz-status-ok {
  background-color: green;
}
.viz-status-warn {
  background-color: orange;
}
.viz-status-error {
  background-color: red;
}
</style>
