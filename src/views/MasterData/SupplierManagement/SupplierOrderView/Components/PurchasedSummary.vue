<template>
  <!-- supplier each purches summery -->
  <div>
    <VRow>
      <VCol lg="7"> </VCol>
    </VRow>
    <div class="pt-5" />

    <div class="supplier_chain">
      <div class="pt-7" />

      <div class="purchased_summary">
        <!-- back -->
        <VSkeletonLoader
          :loading="loading"
          style="background-color: transparent"
          type="image, list-item-two-line"
        >
          <VResponsive>
            <VRow>
              <VCol lg="5" cols="5">
                <VBtn
                  class="back_button"
                  variant="none"
                  elevation="6"
                  @click="$router.back()"
                >
                  <VIcon icon="tabler-chevron-left" class="text" />
                  <span class="text pl-2">Back</span>
                </VBtn>
              </VCol>
              <VCol lg="7" cols="7">
                <span class="title text-center">Purchased Summery</span>
              </VCol>
            </VRow>
            <div class="pt-15" />
            <!-- suplier details card -->

            <VCard elevation="4">
              <div class="card_view">
                <div class="edit_button_allignment">
                  <VBtn color="transparent" @click="openSuplierModal">
                    <img src="@images/edit.png" class="img_styles" />
                  </VBtn>
                </div>
                <div class="mt-8" />
                <VRow>
                  <VCol lg="6" cols="12" md="6" sm="4">
                    <div class="d-flex justiy-content">
                      <span class="header_text">Supplier Name:</span>
                      &nbsp; &nbsp;
                      <span class="items1_text">{{
                        summaryData.suplier_name
                      }}</span>
                    </div>
                  </VCol>
                  <VCol lg="6" cols="12" md="6" sm="3">
                    <div
                      class="d-flex justiy-content-start allign_large_tabsview"
                    >
                      <span class="header_text">Email:</span>
                      &nbsp; &nbsp;
                      <span class="items1_text">{{ summaryData.email }}</span>
                    </div>
                  </VCol>
                </VRow>
                <VRow>
                  <VCol lg="6" cols="12" md="6" sm="4">
                    <div class="d-flex justiy-content">
                      <span class="header_text">Phone Number:</span>
                      &nbsp; &nbsp;
                      <span class="items1_text">{{
                        summaryData.contact_no
                      }}</span>
                    </div>
                  </VCol>
                  <VCol lg="6" cols="12" md="6" sm="3">
                    <div
                      class="d-flex justiy-content-start allign_large_tabsview"
                    >
                      <span class="header_text">Address:</span>
                      &nbsp; &nbsp;

                      <span class="items_text">{{
                        summaryData.suplier_address
                      }}</span>
                    </div>
                  </VCol>
                </VRow>
              </div>
            </VCard>

            <!-- order content -->
            <div class="pt-15" />

            <VRow>
              <VCol lg="4" cols="12">
                <AppDateTimePicker
                  v-model="purhasedstartdate"
                  placeholder="Start Purchased Date"
                  class="search_date"
                />
              </VCol>

              <VCol lg="4" cols="12">
                <AppDateTimePicker
                  v-model="purhasedenddate"
                  placeholder="End Purchased Date"
                  class="search_date"
                />
              </VCol>

              <VCol lg="2" cols="12">
                <VBtn
                  class="search_button"
                  variant="none"
                  @click="showSuplierSummary"
                >
                  <span class="text">Search</span>
                </VBtn>
              </VCol>
              <VCol lg="2" cols="12">
                <VBtn class="search_button" variant="none" @click="clearsearch">
                  <span class="text">Clear</span>
                </VBtn>
              </VCol>
            </VRow>

            <div class="pt-15" />

            <div>
              <div
                v-for="(order, index) in summaryData.suplier_orders"
                :key="order"
              >
                <VCard class="order_content" elevation="3">
                  <VRow>
                    <VCol lg="7" cols="12" sm="7" md="7">
                      <span class="title"
                        >Purchased ID - {{ order.purchased_reference_id }}</span
                      >
                    </VCol>
                    <VCol lg="5" cols="12" md="5" sm="5">
                      <VRow class="text-right pr-4">
                        <VCol lg="8" cols="6" md="2" sm="2">
                          <div class="mobile_view_buttons">
                            <VBtn
                              color="transparent"
                              @click="
                                $router.push(
                                  `/edit_purchase_order/${summaryData.id}/${order.id}/${summaryData.suplier_name}`,
                                )
                              "
                            >
                              <img src="@images/edit.png" class="img_styles" />
                            </VBtn>
                          </div>
                        </VCol>
                        <VCol lg="4" cols="6" md="2" sm="2">
                          <div>
                            <VBtn
                              color="transparent"
                              @click="
                                $router.push(
                                  `/supply_invoice/${order.id}/${summaryData.id}`,
                                )
                              "
                            >
                              <span class="invoice-button_text">
                                View Invoice
                              </span>
                            </VBtn>
                          </div>
                        </VCol>
                      </VRow>
                    </VCol>
                  </VRow>
                  <!-- order main details -->
                  <VContainer class="main_deails">
                    <VRow>
                      <VCol lg="4" cols="12">
                        <div class="d-flex justiy-content">
                          <span class="header_text">Purchased Status : </span>
                          &nbsp; &nbsp;
                          <span class="items_text">{{
                            order.purchased_status
                          }}</span>
                        </div>
                      </VCol>
                      <VCol lg="4" cols="12">
                        <div class="d-flex justiy-content-start">
                          <span class="header_text">Purchased date : </span>
                          &nbsp; &nbsp;
                          <span class="items_text">{{
                            order.purchased_date
                          }}</span>
                        </div>
                      </VCol>
                      <VCol lg="4" cols="12">
                        <div class="d-flex justiy-content-start">
                          <span class="header_text">Full Amount : </span>
                          &nbsp; &nbsp;
                          <span
                            v-if="order.purchased_order_total !== null"
                            class="items_text"
                            >{{
                              getPriceWithStrings(order.purchased_order_total)
                            }}</span
                          >

                          <span v-else class="items_text">N/A</span>
                        </div>
                      </VCol>
                    </VRow>
                  </VContainer>

                  <!-- ordered products -->

                  <div class="table">
                    <!-- topic -->
                    <div class="table_title text-center">
                      <span class="text">Purchased Items</span>
                    </div>
                    <!-- conttent -->
                    <div class="content">
                      <VDataTable
                        :headers="headers"
                        :items="order.order_items"
                        items-per-page="5"
                      >
                        <template
                          v-for="header in headers"
                          :key="header.value"
                          #[`item.${header.key}`]="props"
                        >
                          <!-- product code -->
                          <div v-if="header.key === 'code'" class="td_width">
                            {{ props.item.product_code }}
                          </div>

                          <!-- product name -->
                          <div v-if="header.key === 'name'" class="td_width">
                            {{ props.item.product_name }}
                          </div>

                          <!-- product category -->
                          <div
                            v-if="header.key === 'category'"
                            class="td_width"
                          >
                            {{ props.item.category?.category_name || "N/A" }}
                          </div>

                          <!-- purchase type -->
                          <div
                            v-if="header.key === 'purhcase_type'"
                            class="td_width"
                          >
                            <span
                              v-if="
                                props.item.pivot.purchase_type ===
                                'individual_units'
                              "
                            >
                              Single Items
                            </span>
                            <span
                              v-else-if="
                                props.item.pivot.purchase_type === 'bulk'
                              "
                            >
                              Loose(Weight)
                            </span>
                            <span
                              v-else-if="
                                props.item.pivot.purchase_type === 'fixedpacks'
                              "
                            >
                              Packets
                            </span>
                          </div>

                          <!-- quantity -->
                          <div
                            v-if="header.key === 'quantity'"
                            class="td_width"
                          >
                            <span
                              v-if="
                                props.item.pivot.purchase_type ===
                                'individual_units'
                              "
                            >
                              {{
                                props.item.pivot.individual_items_quantity
                              }}</span
                            >
                            <span
                              v-else-if="
                                props.item.pivot.purchase_type === 'fixedpacks'
                              "
                            >
                              {{ props.item.pivot.packs_quantity }}
                              Packets({{ props.item.pivot.fixed_pack_size }})
                              Kg</span
                            >

                            <span
                              v-else-if="
                                props.item.pivot.purchase_type === 'bulk'
                              "
                            >
                              {{ props.item.pivot.bulk_product_stock_weight }}
                              Kg</span
                            >
                          </div>

                          <!-- unit price -->
                          <div
                            v-if="header.key === 'per_unit_price'"
                            class="td_width"
                          >
                            <span
                              v-if="
                                props.item.pivot.purchase_type ===
                                'individual_units'
                              "
                            >
                              {{
                                getPriceWithoutCurrency(
                                  props.item.pivot.item_unit_price,
                                )
                              }}
                            </span>
                            <span
                              v-else-if="
                                props.item.pivot.purchase_type === 'bulk'
                              "
                            >
                              {{
                                getPriceWithoutCurrency(
                                  props.item.pivot.bulk_item_weight_unit_price,
                                )
                              }}
                            </span>
                            <span
                              v-else-if="
                                props.item.pivot.purchase_type === 'fixedpacks'
                              "
                            >
                              {{
                                getPriceWithoutCurrency(
                                  props.item.pivot.fixed_pack_size *
                                    props.item.pivot
                                      .bulk_item_weight_unit_price,
                                )
                              }}
                            </span>
                          </div>

                          <!-- waistage -->
                          <div
                            v-if="header.key === 'waistage'"
                            class="td_width"
                          >
                            <!-- individual items -->
                            <span
                              v-if="
                                props.item.pivot.purchase_type ===
                                  'individual_units' &&
                                props.item.pivot.individual_wastage !== null
                              "
                            >
                              {{ props.item.pivot.individual_wastage }}
                            </span>

                            <!-- bulk weight(loose) -->
                            <span
                              v-else-if="
                                props.item.pivot.purchase_type === 'bulk' &&
                                props.item.pivot.bulk_wastage !== null
                              "
                            >
                              {{ props.item.pivot.bulk_wastage + " Kg" }}
                            </span>

                            <!-- fixpacks -->
                            <span
                              v-else-if="
                                props.item.pivot.purchase_type ===
                                  'fixedpacks' &&
                                props.item.pivot.fixedpacks_wastage !== null
                              "
                            >
                              {{
                                props.item.pivot.fixedpacks_wastage + " Packets"
                              }}
                            </span>

                            <!-- if all are null -->
                            <span
                              v-else-if="
                                props.item.pivot.fixedpacks_wastage === null ||
                                props.item.pivot.bulk_wastage === null ||
                                props.item.pivot.individual_wastage === null
                              "
                            >
                              N/A
                            </span>
                          </div>

                          <!-- totalamount -->
                          <div v-if="header.key === 'amount'" class="td_width">
                            <span v-if="props.item.pivot.total_amount !== null">
                              {{
                                getPriceWithStrings(
                                  props.item.pivot.total_amount,
                                )
                              }}
                            </span>
                            <span v-else>N/A</span>
                          </div>
                        </template>
                      </VDataTable>
                    </div>
                  </div>
                </VCard>

                <br /><br /><br />
              </div>
            </div>
          </VResponsive>
        </VSkeletonLoader>
      </div>
    </div>

    <!-- dialogs -->
    <!-- edit suplier modal -->
    <VDialog
      v-model="showsupliermodal"
      width="900px"
      height="715px"
      persistent=""
    >
      <VCard>
        <VCardText>
          <!-- edit suplier form -->
          <div>
            <EditSuplier
              :suplier-data="suplierPropsData"
              @closemodal="closemodal"
            />
          </div>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- delete -->
    <VDialog
      v-model="showDeleteModal"
      width="500px"
      scrollable=""
      persistent=""
    >
      <VCard>
        <VCardText class="delete">
          <div>
            <DeleteBox :caption="caption" @close-modal="closeDeleteModal" />
          </div>
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<script>
import SupplierApi from "@/Api/Modules/supply_chain";
import EditSuplier from "@/views/MasterData/SupplierManagement/Components/EditSuplier.vue";

