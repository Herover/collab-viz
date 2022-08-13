<script setup lang="ts">
import ReconnectingWebSocket, { type ErrorEvent } from "reconnecting-websocket";
import Client from "sharedb/lib/client";
import { computed, onMounted, onUnmounted, provide, ref, watch } from "vue";
import * as json1 from "ot-json1";
import { View, parse, type Spec } from "vega";
import type { Socket } from "sharedb/lib/sharedb";

import InfographicEditor from "@/components/2/InfographicEditor.vue";
import { useRouter } from "vue-router";
import GraphicViewer from "../components/2/GraphicViewer.vue";

const router = useRouter();

const connected = ref(false);
const spec = ref<any>(null);
const datasets = ref([]);

provide("datasets", datasets);

const updateSpec = () => {
  spec.value = doc.data.spec;
};

// Open WebSocket connection to ShareDB server
const socket = new ReconnectingWebSocket(
  "ws://" + window.location.hostname + ":8080"
);
const onSocketOpen = () => {
  connected.value = true;
};
const onSocketClose = () => {
  connected.value = false;
};
const onSocketError = (e: ErrorEvent) => {
  connected.value = false;
  console.log("error", e);
};

Client.types.register(json1.type);
const connection = new Client.Connection(socket as Socket);

// Create local Doc instance mapped to 'examples' collection document with id 'counter'
const doc: Client.Doc = connection.get(
  "fancy",
  router.currentRoute.value.params.id as string
);

onMounted(() => {
  socket.addEventListener("open", onSocketOpen);
  socket.addEventListener("close", onSocketClose);
  socket.addEventListener("error", onSocketError);

  // Get initial value of document and subscribe to changes
  doc.subscribe(() => {
    updateSpec();
  });
});
onUnmounted(() => {
  doc.unsubscribe();

  socket.close();
  socket.removeEventListener("open", onSocketOpen);
  socket.removeEventListener("close", onSocketClose);
  socket.removeEventListener("error", onSocketError);
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
  submitOp(["spec"].concat(op));
};
const datasetsChanged = (newDatasets: any) => {
  datasets.value = newDatasets;
};
</script>

<template>
  <main>
    <InfographicEditor v-if="spec" :spec="spec" @op="changed" />
    <GraphicViewer
      v-if="spec"
      :spec="spec"
      @datasets-changed="datasetsChanged"
    />
  </main>
</template>
