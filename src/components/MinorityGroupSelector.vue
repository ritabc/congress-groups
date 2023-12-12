<template>
  <b-row class="group-selector-header py-2">
    <b-col offset-lg="3" lg="7">
      <b-form-select
        v-model="group"
        v-bind:options="groups"
        v-on:change="updateSelectedGroup"
        class="mx-3"
      ></b-form-select>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "MinorityGroupSelector",
  data() {
    return {
      group: "Black",
      groups: [
        { value: "Black", text: "Show Black Americans In Congress" },
        { value: "Women", text: "Show Female Americans In Congress" },
        { value: "Hispanic", text: "Show Hispanic Americans In Congress" },
        {
          value: "APA",
          text: "Show Asian Pacific Islander Americans In Congress",
        },
      ],
    };
  },
  methods: {
    updateSelectedGroup() {
      this.$emit("group-changed", this.group);
    },
  },
};
</script>

<style>
.group-selector-header {
  background-color: steelblue;
}
</style>
