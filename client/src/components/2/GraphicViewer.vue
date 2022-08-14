<script setup lang="ts">
import { acceptHMRUpdate } from "pinia";
import { View, parse, type Spec, truthy } from "vega";
import { onMounted, ref, watch } from "vue";

const props = defineProps<{
  spec: any;
}>();
const emit = defineEmits<{
  (
    event: "datasetsChanged",
    data: { name: string; display: string; keys: string[] }[]
  ): void;
}>();
const viz = ref(null as unknown as HTMLElement);
const canRenderSpec = ref(false);
const dataSources = ref([]);

let view: View;

const renderViz = async () => {
  const vegaSpec: Spec = {
    $schema: "https://vega.github.io/schema/vega/v5.json",
    width: props.spec.width,
    height: props.spec.height,
    padding: 14,
    autosize: "pad",
    data: [
      ...props.spec.data.map((d: any) => ({
        name: d._id,
        url: d.url,
        format: { type: "csv" },
        transform: [
          ...d.transforms.map((d: any) => {
            if (d.type == "toDate") {
              return {
                type: "formula",
                as: d.key,
                expr: `datetime(datum['${d.field}'])`,
              };
            }
          }),
        ],
      })),
      {
        name: "TEST",
        values: [
          { v1: 42, v2: 0, c: "a" },
          { v1: 24, v2: 1, c: "a" },
          { v1: 12, v2: 2, c: "a" },
          { v1: 43, v2: 3, c: "a" },
          { v1: 65, v2: 4, c: "a" },
          { v1: 11, v2: 0, c: "b" },
          { v1: 53, v2: 1, c: "b" },
          { v1: 21, v2: 2, c: "b" },
          { v1: 33, v2: 3, c: "b" },
          { v1: 15, v2: 4, c: "b" },
        ],
      },
    ],

    signals: [
      ...props.spec.charts.map((d: any) => ({
        name: `s_${d._id}_width`,
        value: d.width,
      })),
      ...props.spec.charts.map((d: any) => ({
        name: `s_${d._id}_height`,
        value: d.height,
      })),
    ],

    marks: [
      ...props.spec.charts.map((d: any) => {
        switch (d.type) {
          case "pie":
            return {
              type: "group",
              encode: {
                update: {
                  x: { value: d.x },
                  y: { value: d.y },
                  width: { signal: `s_${d._id}_width` },
                  height: { value: `s_${d._id}_height` },
                },
              },

              data: [
                {
                  source: d.data,
                  name: d._id,
                  transform: [
                    {
                      type: "pie",
                      field: d.values,
                      sort: true,
                    },
                  ],
                },
              ],

              scales: [
                {
                  name: "color",
                  type: "ordinal",
                  domain: { data: d._id, field: d.categories },
                  range: { scheme: "category20" },
                },
              ],

              marks: [
                {
                  type: "arc",
                  from: { data: d._id },
                  encode: {
                    enter: {
                      fill: { scale: "color", field: d.categories },
                      x: { signal: `s_${d._id}_width / 2` },
                      y: { signal: `s_${d._id}_height / 2` },
                    },
                    update: {
                      startAngle: { field: "startAngle" },
                      endAngle: { field: "endAngle" },
                      // padAngle: { signal: "padAngle" },
                      // innerRadius: { signal: "innerRadius" },
                      outerRadius: { signal: `s_${d._id}_width / 2` },
                      // cornerRadius: { signal: "cornerRadius" },
                    },
                  },
                },
              ],
            };

          case "bar":
            return {
              type: "group",
              encode: {
                update: {
                  x: { value: d.x },
                  y: { value: d.y },
                  width: { signal: `s_${d._id}_width` },
                  height: { signal: `s_${d._id}_height` },
                },
              },
              signals: [
                {
                  name: "width",
                  value: d.width,
                },
                {
                  name: "height",
                  value: d.height,
                },
              ],

              scales: [
                {
                  name: "xscale",
                  type: "band",
                  domain: { data: d.data, field: d.categories },
                  padding: 0.05,
                  round: true,
                  range: "width",
                },
                {
                  name: "yscale",
                  domain: { data: d.data, field: d.values },
                  nice: true,
                  range: "height",
                },
              ],

              axes: [
                {
                  orient: "bottom",
                  scale: "xscale",
                  labelAngle: d.labelAngle,
                  labelAlign: d.labelAlign,
                },
                {
                  orient: "left",
                  scale: "yscale",
                },
              ],

              marks: [
                {
                  type: "rect",
                  from: { data: d.data },
                  encode: {
                    enter: {
                      x: { scale: "xscale", field: d.categories },
                      width: { scale: "xscale", band: 1 },
                      y: { scale: "yscale", field: d.values },
                      y2: { scale: "yscale", value: 0 },
                    },
                  },
                },
              ],
            };

          case "line":
            return {
              type: "group",
              encode: {
                update: {
                  x: { value: d.x },
                  y: { value: d.y },
                  width: { signal: `s_${d._id}_width` },
                  height: { signal: `s_${d._id}_height` },
                },
              },
              signals: [
                {
                  name: "width",
                  value: d.width,
                },
                {
                  name: "height",
                  value: d.height,
                },
              ],

              scales: [
                {
                  name: "xscale",
                  type: "linear",
                  domain: { data: d.data, field: d.xField },
                  round: true,
                  range: "width",
                },
                {
                  name: "yscale",
                  type: "linear",
                  domain: { data: d.data, field: d.yField },
                  nice: true,
                  range: "height",
                },
              ],

              axes: [
                {
                  orient: "bottom",
                  scale: "xscale",
                },
                {
                  orient: "left",
                  scale: "yscale",
                },
              ],

              marks: [
                {
                  type: "line",
                  from: { data: d.data },
                  encode: {
                    enter: {
                      x: { scale: "xscale", field: d.xField },
                      y: { scale: "yscale", field: d.yField },
                      strokeWidth: { value: 2 },
                    },
                  },
                },
              ],
            };

          default:
            throw new Error("Unknown type " + d.type);
        }
      }),
    ],
  };
  try {
    console.log(
      "render",
      JSON.stringify(vegaSpec, null, 2),
      vegaSpec,
      viz.value
    );
    if (view) {
      view.finalize();
    }
    view = new View(parse(vegaSpec), {
      renderer: "svg",
      container: viz.value,
      hover: true,
    });
    await view.runAsync();

    props.spec.data.map((d: any) => {
      console.log(d._id, view.data(d._id));
    });
    console.log(
      view.getState({
        data: truthy,
      })
    );
    const dataSets = view.getState({
      data: truthy,
    }).data;
    emit(
      "datasetsChanged",
      Object.keys(dataSets).map((k) => {
        const display = (
          props.spec.data.find((d: any) => d._id == k) || { name: k }
        ).name;
        if (Array.isArray(dataSets[k])) {
          return {
            name: k,
            display: display,
            keys: Object.keys(dataSets[k][0]),
          };
        }

        // Data is a object, sometimes happens with transforms
        const subKeys = Object.keys(dataSets[k]);
        if (subKeys.length == 0) {
          return { name: k, display: display, keys: [] };
        }
        return {
          name: k,
          display: display,
          keys: Object.keys(dataSets[k][subKeys[0]]),
        };
      }, {} as { name: string; keys: string[] }[])
    );

    canRenderSpec.value = true;
  } catch (e) {
    console.error("caught", e);
    canRenderSpec.value = false;
  }
};

watch(
  () => props.spec,
  () => {
    console.log("AA");
    renderViz();
  }
);

onMounted(() => {
  console.log(viz);
  renderViz();
});
</script>
<template>
  <div ref="viz"></div>
</template>
