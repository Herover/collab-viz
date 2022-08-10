<script setup lang="ts">
import { ref, watch } from "vue";

const emit = defineEmits<{
  (event: "op", data: unknown): void;
}>();

const props = defineProps<{
  value: string;
  options: string[];
}>();

const value = ref(props.value);
watch(
  () => props.value,
  () => {
    value.value = props.value;
  }
);

const changed = () => {
  emit("op", [{ r: 0, i: value.value }]);
};
</script>

<template>
  <div>
    <select v-model="value" @change="changed">
      <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
    </select>
  </div>
</template>
