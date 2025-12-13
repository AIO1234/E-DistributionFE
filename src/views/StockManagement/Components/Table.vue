<template>
  <div>
    <v-skeleton-loader
      :loading="loading"
      style="background-color: transparent"
      type="image, list-item-two-line"
    >
      <v-responsive>
        <v-data-table :headers="headers" :items="Products" items-per-page="100">
          <!-- contents -->
          <template
            v-for="header in headers"
            :key="header.value"
            v-slot:[`item.${header.key}`]="props"
          >
            <!-- poduct code -->
            <div v-if="header.key === 'product_code'">
              {{ props.item.product_code }}
            </div>

            <!-- product name -->
            <div v-if="header.key === 'product_name'">
              <span> {{ props.item.product_name }}</span>
            </div>

            <!-- product amount -->
            <div v-if="header.key === 'product_amount'">
              <span> {{ getPrice(props.item.product_amount) }}</span>
            </div>

            <!-- product stock-->
            <div v-if="header.key === 'stock_count'">
              <span v-if="props.item.stock_count !== null">
                {{ props.item.stock_count }}</span
              >
              <span v-else>0</span>
            </div>

            <!-- detailed view -->
            <div v-if="header.key === 'detailed_view'">
              <v-btn
                @click="
                  detailedDialog = true;
                  selectedItem = props.item;
                "
              >
                Detailed View
              </v-btn>
            </div>

            <!-- increase stock-->
            <div v-if="header.key === 'increse_stock'">
              <v-btn
                @click="
                  showDialog = true;
                  selectedItem = props.item;
                "
              >
                Increase
              </v-btn>
            </div>

            <!-- product type -->
            <div v-if="header.key === 'product_type'">
              <span>
                {{ props.item.product_type }}
              </span>
            </div>

            <!-- product weight -->
            <div v-if="header.key === 'product_weight'">
              <span v-if="props.item.product_type === 'Solid'">
                {{ getWeight(props.item.product_weight) }}
              </span>
              <span v-else> N/A </span>
            </div>

            <!-- product volume -->
            <div v-if="header.key === 'product_volume'">
              <span v-if="props.item.product_type === 'Liquid'">
                {{ getVolume(props.item.product_volume) }}
              </span>
              <span v-else> N/A </span>
            </div>

            <!-- expire date -->
            <div v-if="header.key === 'expire_date'">
              <span v-if="props.item.expire_date !== null">
                {{ props.item.expire_date }}
              </span>
              <span v-else>N/A</span>
            </div>

            <!-- manufacture date -->
            <div v-if="header.key === 'manufacture_date'">
              <span v-if="props.item.manufacture_date !== null">
                {{ props.item.manufacture_date }}
              </span>
              <span v-else>N/A</span>
            </div>

            <!-- distributor commision -->
            <div v-if="header.key === 'distributer_commision'">
              <span v-if="props.item.distributer_commision !== null">
                {{ getPrice(props.item.distributer_commision) }}
              </span>
              <span v-else> N/A </span>
              <span> </span>
            </div>

            <!-- salesrep commision -->
            <div v-if="header.key === 'salesrep_commision'">
              <span v-if="props.item.salesrep_commision !== null">
                {{ getPrice(props.item.salesrep_commision) }}
              </span>
              <span v-else> N/A </span>
            </div>

            <!-- product image -->
            <div v-if="header.key === 'product_image'">
              <div class="pt-2 pb-2" v-if="props.item.product_image !== null">
                <v-img
                  :src="app_image_url + '/' + props.item.product_image"
                ></v-img>
              </div>
              <div class="pt-2 pb-2" v-else>
                <img src="@/assets/images/Rectangle41946.png" />
              </div>
            </div>

            <!-- action -->
            <div v-if="header.key === 'action'">
              <v-row>
                <v-col lg="2">
                  <v-btn
                    color="transparent"
                    variant="none"
                    @click="
                      show = true;
                      selectedItem = props.item;
                    "
                  >
                    <img src="@/assets/images/edit.png" style="width: 70%" />
                  </v-btn>
                </v-col>
                <v-col lg="2"> </v-col>
              </v-row>
            </div>

            <!-- last updated by -->
            <div v-if="header.key === 'last_updated_by'">
              {{ firstLetterUpperCase(props.item.last_updated_by) }}
            </div>
          </template>
        </v-data-table>
      </v-responsive>
    </v-skeleton-loader>

    <!-- open select dialog -->

    <v-dialog
      v-model="show"
      max-width="758.3px"
      min-height="216.97px"
      persistent
      scrollable=""
    >
      <v-card>
        <div class="text-right">
          <v-btn color="transparent" variant="none" @click="show = false">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="icon icon-tabler icons-tabler-filled icon-tabler-square-x"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M19 2h-14a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3 -3v-14a3 3 0 0 0 -3 -3zm-9.387 6.21l.094 .083l2.293 2.292l2.293 -2.292a1 1 0 0 1 1.497 1.32l-.083 .094l-2.292 2.293l2.292 2.293a1 1 0 0 1 -1.32 1.497l-.094 -.083l-2.293 -2.292l-2.293 2.292a1 1 0 0 1 -1.497 -1.32l.083 -.094l2.292 -2.293l-2.292 -2.293a1 1 0 0 1 1.32 -1.497z"
              />
            </svg>
          </v-btn>
        </div>

        <v-card-text>
          <Update @close="closeModal" :formData="selectedItem" /> </v-card-text
      ></v-card>
    </v-dialog>

    <!-- open stock increase dialog -->

    <v-dialog
      v-model="showDialog"
      max-width="500.3px"
      min-height="216.97px"
      persistent
      scrollable=""
    >
      <v-card>
        <div class="text-right">
          <v-btn color="transparent" variant="none" @click="showDialog = false">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="icon icon-tabler icons-tabler-filled icon-tabler-square-x"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M19 2h-14a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3 -3v-14a3 3 0 0 0 -3 -3zm-9.387 6.21l.094 .083l2.293 2.292l2.293 -2.292a1 1 0 0 1 1.497 1.32l-.083 .094l-2.292 2.293l2.292 2.293a1 1 0 0 1 -1.32 1.497l-.094 -.083l-2.293 -2.292l-2.293 2.292a1 1 0 0 1 -1.497 -1.32l.083 -.094l2.292 -2.293l-2.292 -2.293a1 1 0 0 1 1.32 -1.497z"
              />
            </svg>
          </v-btn>
        </div>

        <v-card-text class="masterdata">
          <!-- stock increase form -->
          <v-form v-model="isFormValid">
            <!-- increase stock input -->
            <v-text-field
              placeholder="Increasing Stock"
              v-model="newstock"
              class="increase_input"
              :rules="[required]"
            ></v-text-field>
            <div class="pt-3"></div>
            <!-- submit button -->
            <v-btn
              color="transparent"
              variant="none"
              block
              :disabled="!isFormValid"
              :loading="formLoader"
              class="increase_button"
              @click="increaseStock()"
              ><span class="btn_text">Increase</span></v-btn
            >
          </v-form>
        </v-card-text></v-card
      >
    </v-dialog>

    <!-- detiled view dialog -->
    <v-dialog
      v-model="detailedDialog"
      max-width="900.3px"
      min-height="216.97px"
      persistent
      scrollable=""
      class="masterdata"
    >
      <v-card>
        <div class="text-right">
          <v-btn
            color="transparent"
            variant="none"
            @click="detailedDialog = false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="icon icon-tabler icons-tabler-filled icon-tabler-square-x"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M19 2h-14a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3 -3v-14a3 3 0 0 0 -3 -3zm-9.387 6.21l.094 .083l2.293 2.292l2.293 -2.292a1 1 0 0 1 1.497 1.32l-.083 .094l-2.292 2.293l2.292 2.293a1 1 0 0 1 -1.32 1.497l-.094 -.083l-2.293 -2.292l-2.293 2.292a1 1 0 0 1 -1.497 -1.32l.083 -.094l2.292 -2.293l-2.292 -2.293a1 1 0 0 1 1.32 -1.497z"
              />
            </svg>
          </v-btn>
        </div>

        <v-card-text> <DetailedView :selectedItem="selectedItem" /></v-card-text
      ></v-card>
    </v-dialog>
  </div>
