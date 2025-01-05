<template>
  <div id="app">
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