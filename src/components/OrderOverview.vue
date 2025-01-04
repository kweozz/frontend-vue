<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Order Overview</h1>
    <table class="min-w-full bg-white border border-gray-200">
      <thead>
        <tr class="bg-gray-100">
          <th class="py-2 px-4 border-b">Order Number</th>
          <th class="py-2 px-4 border-b">Customer Name</th>
          <th class="py-2 px-4 border-b">Shoe Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order._id" class="hover:bg-gray-50">
          <td class="py-2 px-4 border-b">{{ order._id }}</td>
          <td class="py-2 px-4 border-b">{{ order.user }}</td>
          <td class="py-2 px-4 border-b">{{ order.shoeName }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'OrderOverview',
  data() {
    return {
      orders: undefined
    };
  },
  mounted() {
    axios.get('https://node-api-backend-v1.onrender.com/api/v1/orders/')
      .then(response => {
        console.log(response.data.data.orders);
        this.orders = response.data.data.orders;
      });
  },
});
</script>