</template>
<script>
import DetailedView from "./DetailedView.vue";
import Update from "./Update.vue";
import ProductsApi from "@/Api/Modules/products";
DetailedView;
export default {
  data() {
    return {
      detailedDialog: false,
      formLoader: false,
      isFormValid: false,
      newstock: "",
      showDialog: false,
      selectedItem: {},
      show: false,
      headers: [
        { title: "Product Code", align: "start", key: "product_code" },
        { title: "Product Name", align: "start", key: "product_name" },
        { title: "Product Amount", align: "start", key: "product_amount" },
        { title: "Product Stock", align: "start", key: "stock_count" },
        { title: "Detailed View", align: "start", key: "detailed_view" },
        { title: "Increase Stock", align: "start", key: "increse_stock" },
        { title: "Product Type", align: "start", key: "product_type" },
        { title: "Product Weight", align: "start", key: "product_weight" },
        { title: "Product Volume", align: "start", key: "product_volume" },
        { title: "Expre Date", align: "start", key: "expire_date" },
        { title: "Manufacture Date", align: "start", key: "manufacture_date" },
        {
          title: "Distributor Commision",
          align: "start",
          key: "distributer_commision",
        },
        {
          title: "SalesRep Commision",
          align: "start",
          key: "salesrep_commision",
        },
        { title: "Product Image", align: "start", key: "product_image" },
        { title: "Action", align: "start", key: "action" },
        { title: "Last Updated By", align: "start", key: "last_updated_by" },
      ],
      Shops: [],
    };
  },

  components: {
    Update,
    DetailedView,
  },

  props: {
    Products: Array,
    loading: Boolean,
  },

  methods: {
    // close
    async closeModal() {
      this.show = false;
      // call close emit
      this.$emit("close");
    },

    // increase stock
    async increaseStock() {
      this.formLoader = true;
      // setup payload
      const payload = {
        stock: this.newstock,
        product_id: this.selectedItem.id,
      };
      // call the api
      await ProductsApi.increaseStock(payload)
        .then(() => {
          this.formLoader = false;
          this.showDialog = false;
          this.$emit("close");
        })
        .catch(() => {
          this.formLoader = false;
        });
    },
  },
};
</script>
