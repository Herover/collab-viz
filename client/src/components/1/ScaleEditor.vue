<script setup lang="ts">
import { ref, watch } from "vue";
import DropdownInput from "../DropdownInput.vue";

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

const type = ref(props.scale.type);
watch(
  () => props.scale.type,
  () => {
    type.value = props.scale.type;
  }
);

const quantitativeScales = [
  "linear",
  "log",
  "pow",
  "sqrt",
  "symlog",
  "time",
  "utc",
  // "sequential",
];
const discreteScales = ["ordinal", "band", "point"];
const discretizingScales = ["quantile", "quantize", "threshold", "bin-ordinal"];
const allScales = quantitativeScales
  .concat(discreteScales)
  .concat(discretizingScales);

const changed = (k: string, op: any) => {
  emit("op", [k, op]);
};
</script>

<template>
  <div class="pane-holder">
    <input
      v-model="name"
      @input="() => changed('name', { r: 0, i: name.value })"
    />
    <DropdownInput
      :value="type"
      :options="allScales"
      label="Type"
      @op="(op) => changed('type', op)"
    />
  </div>
</template>
