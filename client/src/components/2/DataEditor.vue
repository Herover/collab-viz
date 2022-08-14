<script lang="ts" setup>
import { computed, inject, type Ref, ref, watch } from "vue";
import NumberInput from "../NumberInput.vue";
import DropdownInput from "../DropdownInput.vue";
import DataTransformToDateEditor from "./DataTransformToDateEditor.vue";

const emit = defineEmits<{
  (event: "op", data: unknown): void;
}>();

const props = defineProps<{
  dataset: any;
}>();

const changed = (path: (number | string)[], op: any) => {
  emit("op", path.concat(op));
};
</script>
<template>
  {{ dataset.name }}
  <div v-for="(t, index) in dataset.transforms" :key="index">
    <DataTransformToDateEditor
      :transform="t"
      :dataset="props.dataset"
      @op="(op) => changed(['transforms', index], op)"
    />
  </div>
</template>
