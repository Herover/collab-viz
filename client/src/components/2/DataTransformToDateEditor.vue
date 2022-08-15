<script lang="ts" setup>
import { computed, inject, type Ref, ref, watch } from "vue";
import NumberInput from "../NumberInput.vue";
import DropdownInput from "../DropdownInput.vue";
import TextInput from "../TextInput.vue";

const emit = defineEmits<{
  (event: "op", data: unknown): void;
}>();

const props = defineProps<{
  dataset: any;
  transform: any;
}>();

const datasets = inject<
  Ref<{ name: string; display: string; keys: string[] }[]>
>("datasets", ref([]));
const validFields = computed(() => {
  return datasets.value.find((d) => d.name == props.dataset._id)?.keys;
});

const key = ref(props.transform.key);
watch(
  () => props.transform.key,
  () => {
    key.value = props.transform.key;
  }
);
const field = ref(props.transform.field);
watch(
  () => props.transform.field,
  () => {
    field.value = props.transform.field;
  }
);

const changed = (k: string, op: any) => {
  emit("op", [k, op]);
};
</script>
<template>
  Convert to date
  <DropdownInput
    :value="field"
    :options="validFields || []"
    label="Source field"
    @op="(op) => changed('field', op)"
  />
  <TextInput
    :value="key"
    label="New key"
    @op="(op: any) => changed('key', op)"
  />
</template>
