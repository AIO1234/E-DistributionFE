<template>
  <div class="return_management">
    <div class="return_summary">
      <div class="pt-2"></div>
      <v-row>
        <v-col lg="9" cols="12">
          <!-- back button -->
          <v-btn
            class="back_button"
            variant="none"
            @click="$router.back()"
            elevation="6"
          >
            <v-icon icon="tabler-chevron-left" class="text"></v-icon>
            <span class="text pl-2">Back</span></v-btn
          >
        </v-col>

        <!-- export button -->
        <v-col lg="3" cols="12" class="text-right">
          <div class="pt-1"></div>
          <v-btn class="exfort_button" variant="none">
            <download-excel
              :data="summary.return_products"
              :fields="collumns"
              :worksheet="`${summary.invoice_no} Return Summary Report`"
              :name="`${summary.invoice_no} returnsummary.xls`"
            >
              <span class="text">Export</span>
            </download-excel>
          </v-btn>
        </v-col>
      </v-row>
      <div class="pt-5"></div>

      <v-skeleton-loader
        :loading="loading"
        height="240"
        type="image, list-item-two-line"
        style="background-color: transparent"
      >
        <v-responsive>
          <!-- basic details -->
          <v-row>
            <v-col lg="9" class="pt-5" cols="12">
              <h2 class="heading">Return Code - {{ summary.return_code }}</h2>
            </v-col>
            <v-col lg="3" cols="12" class="pt-6">
              <div class="justify-content-end">
                <span class="right_heading">Shop Name :</span>
                <span class="right_heading"> {{ summary.shop_name }}</span>

                <div class="pt-2"></div>

                <span class="right_heading">Order No :</span>
                <span class="right_heading">
                  {{ summary.order_reference_id }}</span
                >

                <div class="pt-2"></div>

                <span class="right_heading">Invoice No :</span>
                <span class="right_heading"> {{ summary.invoice_no }}</span>
              </div>
            </v-col>
          </v-row>

          <div class="pt-5"></div>
          <!-- table contents -->

          <div class="table-content">
            <span class="table-header"> Return Products </span>

            <div class="pt-4"></div>

            <div class="hrclass"></div>

            <div class="pt-4"></div>

            <v-table min-height="300px">
              <thead>
                <tr>
                  <th class="thclass">Product Code</th>
                  <th class="thclass">Product Name</th>
                  <th class="thclass">Unit Size</th>
                  <th class="thclass">Qty</th>
                  <th class="thclass">Unit Price(Rs)</th>
                  <th class="thclass">Value(Rs)</th>
                  <th class="thclass">Return Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in summary.return_products" :key="product">
                  <td class="tdclass">{{ product.product_code }}</td>
                  <td class="tdclass">{{ product.product_name }}</td>
                  <td class="tdclass" v-if="product.product_type === 'Solid'">
                    {{ getWeight(product.product_weight) }}
                  </td>
                  <td
                    class="tdclass"
                    v-else-if="product.product_type === 'Liquid'"
                  >
                    {{ getVolume(product.product_volume) }}
                  </td>
                  <td class="tdclass">{{ product.pivot.return_count }}</td>
                  <td class="tdclass">{{ product.pivot.unit_price }}</td>
                  <td class="tdclass">{{ product.pivot.return_amount }}</td>
                  <td class="tdclass">{{ product.pivot.reason_type }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>
        </v-responsive>
      </v-skeleton-loader>
    </div>
  </div>
</template>
<script>
import ReturnApi from "@/Api/Modules/returns";
import JsonExcel from "vue-json-excel3";
export default {
  components: {
    downloadExcel: JsonExcel,
  },
  data() {
    return {
      loading: false,
      summary: {},
      collumns: {
        "Product Code": "product_code",
        "Product Name": "product_name",
        "Product Type": "product_type",
        "Product Weight(kg)": "product_weight",
        "Product Volume(l)": "product_volume",
        "Product Amount(Rs)": "pivot.unit_price",
        "Return Quantity": "pivot.return_count",
        "Return Amount(Rs)": "pivot.return_amount",
        "Return Reason": "pivot.reason_type",
      },
    };
  },

  async created() {
    await this.returnSummary();
  },
  methods: {
    // get return summary

    async returnSummary() {
      this.loading = true;
      const payload = {
        id: this.$route.params.id,
      };
      const res = await ReturnApi.shopReturnInnerSummary(payload);

      this.summary = res.data.data;

      this.loading = false;
    },
  },
};
</script>
