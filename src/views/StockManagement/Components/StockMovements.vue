<template>
  <div class="masterdata">
    <v-skeleton-loader
      :loading="loading"
      style="background-color: transparent"
      type="image, list-item-two-line"
    >
      <v-responsive>
        <span class="table_topic">Stock In / Stock Out History</span>
        <div class="pt-3"></div>
        <table
          class="table table-sm table_borders"
          sortable
          style="width: 100%"
        >
          <thead>
            <tr class="table_header table_borders">
              <th class="text table_borders">Date</th>
              <th class="text table_borders">Type</th>
              <th class="text table_borders">Quantity</th>
              <th class="text table_borders">Reason</th>
              <th class="text table_borders">Last Updated By</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="movement in movements"
              :key="movement.id"
              style="page-break-inside: avoid"
              class="table-data table_borders"
            >
              <td class="text table_borders">
                {{ momentFormat(movement.created_at, "YYYY-MM-DD HH:mm") }}
              </td>
              <td class="text table_borders">
                <span v-if="movement.type === 'in'" style="color: green">
                  Stock In</span
                >
                <span v-else style="color: red"> Stock Out</span>
              </td>
              <td class="text table_borders">
                {{ movement.quantity }}
              </td>
              <td class="text table_borders">
                {{ movement.reason }}
              </td>
              <td class="text table_borders">
                {{ movement.last_updated_by }}
              </td>
            </tr>
          </tbody>
        </table>
      </v-responsive>
    </v-skeleton-loader>
  </div>
</template>
<script>
import ProductApi from "@/Api/Modules/products";
import commonmixins from "@/mixins/commonmixins";

export default {
  mixins: [commonmixins],

  props: {
    selectedItem: Object,
  },

  data() {
    return {
      movements: [],
      loading: false,
    };
  },

  async created() {
    await this.getStockMovements();
  },

  methods: {
    // get stock in/out history for the selected product
    async getStockMovements() {
      this.loading = true;
      const res = await ProductApi.stockMovements({
        product_id: this.selectedItem.id,
        page: 1,
        per_page: 1000,
      });
      this.movements = res.data.data.data;
      this.loading = false;
    },
  },
};
</script>
