<template>
  <div class="order_management">
    <v-skeleton-loader
      :loading="loading"
      style="background-color: transparent"
      type="image, list-item-two-line"
    >
      <v-responsive>
        <div>
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
          <!-- download -->
          <v-row class="pt-5 shop_invoice">
            <v-col lg="4" class="pt-5"> </v-col>
            <v-col lg="8" cols="12" class="text-right">
              <v-btn
                class="download_invoice"
                variant="none"
                @click="generateInvoicePdf()"
                ><span class="text">Download Invoice</span></v-btn
              >
            </v-col>
          </v-row>

          <!-- pdf content -->
          <div ref="pdfContent">
            <div class="order_management">
              <div class="pt-15"></div>

              <div>
                <!-- invoice content -->
                <v-container class="shop_invoice">
                  <div class="header">
                    <v-row>
                      <v-col lg="7" class="left_col">
                        <!-- invoice from -->
                        <div>
                          <span class="company_name">{{ company_name }}</span>
                        </div>

                        <!-- supplier -->
                        <div class="pt-7"></div>
                        <div class="invoice_to">
                          <span class="company_name">
                            {{ summary.suplier_name }}</span
                          >
                          <br />
                          <span class="company_text">{{
                            summary.suplier_address
                          }}</span>
                          <br />
                          <span class="company_text"
                            >{{ summary.contact_no }}
                          </span>
                        </div>
                      </v-col>
                      <v-col lg="5" class="right_col">
                        <v-row>
                          <v-col lg="6">
                            <div class="invoice_no text-center">
                              <span class="text">INVOICE</span>
                            </div>
                          </v-col>

                          <v-col lg="6" class="pt-4">
                            <span class="text-1">{{
                              summary.purchased_reference_id
                            }}</span>
                          </v-col>
                        </v-row>
                        <div class="pt-1"></div>
                        <span class="client_text"
                          >Purchase Date :
                          {{ summary.purchased_date }}</span
                        >
                        <div class="pt-1"></div>
                        <span class="client_text"
                          >Receiving Invoice Number :
                          {{ summary.receiving_invoice_no || "N/A" }}
                        </span>
                        <div class="pt-1"></div>
                      </v-col>
                    </v-row>
                  </div>
                </v-container>

                <!-- purchase order summary -->
                <div class="order_summary">
                  <!-- content -->
                  <div>
                    <div class="pt-8"></div>

                    <table
                      class="table table-sm table_borders"
                      sortable
                      style="width: 100%"
                    >
                      <thead>
                        <tr class="table_header table_borders">
                          <th class="text table_borders">Product Code</th>
                          <th class="text table_borders">Product Name</th>
                          <th class="text table_borders">Purchase Type</th>
                          <th class="text table_borders">Quantity</th>
                          <th class="text table_borders">Unit Price</th>
                          <th class="text table_borders">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          style="page-break-inside: avoid"
                          class="table-data table_borders"
                          v-for="product in summary.order_items"
                          :key="product"
                        >
                          <td class="text table_borders">
                            {{ product.product_code }}
                          </td>
                          <td class="text table_borders">
                            {{ product.product_name }}
                          </td>
                          <td class="text table_borders">
                            {{ purchaseTypeLabel(product.pivot) }}
                          </td>
                          <td class="text table_borders">
                            {{ quantityLabel(product.pivot) }}
                          </td>
                          <td class="text table_borders">
                            {{ getPrice(unitPrice(product.pivot)) }}
                          </td>
                          <td class="text table_borders">
                            {{ getPrice(product.pivot.total_amount) }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="pt-2"></div>
                    <div class="text-end pr-5">
                      <span class="total"
                        >TOTAL :
                        {{ getPrice(summary.purchase_total) }}</span
                      >
                    </div>
                    <div class="pt-5"></div>
                  </div>
                </div>

                <div class="pt-5"></div>
                <center class="shop_invoice">
                  <span class="footer_note"
                    >Received above goods in good condition</span
                  >
                </center>
                <div class="pt-5"></div>
                <v-container class="pl-10 pr-10 shop_invoice">
                  <v-row>
                    <v-col lg="4" class="pt-16 mt-5">
                      <span>
                        ............................
                        <br />
                        <span class="footer_note">Received By</span>
                      </span>
                    </v-col>
                    <v-col lg="4" class="pt-16 mt-5">
                      <span>
                        ............................
                        <br />
                        <span class="footer_note">Prepared By</span>
                      </span></v-col
                    >
                    <v-col lg="4">
                      <span>
                        <br />
                        <span class="footer_note">
                          Authorized Signature
                          <br />
                          {{ company_name }}</span
                        >
                      </span></v-col
                    >
                  </v-row>
                </v-container>
              </div>
            </div>
          </div>
        </div>
      </v-responsive>
    </v-skeleton-loader>
  </div>
</template>
<script>
import SupplierApi from "@/Api/Modules/supply_chain";
import html2pdf from "html2pdf.js";

export default {
  data() {
    return {
      loading: false,
      summary: {},
    };
  },

  async created() {
    await this.orderSummary();
  },

  methods: {
    async orderSummary() {
      this.loading = true;

      const payload = {
        order_id: this.$route.params.order_id,
        suplier_id: this.$route.params.supplier_id,
      };
      const res = await SupplierApi.suplierInvoice(payload);

      this.summary = res.data.data || {};

      this.loading = false;
    },

    // human-readable label for a product line item's purchase type
    purchaseTypeLabel(pivot) {
      if (pivot.purchase_type === "individual_units") return "Single Items";
      if (pivot.purchase_type === "bulk") return "Loose (Weight)";
      if (pivot.purchase_type === "fixedpacks") return "Packets";
      return "N/A";
    },

    // quantity shown per purchase type, matching how PurchasedSummary.vue
    // renders the same pivot fields
    quantityLabel(pivot) {
      if (pivot.purchase_type === "individual_units") {
        return pivot.individual_items_quantity;
      }
      if (pivot.purchase_type === "fixedpacks") {
        return `${pivot.packs_quantity} Packets(${pivot.fixed_pack_size} Kg)`;
      }
      if (pivot.purchase_type === "bulk") {
        return `${pivot.bulk_product_stock_weight} Kg`;
      }
      return "N/A";
    },

    // unit price per purchase type
    unitPrice(pivot) {
      if (pivot.purchase_type === "individual_units") {
        return pivot.item_unit_price;
      }
      if (pivot.purchase_type === "bulk") {
        return pivot.bulk_item_weight_unit_price;
      }
      if (pivot.purchase_type === "fixedpacks") {
        return pivot.fixed_pack_size * pivot.bulk_item_weight_unit_price;
      }
      return null;
    },

    // invoice generation
    generateInvoicePdf() {
      const element = this.$refs.pdfContent;

      const options = {
        margin: 0,
        filename:
          `Supplierinvoice` + ` - ` + this.summary.purchased_reference_id + `.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: [230, 360], orientation: "portrait" },
      };

      html2pdf().set(options).from(element).save();
    },
  },
};
</script>
