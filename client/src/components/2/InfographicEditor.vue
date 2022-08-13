<script lang="ts" setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import PieChartEditor from "./PieChartEditor.vue";

const props = defineProps<{
  spec: any;
}>();
const emit = defineEmits<{
  (event: "op", data: unknown): void;
}>();
const router = useRouter();

const spec = ref(props.spec);
watch(
  () => props.spec,
  () => {
    spec.value = props.spec;
    console.log("editor spec updated");
  }
);

const changed = (path: (number | string)[], op: any) => {
  emit("op", path.concat(op));
};
</script>
<template>
  <div v-if="spec">
    <span>Data</span>
    <div v-for="d in spec.data" :key="d._id" class="editor-panel">
      <span class="panel-title">{{ d.name }}</span>
    </div>
    <span>Charts</span>
    <div v-for="(c, index) in spec.charts" :key="c._id" class="editor-panel">
      <PieChartEditor
        v-if="c.type == 'pie'"
        :chart="c"
        @op="(op) => changed(['charts', index], op)"
      />
    </div>
  </div>
</template>

<style>
.editor-panel {
  width: 300px;
  border: 1px solid black;
}
</style>
