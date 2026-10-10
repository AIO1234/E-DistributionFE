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
          <v-alert
            v-if="isPreviewInvoice"
            type="info"
            variant="tonal"
            class="mt-4"
          >
            Sample invoice preview. Data is not saved.
          </v-alert>
          <!-- download -->
          <v-row class="pt-5 shop_invoice">
            <v-col lg="4" class="pt-5"> </v-col>
            <v-col lg="8" cols="12" class="text-right">
              <v-btn
                class="download_invoice"
                variant="none"
                @click="generateInvoicePdf()"
                ><span class="text">Download and Print</span></v-btn
              >
            </v-col>
          </v-row>

          <!-- pdf content -->
          <div ref="pdfContent">
            <div class="order_management">
              <div class="shop_invoice sample_invoice">
                <!-- title + meta -->
                <div class="inv_head">
                  <div class="inv_title">INVOICE</div>
                  <div class="inv_meta">
                    <div>Date {{ summary.main_order_details.order_date }}</div>
                    <div>Dealer Code : {{ summary.shop.shop_code }}</div>
                    <div>
                      Delivery No.
                      {{ summary.main_order_details.delivery_note_no }}
                    </div>

                    <div>
                      Invoice No. {{ summary.main_order_details.invoice_no }}
                    </div>
                  </div>
                </div>

                <hr class="inv_rule" />

                <!-- invoice to : shop name + area name -->
                <div class="inv_to_label">INVOICE TO:</div>
                <div class="inv_to_name">
                  {{ summary.shop.shop_name }}
                  {{
                    summary.shop && summary.shop.area
                      ? summary.shop.area.area_name
                      : summary.shop.area_code
                  }}
                </div>

                <!-- items table -->
                <div class="order_summary">
                  <table
                    class="table table-sm table_borders inv_table"
                    style="width: 100%"
                  >
                    <thead>
                      <tr class="table_header table_borders">
                        <th class="text table_borders">No.</th>
                        <th class="text table_borders">MODEL NO</th>
                        <th class="text table_borders">DESCRIPTION</th>
                        <th class="text table_borders">Qty</th>
                        <th class="text table_borders">Price</th>
                        <th class="text table_borders">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        style="page-break-inside: avoid"
                        class="table-data table_borders"
                        v-for="(product, i) in summary.main_order_details
                          .distributer_salesrep_shop_order_items"
                        :key="product"
                      >
                        <td class="text table_borders">{{ i + 1 }}</td>
                        <td class="text table_borders">
                          {{
                            makeUpperCase(
                              product.model_number || product.product_code,
                            )
                          }}
                        </td>
                        <td class="text table_borders">
                          {{ makeUpperCase(product.product_name) }}
                        </td>
                        <td class="text table_borders">
                          {{
                            product.pivot.quantity -
                            product.pivot.return_quantity
                          }}
                        </td>
                        <td class="text table_borders">
                          {{
                            getPrice(
                              product.pivot.discounted_price ||
                                product.pivot.unit_price,
                            )
                          }}
                        </td>
                        <td class="text table_borders">
                          {{
                            getPrice(
                              product.pivot.price - product.pivot.return_value,
                            )
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <!-- totals -->
                  <div class="inv_totals">
                    <div class="inv_totals_row">
                      <span class="inv_totals_label">SUB TOTAL</span>
                      <span class="inv_totals_colon">:</span>
                      <span class="inv_totals_val">{{
                        getPrice(summary.main_order_details.order_amount)
                      }}</span>
                    </div>
                    <div class="inv_totals_row">
                      <span class="inv_totals_label">OUTSTANDING</span>
                      <span class="inv_totals_colon">:</span>
                      <span class="inv_totals_val">{{
                        getPrice(previousOutstanding)
                      }}</span>
                    </div>
                    <div class="inv_totals_row">
                      <span class="inv_totals_label">PAID</span>
                      <span class="inv_totals_colon">:</span>
                      <span class="inv_totals_val">0</span>
                    </div>
                    <hr class="inv_totals_hr" />
                    <div class="inv_totals_row inv_totals_grand">
                      <span class="total inv_totals_label">Total</span>
                      <span class="total inv_totals_val">{{
                        getPrice(summary.shop.Uptodate_due_amounts)
                      }}</span>
                    </div>
                  </div>
                </div>

                <hr class="inv_rule" />

                <div class="inv_thanks footer_note">
                  PLEASE CHECK THE RECEIVED GOODS<br />
                  THANK YOU FOR YOUR BUSINESS
                </div>

                <!-- signatures -->
                <div class="inv_signs">
                  <div class="inv_sign">
                    <span class="inv_sign_line">.........................</span>
                    <span class="footer_note">Issued By</span>
                  </div>
                  <div class="inv_sign">
                    <span class="inv_sign_line">.........................</span>
                    <span class="footer_note">Approved By</span>
                  </div>
                  <div class="inv_sign">
                    <span class="inv_sign_line">.........................</span>
                    <span class="footer_note">Received By</span>
                  </div>
                </div>

                <div class="inv_generated">Generated on {{ generatedOn }}</div>
              </div>
            </div>
          </div>
        </div>
      </v-responsive>
    </v-skeleton-loader>
  </div>
</template>
<script>
import ShopOrderApi from "@/Api/Modules/shop";
import { approveOrderCollection } from "@/utils/orderCollectionUiState";
import html2pdf from "html2pdf.js";
export default {
  data() {
    return {
      loading: false,
      isPreviewInvoice: false,
      generatedOn: "",
      summary: {
        main_order_details: {},
        distributer: {},
        salesrep: {},
        shop: {},
      },
    };
  },

  computed: {
    // the customer's outstanding balance BEFORE this shop order - the shop's
    // current running due already includes this order (added at order
    // creation), so subtract this order's amount back out. "Total" below is
    // the full current outstanding (this order included).
    previousOutstanding() {
      return (
        Number(this.summary.shop.Uptodate_due_amounts || 0) -
        Number(this.summary.main_order_details.order_amount || 0)
      );
    },
  },

  async created() {
    this.generatedOn = new Date().toLocaleString();
    if (this.$route.query.uiOnly === "true") {
      this.loadPreviewInvoice();
    } else {
      await this.orderSummary();
    }
  },
  methods: {
    loadPreviewInvoice() {
      this.isPreviewInvoice = true;
      const query = this.$route.query;
      const amount = Number(query.amount) || 0;

      this.summary.main_order_details = {
        order_date: query.date || "",
        delivery_note_no: "PREVIEW-DELIVERY",
        invoice_no: query.invoiceNumber || "",
        order_amount: amount,
        distributer_salesrep_shop_order_items: [
          {
            model_number: "SAMPLE-001",
            product_code: "SAMPLE-001",
            product_name: "Sample Product",
            pivot: {
              quantity: 1,
              return_quantity: 0,
              discounted_price: amount,
              unit_price: amount,
              price: amount,
              return_value: 0,
            },
          },
        ],
      };
      this.summary.shop = {
        shop_code: "PREVIEW",
        shop_name: query.customer || "Sample Customer",
        shop_mobile: "",
        shop_address: "",
        area_code: "",
        area: { area_name: "" },
        Uptodate_due_amounts: amount,
      };
    },

    // order summary
    async orderSummary() {
      this.loading = true;
      // if route comming from sales rep order

      const payload = {
        shop_order_id: this.$route.params.order_id,
      };
      const res = await ShopOrderApi.ShopOrderInvoice(payload);

      this.summary.main_order_details = res.data.data.shopordersummary;

      this.summary.distributer =
        res.data.data.shopordersummary.distributer || {};

      this.summary.salesrep = res.data.data.shopordersummary.salesrep || {};

      this.summary.shop = res.data.data.shopordersummary.shop || {};

      this.loading = false;
    },

    // invoice generation

    generateInvoicePdf() {
      const element = this.$refs.pdfContent; // Reference the content to convert

      if (this.isPreviewInvoice) {
        approveOrderCollection(
          this.$route.query.orderId || this.$route.query.collectionId,
        );
      }

      // Set PDF options (optional)
      const options = {
        margin: 0,
        filename:
          `CustomerInvoice` +
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

<style scoped>
/* sample commercial-invoice layout, using the project's standard
   Urbanist font + black accents (same look as the other invoices) */
.sample_invoice {
  padding: 40px 50px 24px;
  font-family: "Urbanist", sans-serif;
  color: #000;
}

.sample_invoice .inv_head {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.sample_invoice .inv_title {
  background: #e0e0e0;
  padding: 6px 28px;
  font-family: "Urbanist", sans-serif;
  font-weight: 800;
  font-size: 44px;
  letter-spacing: 2px;
}

.sample_invoice .inv_meta {
  margin-top: 12px;
  text-align: right;
  font-family: "Urbanist", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.9;
}

.sample_invoice .inv_rule {
  border: none;
  border-top: 3px solid #000;
  margin: 16px 0;
}

.sample_invoice .inv_to_label {
  font-family: "Urbanist", sans-serif;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 1px;
}

.sample_invoice .inv_to_name {
  margin-top: 6px;
  font-family: "Urbanist", sans-serif;
  font-weight: 700;
  font-size: 28px;
  line-height: 1.3;
}

.sample_invoice .inv_table {
  margin-top: 24px;
}

.sample_invoice .inv_table th.text,
.sample_invoice .inv_table td.text {
  text-align: center;
}

.sample_invoice .inv_totals {
  width: 340px;
  margin-left: auto;
  margin-top: 24px;
}

.sample_invoice .inv_totals_row {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 9px;
  font-family: "Urbanist", sans-serif;
  font-weight: 700;
  font-size: 14px;
}

.sample_invoice .inv_totals_label {
  min-width: 120px;
  text-align: right;
}

.sample_invoice .inv_totals_colon {
  width: 8px;
  text-align: center;
}

.sample_invoice .inv_totals_val {
  min-width: 100px;
  text-align: right;
}

.sample_invoice .inv_totals_hr {
  border: none;
  border-top: 1px solid #000;
  margin: 8px 0 12px;
}

.sample_invoice .inv_totals_grand {
  font-size: 18px;
}

.sample_invoice .inv_thanks {
  text-align: center;
  line-height: 1.7;
  margin: 14px 0 44px;
}

.sample_invoice .inv_signs {
  display: flex;
  justify-content: space-between;
  margin-top: 56px;
}

.sample_invoice .inv_sign {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
}

.sample_invoice .inv_sign_line {
  letter-spacing: 2px;
}

.sample_invoice .inv_generated {
  text-align: center;
  margin-top: 48px;
  font-family: "Urbanist", sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #000;
}
</style>
