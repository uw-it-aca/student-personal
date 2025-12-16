<template>
  <ul class="list-unstyled" style="max-width: 250px">
    <li>
      <BPlaceholder variant="secondary" cols="10" animation="glow"/>
    </li>
    <li>
      <BPlaceholder variant="secondary" cols="8" animation="glow"/>
    </li>
    <li>
      <BPlaceholder variant="secondary" cols="6" animation="glow"/>
    </li>
    <li>
      <BPlaceholder variant="secondary" cols="12" animation="glow"/>
    </li>
  </ul>
</template>

<script>
  import { BPlaceholder } from "bootstrap-vue-next";
  export default {
    components: {
      BPlaceholder,
    },
  };
</script>
