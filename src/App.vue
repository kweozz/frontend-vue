<template>
  <div id="app">
    <h1>Fetch Order Data - Tutorial</h1>
    <OrderOverview />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import OrderOverview from './components/OrderOverview.vue';

export default defineComponent({
  name: 'App',
  components: {
    OrderOverview
  }
});
</script>