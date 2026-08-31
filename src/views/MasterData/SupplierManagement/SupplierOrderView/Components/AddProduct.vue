<template>
  <!-- supplier order adding -->
  <VRow>
    <VCol lg="7" />
  </VRow>
  <div class="pt-5" />
  <div class="supplier_chain">
    <div class="pt-7" />
    <div class="add_product">
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
          <span class="title text-center">Add Product</span>
        </VCol>
      </VRow>

      <!-- supplier details card -->
      <div class="pt-15" />
      <span class="form_heading">
        Create new Suplier Order _ {{ $route.params.name }}
      </span>
      <!-- end of the supplier details -->
      <div class="pt-15" />
      <!-- order form -->
      <div class="form">
        <!-- basic data -->
        <span class="section_title">Basic Purchase Details</span>
        <div class="pt-10" />

        <VCard class="content">
          <div class="pt-2" />
          <VRow>
            <!-- order  date -->

            <VCol lg="6" cols="12">
              <label class="label">Select purchase Date</label>

              <div class="mt-2" />
              <AppDateTimePicker
                v-model="form.purchased_date"
                placeholder="Order Date"
                class="input_date"
              />
            </VCol>

            <!-- order id -->

            <VCol lg="6" cols="12">
              <label class="label">Purchase Id</label>
              <div class="mt-2" />
              <VTextField
                v-model="form.purchased_reference_id"
                placeholder="Order Id"
                class="input_order_id"
                readonly=""
              />
            </VCol>
          </VRow>

          <VRow>
            <!-- receiving invoice number -->
            <VCol lg="6" cols="12">
              <label class="label">Receiving Invoice Number</label>
              <div class="mt-2" />
              <VTextField
                v-model="form.receiving_invoice_no"
                placeholder="Receiving Invoice Number"
                class="input_order_id"
              />
            </VCol>
          </VRow>
        </VCard>
        <div class="pt-15" />
        <span class="section_title">Purchase Items</span>

        <!-- feilds -->
        <div class="pt-15" />
        <VCard class="content">
          <VForm v-for="(product, index) in products" :key="product">
            <VRow>
              <!-- Select Category -->
              <VCol lg="12" cols="12">
                <label class="label">Select Category</label>
                <div class="mt-2" />
                <VAutocomplete
                  v-model="product.categoryid"
                  :items="categories"
                  class="input"
                  item-text="category_name"
                  item-title="category_name"
                  item-value="id"
                  return-object
                  @update:model-value="
                    openCategorymodel(product.categoryid, index)
                  "
                >
                  <template #item="{ props, item }">
                    <div v-if="item.raw.category_code === 'Add New'">
                      <VListItem
                        style="
                          background-color: rgb(255, 255, 255);
                          color: red;
                          font-weight: bold;
                        "
                        v-bind="props"
                        :title="item.raw.category_name"
                      />
                    </div>
                    <div v-else>
                      <VListItem
                        v-bind="props"
                        :title="makeUpperCase(item.raw.category_name)"
                        :subtitle="item.raw.category_code"
                      />
                    </div>
                  </template>
                </VAutocomplete>
              </VCol>
              <!-- Product Code/Name -->
              <VCol v-if="!disorderId" lg="12" cols="12">
                <label class="label">Product Code/Name</label>
                <div class="mt-2" />
                <VAutocomplete
                  v-model="product.product_id"
                  :items="product.categoryproducts"
                  class="input"
                  item-title="product_name"
                  item-value="id"
                  return-object
                  @update:model-value="
                    ExistsProduct(index, product.product_id);
                    openProductmodal(
                      product.product_id,
                      index,
                      product.categoryid,
                    )
                  "
                >
                  <template #item="{ props, item }">
                    <div v-if="item.raw.product_code === 'Add New'">
                      <VListItem
                        style="
                          background-color: rgb(255, 255, 255);
                          color: red;
                          font-weight: bold;
                        "
                        v-bind="props"
                        :title="item.raw.product_code"
                      />
                    </div>
                    <div v-else>
                      <VListItem
                        v-bind="props"
                        :title="`${makeUpperCase(item.raw.product_name)} - ${makeUpperCase(item.raw.model_number || 'N/A')}`"
                        :subtitle="
                          item.raw.product_cost !== null &&
                          item.raw.product_cost !== ''
                            ? ` 1 unit RS. ${item.raw.product_cost} `
                            : null
                        "
                      >
                        <span
                          v-if="
                            item.raw.stock_count !== null &&
                            item.raw.stock_count !== undefined
                          "
                          style="font-size: 13px"
                        >
                          Stock : {{ item.raw.stock_count }} left
                        </span>
                      </VListItem>
                    </div>
                  </template>
                </VAutocomplete>
              </VCol>

              <!-- Product (showroom remaining stock only, narrowed to the
                   selected category when one is picked) -->
              <VCol v-if="disorderId" lg="12" cols="12">
                <label class="label">Product Code/Name</label>
                <div class="mt-2" />
                <VAutocomplete
                  v-model="product.product_id"
                  :items="filteredShowroomProducts(index)"
                  class="input"
                  item-title="product_name"
                  item-value="product_id"
                  return-object
                  @update:model-value="
                    ExistsProduct(index, product.product_id);
                    checkShowroomQuantity(index)
                  "
                >
                  <template #item="{ props, item }">
                    <VListItem
                      v-bind="props"
                      :title="`${makeUpperCase(item.raw.product_name)} - ${makeUpperCase(item.raw.model_number || 'N/A')}`"
                      :subtitle="getPrice(item.raw.unit_price)"
                    >
                      <span style="font-size: 13px">
                        Balance Stock: {{ item.raw.uptodate_quantity }}
                      </span>
                    </VListItem>
                  </template>
                </VAutocomplete>
              </VCol>

              <!-- purchase type -->

              <VCol lg="12" cols="12">
                <label class="label">Purchase Type*</label>
                <div class="mt-2" />
                <VRadioGroup
                  v-model="product.purchase_type"
                  inline
                  @input="changeType(product.purchase_type, index)"
                >
                  <VRadio
                    :label="
                      disorderId
                        ? 'Buy As Individual Units'
                        : 'Supply As Individual Units'
                    "
                    value="individual_units"
                  />
                </VRadioGroup>
              </VCol>

              <!-- Individual Quantity -->
              <VCol
                v-if="
                  product.purchase_type !== 'bulk' &&
                  product.purchase_type === 'individual_units'
                "
                lg="6"
                cols="12"
              >
                <label class="label">Item Quantity</label>
                <div class="mt-2" />
                <VTextField
                  v-model="product.individual_items_quantity"
                  :placeholder="disorderId ? 'Buy Quantity' : 'Supply Quantity'"
                  class="input"
                  @update:model-value="
                    disorderId ? checkShowroomQuantity(index) : null
                  "
                />
              </VCol>

              <!-- Fixed Packs Quantity -->
              <VCol
                v-if="
                  product.purchase_type !== 'bulk' &&
                  product.purchase_type === 'fixedpacks'
                "
                lg="6"
                cols="12"
              >
                <label class="label">Packs Quantity</label>
                <div class="mt-2" />
                <VTextField
                  v-model="product.packs_quantity"
                  placeholder="Supply Quantity"
                  class="input"
                />
              </VCol>

              <!-- item  unit price -->
              <VCol
                v-if="product.purchase_type === 'individual_units'"
                lg="6"
                cols="12"
              >
                <label class="label">Item Price</label>
                <div class="mt-2" />
                <VTextField
                  v-model="product.item_unit_price"
                  :placeholder="
                    disorderId ? 'Buy Unit Price' : 'Supply Unit Price'
                  "
                  class="input"
                  @blur="disorderId ? changeShowroomUnitPrice(index) : null"
                />
                <span
                  v-if="disorderId && sellingPriceRange(product.product_id)"
                  class="pt-1"
                  style="font-size: 12px; display: block"
                >
                  Suggested Range:
                  {{ sellingPriceRange(product.product_id) }}
                </span>
              </VCol>

              <!-- pack/item  unit price -->
              <VCol
                v-if="product.purchase_type === 'fixedpacks'"
                lg="6"
                cols="12"
              >
                <label class="label">Packet Size(kg)</label>
                <div class="mt-2" />
                <VTextField
                  v-model="product.fixed_pack_size"
                  placeholder="Item/Pack Size"
                  class="input"
                />
              </VCol>

              <!-- Weight -->
              <VCol v-if="product.purchase_type === 'bulk'" lg="6" cols="12">
                <label class="label">Weight</label>
                <div class="mt-2" />
                <VTextField
                  v-model="product.bulk_product_stock_weight"
                  placeholder="Supply Weight"
                  class="input"
                />
              </VCol>
              <!-- bulk weight unitprice -->
              <VCol
                v-if="
                  (product.purchase_type !== 'individual_units' &&
                    product.purchase_type === 'bulk') ||
                  product.purchase_type === 'fixedpacks'
                "
                lg="6"
                cols="12"
              >
                <label class="label">Price Per Unit(Per 1Kg)</label>
                <div class="mt-2" />
                <VTextField
                  v-model="product.bulk_item_weight_unit_price"
                  placeholder="Price Per 1Kg"
                  class="input"
                />
              </VCol>

              <!-- bulk wastage -->
              <VCol v-if="product.purchase_type === 'bulk'" lg="6" cols="12">
                <label class="label">Wastage(Kg)</label>
                <div class="mt-2" />
                <VTextField
                  v-model="product.bulk_wastage"
                  placeholder="Wastage"
                  class="input"
                />
              </VCol>

              <!-- indiviual items wastage -->
              <VCol
                v-if="product.purchase_type === 'individual_units'"
                lg="6"
                cols="12"
              >
                <label class="label">Wastage(Quantity)</label>
                <div class="mt-2" />
                <VTextField
                  v-model="product.individual_wastage"
                  placeholder="Wastage"
                  class="input"
                />
              </VCol>

              <!-- packs wastage -->
              <VCol
                v-if="product.purchase_type === 'fixedpacks'"
                lg="12"
                cols="12"
              >
                <label class="label">Wastage(Packs)</label>
                <div class="mt-2" />
                <VTextField
                  v-model="product.fixedpacks_wastage"
                  placeholder="Wastage"
                  class="input"
                />
              </VCol>
            </VRow>
            <div class="pt-15" />

            <!-- submit button -->
            <div class="text-right">
              <VBtn
                class="button"
                variant="none"
                icon=""
                @click="removeItem(index)"
              >
                <img src="@images/minus.png" />
              </VBtn>
            </div>
          </VForm>
          <!-- repeat item button -->
          <div class="text-left">
            <!-- repeater button -->
            <VBtn class="repeat_add" variant="none" @click="repeatForm">
              <span class="text">Add Item</span>
            </VBtn>
          </div>
          <div class="pt-15" />
          <div class="pt-5" />
          <!-- submit button -->
          <div class="text-center">
            <VBtn
              class="submit"
              variant="none"
              :loading="loading"
              @click="submitOrder"
            >
              <span class="text">Done</span>
            </VBtn>
          </div>
        </VCard>
      </div>
    </div>
  </div>

  <!-- dialogs -->

  <!-- category create dialog -->
  <VDialog
    v-model="showCategoryModal"
    width="900px"
    class="category_management"
    scrollable=""
  >
    <VCard>
      <VCardText class="add_category">
        <!-- add category form -->
        <div>
          <AddCategory @close-modal="closeCategoryModal" />
        </div>
      </VCardText>
    </VCard>
  </VDialog>

  <!-- product create dialog -->
  <VDialog
    v-model="showProductModal"
    width="900px"
    height="715px"
    class="product_management"
    scrollable=""
  >
    <VCard>
      <VCardText class="add_product">
        <div class="text-right">
          <v-btn
            color="transparent"
            variant="none"
            @click="showProductModal = false"
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
        <!-- popup product form -->
        <div>
          <AddProduct
            :selected-category="selectedCategory"
            @close="closeProductModal"
            @close-modal="closeProductModal"
          />
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script>
import CategoryApi from "@/Api/Modules/product_categories";
import productsApi from "@/Api/Modules/products";
import SupplierApi from "@/Api/Modules/supply_chain";
import SubDistributerApi from "@/Api/Modules/sub_distributer";
import AddCategory from "@/views/MasterData/ProductCategoryManagement/Components/AddCategory.vue";
import AddProduct from "@/views/StockManagement/Components/Create.vue";
import { toast } from "@/ApiConstance/toast";

