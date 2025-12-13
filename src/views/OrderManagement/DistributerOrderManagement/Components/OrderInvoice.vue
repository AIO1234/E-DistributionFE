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
          <v-row class="pt-5 distributer_invoice">
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
                <v-container class="distributer_invoice">
                  <div class="header">
                    <v-row>
                      <v-col lg="7" class="left_col">
                        <!-- invoice from -->
                        <div>
                          <span class="company_name"
                            >AIO-IT SOLUTIONS (PVT)LTD</span
                          >
                          <br />
                          <span class="company_text"
                            >No.291/4 , Ranaviru Dharmasiri Mawatha ,
                            Sooriyapaluwa , Kadawatha ,Gampaha.</span
                          >
                          <br />
                          <span class="company_text">+94 71 345 3110</span>
                          <br />
                          <span class="company_text"
                            >aio99solutions@gmail.com</span
                          >
                          <br />
                          <span class="company_text"
                            >https://aio-tutor.lk
                          </span>
                        </div>

                        <!-- invoice to -->
                        <div class="pt-7"></div>
                        <div class="invoice_to">
                          <span class="company_name">
                            {{ summary.distributer.distributer_name }}</span
                          >
                          <br />
                          <span class="company_text">{{
                            summary.distributer.distributer_address
                          }}</span>
                          <br />
                          <span class="company_text"
                            >{{ summary.distributer.distributer_mobile }}
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
                          {{ summary.distributer.area_code }}
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
                      <thead>
                        <tr class="table_header table_borders">
                          <th class="text table_borders">Product Code</th>
                          <th class="text table_borders">Product Name</th>
                          <th class="text table_borders">Unit Size</th>
                          <th class="text table_borders">Qty</th>
                          <th class="text table_borders">Unit Price(Rs)</th>
                          <th class="text table_borders">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          style="page-break-inside: avoid"
                          class="table-data table_borders"
                          v-for="product in summary.main_order_details
                            .distributer_order_items"
                          :key="product"
                        >
                          <td class="text table_borders">
                            {{ product.product_code }}
                          </td>
                          <td class="text table_borders">
                            {{ product.product_name }}
                          </td>
                          <td
                            class="text table_borders"
                            v-if="product.product_type === 'Liquid'"
                          >
                            {{ getVolume(product.product_volume) }}
                          </td>
                          <td
                            class="text table_borders"
                            v-else-if="product.product_type === 'Solid'"
                          >
                            {{ getWeight(product.product_weight) }}
                          </td>
                          <td class="text table_borders">
                            {{ product.pivot.quantity }}
                          </td>
                          <td class="text table_borders">
                            {{ getPrice(product.pivot.unit_price) }}
                          </td>
                          <td class="text table_borders">
                            {{ getPrice(product.pivot.price) }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="pt-2"></div>
                    <div class="text-end pr-5">
                      <span class="total"
                        >TOTAL :
                        {{
                          getPrice(summary.main_order_details.order_amount)
                        }}</span
                      >
                    </div>
                    <div class="pt-5"></div>

                    <!-- content card -->
                  </div>
                </div>

                <div class="distributer_invoice ml-7 mr-7">
                  <span class="footer_note"
                    >NOTE -
                    <div class="pt-1"></div>
                    Total invoice value:
                    {{ getPrice(summary.main_order_details.order_amount) }}
                    <div class="pt-1"></div>
                    All cheques should be drawn in favour of "AIO-IT
                    SOLUTIONS(PRIVATE) LIMITED"
                  </span>

                  <br /><br />

                  <span class="footer_note">
                    Bank Details :
                    <div class="pt-1"></div>
                    Bank - Commercial Bank <br />
                    Branch - Nugegoda Branch <br />
                    Account No - 1000586877
                  </span>
                </div>

                <div class="pt-5"></div>
                <center class="distributer_invoice">
                  <span class="footer_note"
                    >Received above goods in good condition</span
                  >
                </center>
                <div class="pt-5"></div>
                <v-container class="pl-10 pr-10 distributer_invoice">
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
                          Yasindu Ramanayake
                          <br />
                          Director
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
import DistributerOrderApi from "@/Api/Modules/distributer";
import html2pdf from "html2pdf.js";
export default {
  data() {
    return {
      loading: false,
      summary: {
        main_order_details: {},
        distributer: {},
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
      // if route comming from distributer order

      const payload = {
        distributer_order_id: this.$route.params.order_id,
      };
      const res = await DistributerOrderApi.DistributerOrderSummary(payload);

      this.summary.main_order_details = res.data.data.distributerordersummary;

      this.summary.distributer =
        res.data.data.distributerordersummary.distributer;

      this.loading = false;
    },

    // invoice generation

    generateInvoicePdf() {
      const element = this.$refs.pdfContent; // Reference the content to convert

      // Set PDF options (optional)
      const options = {
        margin: 0,
        filename:
          `Distributerinvoice` +
          ` - ` +
          this.summary.main_order_details.invoice_no +
          `.pdf`,

        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 }, // Adjust canvas resolution
        jsPDF: { unit: "mm", format: [230, 360], orientation: "portrait" }, // PDF settings
      };

      // Generate the PDF from the HTML content
      html2pdf().set(options).from(element).save();
    },
  },
};
</script>
