<script setup lang="ts">
import { ref, watch } from "vue";
import DropdownInput from "./DropdownInput.vue";
import CheckboxInput from "./CheckboxInput.vue";

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
  <div class="pane-holder">
    <DropdownInput
      :value="props.axis.orient"
      :options="orientations"
      label="Orientation"
      @op="(op) => changed('orient', op)"
    />
    <CheckboxInput
      label="Gridlines"
      :value="props.axis.grid"
      @op="(op) => changed('grid', op)"
    />
  </div>
</template>