export default {
  components: {
    AddCategory,
    AddProduct,
  },
  data() {
    return {
      pageTitle: {},
      showCategoryModal: false,
      showProductModal: false,
      currentProductIndex: "",
      products: [
        {
          id: 1,
          categoryid: null,
          categoryproducts: [],
          product_id: "Select Product",
          purchase_type: "individual_units",
          individual_items_quantity: "",
          item_unit_price: "",
          individual_wastage: "",
          bulk_product_stock_weight: "",
          bulk_item_weight_unit_price: "",
          bulk_wastage: "",
          packs_quantity: "",
          fixed_pack_size: "",
          fixedpacks_wastage: "",
        },
      ],
      nextTodoId: 1,
      categories: [],
      loading: false,
      form: {},
      selectedCategory: {},

      // present when this "purchase" is actually a showroom distributing
      // its remaining stock to the supplier (goods settlement) - carried
      // via query params from the ShowRoom Order Management Distribute
      // popup, through the Suppliers list, into this form
      disorderId: "",
      showroomProducts: [],
    };
  },
  async created() {
    this.disorderId = this.$route.query.disorder_id || "";

    this.form.purchased_reference_id = this.disorderId
      ? "SHDIST-" + this.disorderId + "-" + Math.floor(Math.random() * 100000)
      : "PURORD-" + Math.floor(Math.random() * 100000000);

    await this.getcategories();

    if (this.disorderId) {
      await this.getRemainingShowroomProducts();
    }
  },
  methods: {
    // get the showroom order's remaining stock (goods settlement mode) -
    // same lookup Send To Sub-Distributer already uses
    async getRemainingShowroomProducts() {
      const res = await SubDistributerApi.SendProductsForSubDistributers({
        distributer_order_id: this.disorderId,
      });

      this.showroomProducts = res.data.data || [];
    },

    // cap the entered quantity to what's left on the showroom order
    checkShowroomQuantity(index) {
      const product = this.products[index];

      if (!product.product_id || !product.product_id.product_id) return;

      const remaining = product.product_id.uptodate_quantity;

      if (Number(product.individual_items_quantity) > Number(remaining)) {
        toast("Entered Quantity Exceeded The Product Stock", "error", 20000);
        this.products[index].individual_items_quantity = "";
      } else {
        this.products[index].item_unit_price = product.product_id.unit_price;
      }
    },

    // formatted "min - max" selling price range shown under the item price
    // field, sourced from the same product relation changeShowroomUnitPrice
    // validates against
    sellingPriceRange(sendproductsforrepRow) {
      const rangeProduct = sendproductsforrepRow && sendproductsforrepRow.product;

      if (
        !rangeProduct ||
        rangeProduct.min_selling_price == null ||
        rangeProduct.max_selling_price == null
      ) {
        return "";
      }

      return `${this.getPrice(rangeProduct.min_selling_price)} - ${this.getPrice(rangeProduct.max_selling_price)}`;
    },

    // validate a manually entered showroom settlement unit price against the
    // product's suggested selling price range, same range check SendShop's
    // changeUnitPrice applies when a showroom sells stock to a shop
    changeShowroomUnitPrice(index) {
      const product = this.products[index];

      if (!product.product_id || !product.product_id.product) return;

      const { min_selling_price } = product.product_id.product;
      const enteredunitprice = Number(product.item_unit_price);

      if (!(enteredunitprice >= min_selling_price)) {
        toast(
          "Entered Unit Price Is Not In The Suggested Range",
          "error",
          20000,
        );
        this.products[index].item_unit_price = "";
      }
    },

    // get categories

    async getcategories() {
      const res = await CategoryApi.AllCategory({ page: 1, per_page: 1000 });

      this.categories = res.data.data.data;

      this.categories.push({
        id: "",
        category_code: "Add New",
        category_name: "Add New",
      });

      this.categories = this.categories.reverse();
    },

    //open category modal
    async openCategorymodel(value, index) {
      // if category selected as add new direct to add new form
      if (value.category_code === "Add New") {
        this.showCategoryModal = true;
        this.products[index].categoryid = "";
        return;
      }

      // showroom flow: category only narrows the remaining-stock list
      // (filteredShowroomProducts), selection still can't leave that stock
      if (this.disorderId) {
        this.products[index].product_id = "Select Product";
        return;
      }

      // if not showing assigned products
      const payload = {
        category_id: value.id,
      };

      await this.categoryProducts(payload, index);
    },

    // narrow the showroom order's remaining stock to the item's selected
    // category, or show all remaining stock when no category is picked
    filteredShowroomProducts(index) {
      const category = this.products[index].categoryid;

      if (!category || !category.id) {
        return this.showroomProducts;
      }

      // items whose product was never assigned a category can't be matched
      // to any category, so keep them visible under every filter instead of
      // hiding remaining stock just because it's uncategorized
      return this.showroomProducts.filter(
        (item) =>
          !item.product ||
          !item.product.category_id ||
          item.product.category_id === category.id,
      );
    },

    // Get products for selected category
    async categoryProducts(data, index) {
      try {
        const res = await productsApi.categoryproducts(data);
        const productList = res.data.data || [];

        const addNewOption = {
          id: null,
          product_code: "Add New",
          product_name: "",
          product_stock_weight: null,
          fixed_item_unit_price: "",
          loose_item_weight_unit_price: "",
          product_stock_quantity: "",
        };

        this.products[index].categoryproducts = [addNewOption, ...productList];
      } catch (error) {
        console.error("Error fetching category products:", error);
        this.products[index].categoryproducts = [];
      }
    },

    // check weather the product was already added to another item in this
    // purchase - same duplicate-guard pattern used by every other add-order
    // form (e.g. FactoryOrderManagement's CreateOrder.ExistsProduct)
    ExistsProduct(index, product) {
      if (!product) return;

      // normal category flow selects the raw product (id); the showroom
      // settlement flow (disorderId) selects a remaining-stock row keyed by
      // product_id instead
      const selectedId = this.disorderId ? product.product_id : product.id;

      if (!selectedId) return;

      // get previously added product exactly same like this
      const result = this.products.filter((val) => {
        const rowId = this.disorderId
          ? val.product_id?.product_id
          : val.product_id?.id;

        return rowId === selectedId;
      });

      if (result.length > 1) {
        toast("Product Already Selected Before", "error", 20000);
        this.products[index].product_id = "Select Product";
      }
    },

    // open product model
    openProductmodal(value, index, category) {
      if (value.product_code === "Add New") {
        this.showProductModal = true;
        this.selectedCategory = category;
        this.currentProductIndex = index;
        this.products[index].product_id = "";
      }
    },

    // change purchaase type

    changeType(value, index) {
      // if selected purchase type individual_units , another type inputs will be empty
      if (value === "individual_units") {
        this.products[index].bulk_product_stock_weight = "";
        this.products[index].bulk_item_weight_unit_price = "";
        this.products[index].bulk_wastage = "";
        this.products[index].packs_quantity = "";
        this.products[index].fixed_pack_size = "";
        this.products[index].fixedpacks_wastage = "";
      }

      // if selected purchase type bulk , another type inputs will be empty
      else if (value === "bulk") {
        this.products[index].individual_items_quantity = "";
        this.products[index].item_unit_price = "";
        this.products[index].individual_wastage = "";
        this.products[index].packs_quantity = "";
        this.products[index].fixed_pack_size = "";
        this.products[index].fixedpacks_wastage = "";
      }

      // if selected purchase type fixpacks , another type inputs will be empty
      else if (value === "fixedpacks") {
        this.products[index].individual_items_quantity = "";
        this.products[index].item_unit_price = "";
        this.products[index].individual_wastage = "";
        this.products[index].bulk_wastage = "";
        this.products[index].bulk_product_stock_weight = "";
      }
    },

    // submit form

    async submitOrder() {
      this.form.suplier_id = this.$route.params.id;

      // showroom-sourced items skip the category flow, so product_id holds
      // the raw sendproductsforrep row ({ product_id, uptodate_quantity,
      // unit_price, ... }) instead of a product with a top-level "id" -
      // normalize it here since the backend always reads product_id.id
      this.form.items = this.disorderId
        ? this.products.map((product) => ({
            ...product,
            product_id: {
              ...product.product_id,
              id: product.product_id?.product_id,
            },
          }))
        : this.products;

      if (this.disorderId) {
        this.form.source_distributer_order_id = this.disorderId;
      }

      this.loading = true;
      await SupplierApi.addPurchaseOrder(this.form)
        .then(() => {
          this.loading = false;

          // showroom-sourced settlement orders go back to that supplier's
          // own order list instead of the general suppliers list
          if (this.disorderId) {
            this.$router.push({
              name: "supply_summary",
              params: { id: this.form.suplier_id },
            });
          } else {
            this.$router.push({ name: "suppliers" });
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },

    // repeat form
    repeatForm() {
      this.products.push({
        id: (this.nextTodoId += this.nextTodoId),
        categoryid: "Select Category",
        product_id: "Select Product",
        purchase_type: "individual_units",
        individual_items_quantity: "",
        item_unit_price: "",
        individual_wastage: "",
        bulk_product_stock_weight: "",
        bulk_wastage: "",
        packs_quantity: "",
        fixed_pack_size: "",
        bulk_item_weight_unit_price: "",
        fixedpacks_wastage: "",
      });
    },

    // remove item
    removeItem(index) {
      this.products.splice(index, 1);
    },

    // close category
    async closeCategoryModal() {
      this.showCategoryModal = false;
      await this.getcategories();
    },

    // close product
    async closeProductModal() {
      
      this.showProductModal = false;

      const payload = {
        category_id: this.products[this.currentProductIndex].categoryid,
      };

      // call category product for index and wait for the refreshed list
      // before selecting from it, otherwise the newly added product isn't
      // in the (stale) list yet and the selection falls back to the wrong item
      await this.categoryProducts(payload, this.currentProductIndex);

      this.products[this.currentProductIndex].product_id =
        this.products[this.currentProductIndex].categoryproducts[
          this.products[this.currentProductIndex].categoryproducts.length - 1
        ];
    },
  },
};
</script>
