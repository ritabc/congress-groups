<template>
  <div class="px-2 py-2">
    <h2>{{ title }}</h2>
    <p>
      The data for this project comes from
      <a href="history.house.gov">history.house.gov</a>, which provides
      historical data on minority groups serving in congress, including Black
      Americans, Women, Hispanic Americans, and Asian/Pacific Islander
      Americans.
    </p>
    <p>
      The inspiration for this site came about while a friend and I were reading
      Ibram X. Kendi's
      <a href="https://www.ibramxkendi.com/stamped">
        Stamped from the Beginning: The Definitive History of Racist Ideas in
        America</a
      >.
    </p>
    <p>
      With this site, I wanted to visualize the period during and directly after
      Reconstruction, when Black Americans were first able to participate in
      politics, and were then later denied access through poll taxes & voting
      literacy tests.
    </p>
    <p>
      This history is important to visualize and understand, as it runs counter
      to the popular idea that Black/White race relations are continuosly
      improving in our country.
    </p>
    <p>
      I was also interested in answering the question: When did the majority of
      Black American politicians switch from the Republican to Democratic party?
    </p>
    <p>
      This data was collected in October 2020, and this site currently displays
      only data from the 50 US States for politicians serving in the US House of
      Representatives (not the Senate).
    </p>
  </div>
</template>

<script>
export default {
  name: "sidebar",
  props: { title: String },
};
</script>

<style scoped>
</style>