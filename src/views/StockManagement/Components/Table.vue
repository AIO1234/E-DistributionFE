<template>
  <div>
    <v-skeleton-loader
      :loading="loading"
      style="background-color: transparent"
      type="image, list-item-two-line"
    >
      <v-responsive>
        <v-data-table-server
          :headers="filteredHeaders"
          :items="Products"
          :items-length="totalItems"
          :page="currentPage"
          :items-per-page="itemsPerPage"
          @update:page="onPage"
          @update:items-per-page="onPerPage"
        >
          <!-- contents -->
          <template
            v-for="header in filteredHeaders"
            :key="header.value"
            v-slot:[`item.${header.key}`]="props"
          >
            <!-- poduct code -->
            <div v-if="header.key === 'product_code'">
              {{ makeUpperCase(props.item.product_code) }}
            </div>

            <!-- product name -->
            <div v-if="header.key === 'product_name'">
              <span> {{ makeUpperCase(props.item.product_name) }}</span>
            </div>

            <!-- model  anumber -->
            <div v-if="header.key === 'model_number'">
              <span> {{ props.item.model_number }}</span>
            </div>

            <!-- category -->
            <div v-if="header.key === 'category'">
              <span v-if="props.item.category">
                {{ makeUpperCase(props.item.category.category_name) }}</span
              >
              <span v-else>N/A</span>
            </div>

            <!-- product cost -->
            <div v-if="header.key === 'product_cost'">
              <span> {{ getPrice(props.item.product_cost) }}</span>
            </div>

            <!-- min price -->
            <div v-if="header.key === 'min_selling_price'">
              <span> {{ getPrice(props.item.min_selling_price) }}</span>
            </div>
            <!-- max price -->
            <div v-if="header.key === 'max_selling_price'">
              <span> {{ getPrice(props.item.max_selling_price) }}</span>
            </div>

            <!-- product stock-->
            <div v-if="header.key === 'stock_count'">
              <span v-if="props.item.stock_count !== null">
                {{ props.item.stock_count }}</span
              >
              <span v-else>0</span>
            </div>

            <!-- damage stock -->
            <div v-if="header.key === 'damaged_stock_count'">
              <span v-if="props.item.damaged_stock_count !== null">
                {{ props.item.damaged_stock_count }}</span
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

            <!-- stock movements -->
            <div v-if="header.key === 'stock_movements'">
              <v-btn
                @click="
                  stockMovementsDialog = true;
                  selectedItem = props.item;
                "
              >
                Stock Movements
              </v-btn>
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
              <!-- full product edit - Super Admin / Admin -->
              <v-row v-if="!isImageOnly">
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
              <!-- image only - Data Operator (same button style as the
                   Detailed View / Stock Movements buttons) -->
              <v-btn v-else @click="openImageDialog(props.item)">
                Update Image
              </v-btn>
            </div>

            <!-- last updated by -->
            <div v-if="header.key === 'last_updated_by'">
              {{ firstLetterUpperCase(props.item.last_updated_by) }}
            </div>
          </template>
        </v-data-table-server>
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

    <!-- stock movements dialog -->
    <v-dialog
      v-model="stockMovementsDialog"
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
            @click="stockMovementsDialog = false"
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

        <v-card-text> <StockMovements :selectedItem="selectedItem" /></v-card-text
      ></v-card>
    </v-dialog>

    <!-- update product image dialog (Data Operator - image only) -->
    <v-dialog
      v-model="imageDialog"
      max-width="500px"
      persistent
      scrollable=""
      class="masterdata"
    >
      <v-card>
        <div class="text-right">
          <v-btn color="transparent" variant="none" @click="imageDialog = false">
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
          <h3 class="form_title">Update Product Image</h3>
          <div class="pt-3" />
          <v-file-input
            v-model="imageFile"
            label="Select product image..."
            accept="image/*"
            variant="outlined"
            class="input"
          ></v-file-input>
          <div class="pt-3" />
          <v-btn
            color="transparent"
            variant="none"
            block
            :disabled="!hasImageFile"
            :loading="imageLoading"
            class="increase_button"
            @click="submitImage()"
          >
            <span class="btn_text">Update Image</span>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import DetailedView from "./DetailedView.vue";
