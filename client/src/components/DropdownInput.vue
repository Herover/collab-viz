<script setup lang="ts">
import { computed, ref, watch } from "vue";

const emit = defineEmits<{
  (event: "op", data: unknown): void;
}>();

const props = defineProps<{
  value: string;
  options: string[] | { value: string; name: string }[];
  label: string;
}>();

const value = ref(props.value);
watch(
  () => props.value,
  () => {
    value.value = props.value;
  }
);

const coptions = computed(() => {
  if (props.options.length == 0) {
    return [];
  }

  if (typeof props.options[0] == "string") {
    return props.options.map((d) => ({
      val: d,
      name: d,
    }));
  }

  return props.options.map((d: any) => ({
    val: d.value,
    name: d.name,
  }));
});

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
      <option v-for="o in coptions" :key="o.val" :value="o.val">
        {{ o.name }}
      </option>
    </select>
  </div>
</template>
