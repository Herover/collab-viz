<script lang="ts" setup>
import { computed, inject, type Ref, ref, watch } from "vue";
import NumberInput from "../NumberInput.vue";
import DropdownInput from "../DropdownInput.vue";

const emit = defineEmits<{
  (event: "op", data: unknown): void;
}>();

const props = defineProps<{
  chart: any;
}>();

const datasets = inject<
  Ref<{ name: string; display: string; keys: string[] }[]>
>("datasets", ref([]));
const validCategories = computed(() => {
  console.log("datasets", datasets.value);
  return datasets.value.find((d) => d.name == dataset.value)?.keys;
});

const xPos = ref(props.chart.x);
watch(
  () => props.chart.x,
  () => {
    xPos.value = props.chart.x;
  }
);
const yPos = ref(props.chart.y);
watch(
  () => props.chart.y,
  () => {
    yPos.value = props.chart.y;
  }
);
const width = ref(props.chart.width);
watch(
  () => props.chart.width,
  () => {
    width.value = props.chart.width;
  }
);
const height = ref(props.chart.height);
watch(
  () => props.chart.height,
  () => {
    height.value = props.chart.height;
  }
);
const dataset = ref(props.chart.data);
watch(
  () => props.chart.data,
  () => {
    dataset.value = props.chart.data;
  }
);
const categories = ref(props.chart.categories);
watch(
  () => props.chart.categories,
  () => {
    categories.value = props.chart.categories;
  }
);
const values = ref(props.chart.values);
watch(
  () => props.chart.value,
  () => {
    values.value = props.chart.values;
  }
);

const changed = (k: string, op: any) => {
  emit("op", [k, op]);
};
</script>
<template>
  <NumberInput
    :value="xPos"
    label="X position"
    @op="(op: any) => changed('x', op)"
  />
  <NumberInput
    :value="yPos"
    label="Y position"
    @op="(op: any) => changed('y', op)"
  />
  <NumberInput
    :value="height"
    label="Height"
    @op="(op: any) => changed('height', op)"
  />
  <NumberInput
    :value="width"
    label="Width"
    @op="(op: any) => changed('width', op)"
  />
  <DropdownInput
    :value="dataset"
    :options="datasets?.map((d) => ({ name: d.display, value: d.name })) || []"
    label="Dataset"
    @op="(op) => changed('data', op)"
  />
  <DropdownInput
    :value="categories"
    :options="validCategories || []"
    label="Categores from"
    @op="(op) => changed('categories', op)"
  />
  <DropdownInput
    :value="values"
    :options="validCategories || []"
    label="Values from"
    @op="(op) => changed('values', op)"
  />
</template>
