<template>
  <b-form-select
    v-model="group"
    v-bind:options="groups"
    v-on:change="updateSelectedGroup"
    class="mx-3"
  ></b-form-select>
</template>

<script>
export default {
  name: "MinorityGroupSelector",
  data() {
    return {
      group: "Black",
      groups: [
        { value: "Black", text: "Showing Black Americans In Congress" },
        { value: "Women", text: "Showing Female Americans In Congress" },
        { value: "Hispanic", text: "Showing Hispanic Americans In Congress" },
        {
          value: "APA",
          text: "Showing Asian Pacific Islander Americans In Congress",
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
