<script setup lang="ts">
import { ref, watch } from "vue";

const emit = defineEmits<{
  (event: "op", data: unknown): void;
}>();

const props = defineProps<{
  axis: any;
  index: number;
}>();

const orient = ref(props.axis.orient);
watch(
  () => props.axis.orient,
  () => {
    orient.value = props.axis.orient;
  }
);

const changed = () => {
  emit("op", ["orient", { r: 0, i: orient.value }]);
};

const orientations = ["left", "right", "top", "bottom"];
</script>

<template>
  <div>
    <select v-model="orient" @change="changed">
      <option v-for="m in orientations" :key="m" :value="m">{{ m }}</option>
    </select>
  </div>
</template>
