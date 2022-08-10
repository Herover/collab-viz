<script setup lang="ts">
import { ref, watch } from "vue";

const emit = defineEmits<{
  (event: "op", data: unknown): void;
}>();

const props = defineProps<{
  value: string;
  options: string[];
  label: string;
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

// TODO: Find better way to get unique identifier
const id = Math.random() + "";
</script>

<template>
  <div>
    <label :for="id">{{ props.label }}</label>
    <select :id="id" v-model="value" @change="changed">
      <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
    </select>
  </div>
</template>