export default {
  components: {
    EditSuplier,
  },
  data() {
    return {
      loading: false,
      purhasedstartdate: "",
      purhasedenddate: "",
      suplierPropsData: {},
      pageTitle: {},
      showDeleteModal: false,
      caption: "Purchased Product",
      purchaceddatemodal: false,
      showsupliermodal: false,

      summaryData: {},

      headers: [
        { title: "Product Code", align: "start", key: "code" },
        {
          title: "Product Name",
          align: "start",
          key: "name",
        },
        { title: "Category", align: "start", key: "category" },
        {
          title: "Purchased Type",
          align: "start",
          key: "purhcase_type",
        },
        { title: "Purchased Quantity(Units)", align: "start", key: "quantity" },
        { title: "Waistage", align: "start", key: "waistage" },
        {
          title: "Purchased Unit Price",
          align: "start",
          key: "per_unit_price",
        },
        { title: "Product Amount (Rs)", align: "start", key: "amount" },
      ],
    };
  },

  async created() {
    await this.showSuplierSummary();
  },
  methods: {
    // get suplier details

    async showSuplierSummary() {
      this.loading = true;

      const payload = {
        id: this.$route.params.id,
        start_purchased_date: this.purhasedstartdate,
        end_purhased_date: this.purhasedenddate,
      };

      await SupplierApi.showsuppliersummary(payload)
        .then((res) => {
          this.summaryData = res.data.data;

          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    async clearsearch() {
      // clear all dates
      this.purhasedstartdate = "";
      this.purhasedenddate = "";

      // call clears search
      await this.showSuplierSummary();
    },

    // suplier edit
    openSuplierModal() {
      // open model
      this.showsupliermodal = true;

      // sending props
      this.suplierPropsData = {
        id: this.summaryData.id,
        suplier_name: this.summaryData.suplier_name,
        email: this.summaryData.email,
        suplier_address: this.summaryData.suplier_address,
        contact_no: this.summaryData.contact_no,
      };
    },

    // suplier close
    async closemodal(data) {
      // close edit model
      this.showsupliermodal = false;

      // call summary again
      if (data === "load") {
        await this.showSuplierSummary();
      }
    },

    // open delete modal

    openDeleteModal() {
      this.showDeleteModal = true;
    },

    // close delete modal

    closeDeleteModal() {
      this.showDeleteModal = false;
    },
  },
};
</script>
