<script setup lang="ts">
import { ref, watch } from "vue";
import ScaleEditor from "./ScaleEditor.vue";
const props = defineProps<{
  scales: any;
}>();

const scales = ref(props.scales);
watch(
  () => props.scales,
  () => {
    scales.value = props.scales;
    console.log("scales updated");
  }
);

const emit = defineEmits<{
  (event: "op", data: any): void;
}>();

const changed = (i: number, op: any) => {
  emit("op", ["scales", i].concat(op));
};
</script>

<template>
  <div>
    <h2>Scales</h2>
    <ScaleEditor
      v-for="(scale, index) in props.scales"
      :key="index"
      :scale="scale"
      :index="index"
      @op="(op) => changed(index, op)"
    />
  </div>
</template>
