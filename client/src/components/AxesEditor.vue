<script setup lang="ts">
import { ref, watch } from "vue";
import AxisEditor from "./AxisEditor.vue";
const props = defineProps<{
  axes: any;
}>();

const axes = ref(props.axes);
watch(
  () => props.axes,
  () => {
    axes.value = props.axes;
    console.log("axes updated");
  }
);

const emit = defineEmits<{
  (event: "op", data: any): void;
}>();

const changed = (i: number, op: any) => {
  emit("op", ["axes", i].concat(op));
};
</script>

<template>
  <div>
    <h2>Axes</h2>
    <AxisEditor
      v-for="(axis, index) in props.axes"
      :key="index"
      :axis="axis"
      :index="index"
      @op="(op: any) => changed(index, op)"
    />
  </div>
</template>
