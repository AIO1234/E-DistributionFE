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
          <v-row class="pt-5 salesrep_invoice">
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
              <div class="pt-15"></div>

              <div>
                <!-- invoice content -->
                <v-container class="salesrep_invoice">
                  <div class="header">
                    <v-row>
                      <v-col lg="7" class="left_col">
                        <!-- invoice from -->
                        <div>
                          <span class="company_name"
                            >AIO-IT SOLUTIONS(PRIVATE) LIMITED</span
                          >
                          <br />
                          <span class="company_text"
                            >No.291/4 , Ranaviru Dharmasiri Mawatha , Sooriyapaluwa , Kadawatha ,Gampaha.</span
                          >
                          <br />
                          <span class="company_text"
                            >071 345 3110
                          </span>
                          <br />
                          <span class="company_text">aio99solutions@gmail.com</span>
                          <br />
                          <span class="company_text"
                            >https://aio-tutor.lk
                          </span>
                        </div>

                        <!-- invoice to -->
                        <div class="pt-7"></div>
                        <div class="invoice_to">
                          <span class="company_name">
                            {{
                              summary.subdistributer.subdistributer_name
                            }}</span
                          >
                          <br />
                          <span class="company_text">{{
                            summary.subdistributer.subdistributer_address
                          }}</span>
                          <br />
                          <span class="company_text"
                            >{{ summary.subdistributer.subdistributer_mobile }}
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
                              summary.main_order_details.invoice_no
                            }}</span>
                          </v-col>
                        </v-row>
                        <div class="pt-1"></div>
                        <span class="client_text"
                          >Invoice Date :
                          {{ summary.main_order_details.order_date }}</span
                        >
                        <div class="pt-1"></div>
                        <span class="client_text"
                          >Order No :
                          {{
                            summary.main_order_details.order_reference_id
                          }}</span
                        >
                        <div class="pt-1"></div>
                        <span class="client_text"
                          >Distributor Code :
                          {{ summary.distributer.distributer_code }}
                        </span>
                        <div class="pt-1"></div>
                        <span class="client_text"
                          >Area Code :
                          {{ summary.subdistributer.area_code }}
                        </span>
                        <div class="pt-1"></div>
                        <span class="client_text"
                          >Sub Distributer Code :
                          {{ summary.subdistributer.subdistributer_code }}
                        </span>
                        <div class="pt-1"></div>
                      </v-col>
                    </v-row>
                  </div>
                </v-container>

                <!-- factory order summary -->
                <div class="order_summary">
                  <!-- content -->
                  <div>
                    <!-- <span class="sub_title">Summary</span> -->

                    <div class="pt-8"></div>

                    <table
                      class="table table-sm table_borders"
                      sortable
                      style="width: 100%"
                    >
                      <!-- table collumns -->
                      <thead>
                        <tr class="table_header table_borders">
                          <th class="text table_borders">Product Code</th>
                          <th class="text table_borders">Product Name</th>
                          <th class="text table_borders">Unit Size</th>
                          <th class="text table_borders">Qty</th>
                          <th class="text table_borders">Unit Price(Rs)</th>
                          <th class="text table_borders">Discount</th>
                          <th class="text table_borders">Discount Value</th>
                          <th class="text table_borders">Discounted Value</th>
                          <th class="text table_borders">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          style="page-break-inside: avoid"
                          class="table-data table_borders"
                          v-for="product in summary.main_order_details
                            .subdistributer_order_items"
                          :key="product"
                        >
                          <!-- product code -->
                          <td class="text table_borders">
                            {{ product.product_code }}
                          </td>

                          <!-- product name -->
                          <td class="text table_borders">
                            {{ product.product_name }}
                          </td>

                          <!-- product volume -->
                          <td
                            class="text table_borders"
                            v-if="product.product_type === 'Liquid'"
                          >
                            {{ getVolume(product.product_volume) }}
                          </td>
                          <!-- product weight -->
                          <td
                            class="text table_borders"
                            v-else-if="product.product_type === 'Solid'"
                          >
                            {{ getWeight(product.product_weight) }}
                          </td>

                          <!-- product quantity -->
                          <td class="text table_borders">
                            {{ product.pivot.quantity }}
                          </td>

                          <!-- product unit price -->
                          <td class="text table_borders">
                            {{ getPrice(product.pivot.unit_price) }}
                          </td>

                          <!-- product discount -->
                          <td class="text table_borders">
                            <span v-if="product.pivot.discount !== null">
                              {{
                                returnPercentage(product.pivot.discount)
                              }}</span
                            >
                            <span> N/A</span>
                          </td>

                          <!-- prodct discount vaalue -->
                          <td class="text table_borders">
                            {{ getPrice(product.pivot.discount_value) }}
                          </td>

                          <!-- discount price -->
                          <td class="text table_borders">
                            {{ getPrice(product.pivot.discounted_price) }}
                          </td>

                          <!-- price -->
                          <td class="text table_borders">
                            {{ getPrice(product.pivot.price) }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="pt-2"></div>
                    <div class="text-end pr-5">
                      <!-- full order total -->
                      <span class="total"
                        >TOTAL :
                        {{
                          getPrice(summary.main_order_details.order_amount)
                        }}</span
                      >
                    </div>
                    <div class="pt-8"></div>

                    <!-- content card -->
                  </div>
                </div>
                <!-- footer -->
                <div class="salesrep_invoice ml-7 mr-7">
                  <span class="footer_note"
                    >NOTE -
                    <div class="pt-1"></div>
                    Total invoice value:
                    {{ getPrice(summary.main_order_details.order_amount) }}
                    <div class="pt-1"></div>
                    All cheques should be drawn in favour of "AIO-IT SOLUTIONS(PRIVATE) LIMITED"
                  </span>
                </div>

                <div class="pt-15"></div>
                <center class="salesrep_invoice">
                  <span class="footer_note"
                    >Received above goods in good condition</span
                  >
                </center>
                <div class="pt-15"></div>
                <v-container class="pl-10 pr-10 salesrep_invoice">
                  <v-row>
                    <v-col lg="4">
                      <span>
                        ............................
                        <br />
                        <span class="footer_note pl-4">Received By</span>
                      </span></v-col
                    >
                    <v-col lg="4">
                      <span>
                        ............................
                        <br />
                        <span class="footer_note pl-4">Prepared By</span>
                      </span></v-col
                    >
                    <v-col lg="4">
                      <span>
                    
                        <br />
                        <span class="footer_note">
                          Authorized Signature
                          <br />
                          Yasindu Ramanayake
                          <br />
                          anaging Disrector
                          <br />
                          AIO-IT SOLUTIONS(PRIVATE) LIMITED</span
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
import SuDistributerOrderApi from "@/Api/Modules/sub_distributer";
import html2pdf from "html2pdf.js";
export default {
  data() {
    return {
      summary: {
        loading: false,
        main_order_details: {},
        distributer: {},
        subdistributer: {},
      },
    };
  },

  async created() {
    await this.orderSummary();
  },
  methods: {
    // order summary
    async orderSummary() {
      this.loading = true;
      // if route comming from sales rep order

      const payload = {
        subdis_order_id: this.$route.params.order_id,
      };
      const res = await SuDistributerOrderApi.SubDistributerInvoice(payload);

      this.summary.main_order_details = res.data.data.subdisordersummary;

      this.summary.distributer = res.data.data.subdisordersummary.distributer;

      this.summary.subdistributer =
        res.data.data.subdisordersummary.subdistributer;

      this.loading = false;
    },

    // invoice generation

    generateInvoicePdf() {
      const element = this.$refs.pdfContent; // Reference the content to convert

      // Set PDF options (optional)
      const options = {
        margin: 0,
        filename:
          `SubDistributerinvoice` +
          ` - ` +
          this.summary.main_order_details.invoice_no +
          `.pdf`,

        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 }, // Adjust canvas resolution
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, // PDF settings
      };

      // Generate the PDF from the HTML content
      html2pdf().set(options).from(element).save();
    },
  },
};
</script>
