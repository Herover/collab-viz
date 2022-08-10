<script setup lang="ts">
import { ref, watch } from "vue";
import DropdownInput from "./DropdownInput.vue";

const emit = defineEmits<{
  (event: "op", data: unknown): void;
}>();

const props = defineProps<{
  axis: any;
  index: number;
}>();

const changed = (k: string, op: any) => {
  emit("op", [k, op]);
};

const orientations = ["left", "right", "top", "bottom"];
</script>

<template>
  <div>
    <DropdownInput
      :value="props.axis.orient"
      :options="orientations"
      @op="(op) => changed('orient', op)"
    />
  </div>
</template>
