<script setup lang="ts">
import { ref, watch } from "vue";

const emit = defineEmits<{
  (event: "op", data: unknown): void;
}>();

const props = defineProps<{
  scale: any;
  index: number;
}>();

const name = ref(props.scale.name);
watch(
  () => props.scale.name,
  () => {
    name.value = props.scale.name;
  }
);

const changed = () => {
  emit("op", ["name", { r: 0, i: name.value }]);
};
</script>

<template>
  <div>
    <h3><input v-model="name" @input="changed" /></h3>
  </div>
</template>
