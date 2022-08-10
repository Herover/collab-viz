<script setup lang="ts">
import { ref, watch } from "vue";

const emit = defineEmits<{
  (event: "op", data: unknown): void;
}>();

const props = defineProps<{
  value: boolean;
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
    <input type="checkbox" v-model="value" @change="changed" />
  </div>
</template>