import StockMovements from "./StockMovements.vue";
import Update from "./Update.vue";
import ProductsApi from "@/Api/Modules/products";
DetailedView;
export default {
  data() {
    return {
      detailedDialog: false,
      stockMovementsDialog: false,
      formLoader: false,
      isFormValid: false,
      newstock: "",
      showDialog: false,
      selectedItem: {},
      show: false,
      authRole: "",
      imageDialog: false,
      imageFile: null,
      imageLoading: false,
      headers: [
        { title: "Product Code", align: "start", key: "product_code" },
        { title: "Product Name", align: "start", key: "product_name" },
        { title: "Model Number", align: "start", key: "model_number" },
        { title: "Category", align: "start", key: "category" },
        { title: "Product Cost(Rs)", align: "start", key: "product_cost" },
        {
          title: "Minimum Selling Price(Rs)",
          align: "start",
          key: "min_selling_price",
        },
        {
          title: "Maximum Selling Price(Rs)",
          align: "start",
          key: "max_selling_price",
        },

        { title: "Product Stock", align: "start", key: "stock_count" },
        { title: "Damage Stock", align: "start", key: "damaged_stock_count" },
        { title: "Detailed View", align: "start", key: "detailed_view" },
        { title: "Stock Movements", align: "start", key: "stock_movements" },
        { title: "Expre Date", align: "start", key: "expire_date" },
        { title: "Manufacture Date", align: "start", key: "manufacture_date" },

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
    StockMovements,
  },

  created() {
    this.getAuthUser();
  },

  computed: {
    // Data Operator and Admin have image-only access to products - they keep
    // the Action column but the button there only opens the "replace image"
    // dialog (full add/edit stock is Super Admin only)
    isImageOnly() {
      return ["Data Operator", "Admin"].includes(this.authRole);
    },

    // v-file-input binds either a File or an array of File depending on the
    // Vuetify build - treat both as "a file is selected"
    hasImageFile() {
      if (Array.isArray(this.imageFile)) return this.imageFile.length > 0;

      return !!this.imageFile;
    },

    // column visibility by role:
    //  - Detailed View / Stock Movements: Super Admin only
    //    (hidden for Admin, Staff and Data Operator)
    //  - Action: Super Admin (full edit) or Admin / Data Operator
    //    (image-replace only); hidden for Staff
    filteredHeaders() {
      const isSuperAdmin = this.authRole === "Super Admin";
      const showAction = isSuperAdmin || this.isImageOnly;
      const superAdminOnlyColumns = ["detailed_view", "stock_movements"];

      return this.headers.filter((header) => {
        if (header.key === "action") return showAction;
        if (superAdminOnlyColumns.includes(header.key)) return isSuperAdmin;

        return true;
      });
    },
  },

  props: {
    Products: Array,
    loading: Boolean,
    totalItems: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    itemsPerPage: {
      type: Number,
      default: 50,
    },
  },

  methods: {
    // page change
    onPage(page) {
      this.$emit("pagechange", { page });
    },

    // items-per-page change
    onPerPage(perPage) {
      this.$emit("pagesizechange", {
        page: 1,
        per_page: perPage == -1 ? 10000 : perPage,
      });
    },

    // close
    async closeModal() {
      this.show = false;
      // call close emit
      this.$emit("close");
    },

    // open the image-only dialog (Data Operator)
    openImageDialog(item) {
      this.selectedItem = item;
      this.imageFile = null;
      this.imageDialog = true;
    },

    // submit a new product image - sends only id + product_image, so no
    // other product column can be touched through this path
    async submitImage() {
      const file = Array.isArray(this.imageFile)
        ? this.imageFile[0]
        : this.imageFile;

      if (!file) return;

      const formData = new FormData();
      formData.append("id", this.selectedItem.id);
      formData.append("product_image", file);

      this.imageLoading = true;

      await ProductsApi.updateProductImage(formData)
        .then(() => {
          this.imageLoading = false;
          this.imageDialog = false;
          this.imageFile = null;
          this.$emit("close");
        })
        .catch(() => {
          this.imageLoading = false;
        });
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
