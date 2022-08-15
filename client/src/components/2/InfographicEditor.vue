<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import PieChartEditor from "./PieChartEditor.vue";
import BarChartEditor from "./BarChartEditor.vue";
import LineChartEditor from "./LineChartEditor.vue";
import DataEditor from "./DataEditor.vue";

const props = defineProps<{
  spec: any;
}>();
const emit = defineEmits<{
  (event: "op", data: unknown): void;
}>();
const router = useRouter();

const spec = ref(props.spec);
watch(
  () => props.spec,
  () => {
    spec.value = props.spec;
    console.log("editor spec updated");
  }
);

const changed = (path: (number | string)[], op: any) => {
  emit("op", path.concat(op));
};

const getCommonChartData = () => ({
  // TODO: use UUID
  _id: (Math.random() + "").split(".")[1],
  name: "",
  type: "",
  data: "",
  width: 200,
  height: 200,
  x: props.spec.width / 2 - 100,
  y: props.spec.height / 2 - 100,
});

const addBar = () => {
  emit("op", [
    "charts",
    props.spec.charts.length,
    {
      i: {
        ...getCommonChartData(),
        name: "Bar chart",
        type: "bar",
        categories: "",
        values: "",
        labelAngle: 0,
        labelAlign: "center",
      },
    },
  ]);
};
const addLine = () => {
  emit("op", [
    "charts",
    props.spec.charts.length,
    {
      i: {
        ...getCommonChartData(),
        name: "Line chart",
        type: "line",
        xField: "",
        yField: "",
      },
    },
  ]);
};
const addPie = () => {
  emit("op", [
    "charts",
    props.spec.charts.length,
    {
      i: {
        ...getCommonChartData(),
        name: "Pie chart",
        type: "pie",
        categories: "",
        values: "",
      },
    },
  ]);
};

const moveUp = (index: number) => {
  emit("op", [
    "charts",
    [
      index,
      {
        p: 0,
      },
    ],
    [
      index - 1,
      {
        d: 0,
      },
    ],
  ]);
};
const moveDown = (index: number) => {
  emit("op", [
    "charts",
    [
      index,
      {
        p: 0,
      },
    ],
    [
      index + 1,
      {
        d: 0,
      },
    ],
  ]);
};
</script>
<template>
  <div v-if="spec">
    <span>Data</span>
    <div v-for="(d, index) in spec.data" :key="d._id" class="editor-panel">
      <DataEditor
        :dataset="d"
        @op="(op: any) => changed(['data', index], op)"
      />
    </div>
    <span>Charts</span>
    <div v-for="(c, index) in spec.charts" :key="c._id" class="editor-panel">
      <PieChartEditor
        v-if="c.type == 'pie'"
        :chart="c"
        @op="(op: any) => changed(['charts', index], op)"
      />
      <BarChartEditor
        v-else-if="c.type == 'bar'"
        :chart="c"
        @op="(op: any) => changed(['charts', index], op)"
      />
      <LineChartEditor
        v-else-if="c.type == 'line'"
        :chart="c"
        @op="(op: any) => changed(['charts', index], op)"
      />
      <button @click="() => moveUp(index)" :disabled="index == 0">Up</button>
      <button
        @click="() => moveDown(index)"
        :disabled="index + 1 == spec.charts.length"
      >
        Down
      </button>
      <button>Delete</button>
    </div>
    <button @click="addPie">+Pie</button>
    <button @click="addBar">+Bar</button>
    <button @click="addLine">+Line</button>
  </div>
</template>

<style>
.editor-panel {
  width: 300px;
  border: 1px solid black;
}
</style>
