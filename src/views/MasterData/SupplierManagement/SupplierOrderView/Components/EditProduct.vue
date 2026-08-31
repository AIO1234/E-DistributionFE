<template>
  <!-- edit supplier order -->
  <div class="pt-5" />
  <VSkeletonLoader
    :loading="dataloading"
    style="background-color: transparent"
    type="image, list-item-two-line"
  >
    <VResponsive>
      <div class="supplier_chain">
        <div class="pt-7" />
        <div class="add_product">
          <VRow>
            <VCol
              lg="5"
              cols="5"
            >
              <VBtn
                class="back_button"
                variant="none"
                elevation="6"
                @click="$router.back()"
              >
                <VIcon
                  icon="tabler-chevron-left"
                  class="text"
                />
                <span class="text pl-2">Back</span>
              </VBtn>
            </VCol>
            <VCol
              lg="7"
              cols="7"
            >
              <span class="title text-center">Edit Products</span>
            </VCol>
          </VRow>

          <!-- supplier details card -->
          <div class="pt-15" />
          <span class="form_heading">
            Update Suplier Order _ {{ $route.params.suplier_name }}
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

                <VCol
                  lg="6"
                  cols="12"
                >
                  <label class="label">Select purchase Date</label>

                  <div class="mt-2" />
                  <AppDateTimePicker
                    v-model="form.purchased_date"
                    placeholder="Order Date"
                    class="input_date"
                  />
                </VCol>

                <!-- order id -->

                <VCol
                  lg="6"
                  cols="12"
                >
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
                <VCol
                  lg="6"
                  cols="12"
                >
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
              <VForm
                v-for="(product, index) in products"
                :key="product"
              >
                <VRow>
                  <!-- Select Category -->
                  <VCol
                    lg="12"
                    cols="12"
                  >
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
                  <VCol
                    lg="12"
                    cols="12"
                  >
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
                        openProductmodal(product.product_id, index)
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
                              item.raw.product_cost !== null && item.raw.product_cost !== ''
                                ? ` 1 unit RS. ${item.raw.product_cost} `
                                : null
                            "
                          >
                            <span
                              v-if="item.raw.stock_count !== null && item.raw.stock_count !== undefined"
                              style="font-size: 13px"
                            >
                              Stock : {{ item.raw.stock_count }} left
                            </span>
                          </VListItem>
                        </div>
                      </template>
                    </VAutocomplete>
                  </VCol>

                  <!-- purchase type -->

                  <VCol
                    lg="12"
                    cols="12"
                  >
                    <label class="label">Purchase Type*</label>
                    <div class="mt-2" />
                    <VRadioGroup
                      v-model="product.purchase_type"
                      inline
                      @input="changeType(product.purchase_type, index)"
                    >
                      <VRadio
                        label="Supply As Individual Units"
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
                      placeholder="Supply Quantity"
                      class="input"
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
                      placeholder="Supply Unit Price"
                      class="input"
                    />
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
                  <VCol
                    v-if="product.purchase_type === 'bulk'"
                    lg="6"
                    cols="12"
                  >
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
                  <VCol
                    v-if="product.purchase_type === 'bulk'"
                    lg="6"
                    cols="12"
                  >
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
                    <img src="@images/minus.png">
                  </VBtn>
                </div>
              </VForm>
              <!-- repeat item button -->
              <div class="text-left">
                <!-- repeater button -->
                <VBtn
                  class="repeat_add"
                  variant="none"
                  @click="repeatForm"
                >
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
                  @click="updateOrder"
                >
                  <span class="text">Done</span>
                </VBtn>
              </div>
            </VCard>
          </div>
        </div>
      </div>
    </VResponsive>
  </VSkeletonLoader>
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
        <!-- add suplier form -->
        <div>
          <AddProduct
            @close="closeProductModal"
            @close-modal="closeProductModal"
          />
        </div>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<script>
import CategoryApi from "@/Api/Modules/product_categories"
import productsApi from "@/Api/Modules/products"
import SupplierApi from "@/Api/Modules/supply_chain"
import AddCategory from "@/views/MasterData/ProductCategoryManagement/Components/AddCategory.vue"
import AddProduct from "@/views/StockManagement/Components/Create.vue"

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
      products: [],
      nextTodoId: 1,

      categories: [],

      loading: false,
      dataloading: false,
      form: {},
    }
  },
  async created() {
    await this.showOrder()
    await this.getcategories()
  },
  methods: {
    // get exist order details

    async showOrder() {
      const payload = {
        suplier_id: this.$route.params.suplier_id,
        order_id: this.$route.params.order_id,
      }

      this.dataloading = true

      const res = await SupplierApi.editaPurchaseOrder(payload)

      this.form = res.data.data

      this.form.order_items.forEach((element, index) => {
        // items whose product has no category (e.g. showroom-distributed
        // settlement items) can't look up a category product list
        if (element.category) {
          const payload = {
            category_id: element.category.id,
          }

          // get products belongs to looping category id
          this.categoryProducts(payload, index)
        }

        // push ordered products items
        this.products.push({
          id: element.pivot.id,
          categoryid: element.category,
          categoryproducts: [],
          product_id: element,
          purchase_type: element.pivot.purchase_type,
          individual_items_quantity: element.pivot.individual_items_quantity,
          item_unit_price: element.pivot.item_unit_price,
          individual_wastage: element.pivot.individual_wastage,
          bulk_product_stock_weight: element.pivot.bulk_product_stock_weight,
          bulk_item_weight_unit_price:
            element.pivot.bulk_item_weight_unit_price,
          bulk_wastage: element.pivot.bulk_wastage,
          packs_quantity: element.pivot.packs_quantity,
          fixed_pack_size: element.pivot.fixed_pack_size,
          fixedpacks_wastage: element.pivot.fixedpacks_wastage,
        })
      })
      this.dataloading = false
    },

    // get categories

    async getcategories() {
      const res = await CategoryApi.AllCategory({ page: 1, per_page: 1000 })

      this.categories = res.data.data.data

      this.categories.push({
        id: "",
        category_code: "Add New",
        category_name: "Add New",
      })

      this.categories = this.categories.reverse()
    },

    //open category modal
    async openCategorymodel(value, index) {
      // if category selected as add new direct to add new form
      if (value.category_code === "Add New") {
        this.showCategoryModal = true
        this.products[index].categoryid = ""
      }

      // if not showing assigned products
      else {
        const payload = {
          category_id: value.id,
        }

        await this.categoryProducts(payload, index)
      }
    },

    // get products
    async categoryProducts(data, index) {
      const res = await productsApi.categoryproducts(data)
      const productList = res.data.data || []

      const addNewOption = {
        id: 5,
        product_code: "Add New",
        product_name: "",
        product_stock_weight: null,
        fixed_item_unit_price: "",
        loose_item_weight_unit_price: "",
        product_stock_quantity: "",
      }

      // newest product is last in productList (see AddProduct.vue for the
      // same convention) - closeProductModal relies on that ordering to
      // select the just-added product, so don't reverse it away here
      this.products[index].categoryproducts = [addNewOption, ...productList]
    },

    // open product model
    openProductmodal(value, index) {
      if (value.product_code === "Add New") {
        this.showProductModal = true
        this.currentProductIndex = index
        this.products[index].product_id = ""
      }
    },

    // change purchaase type

    changeType(value, index) {
      // if selected purchase type individual_units , another type inputs will be empty
      if (value === "individual_units") {
        this.products[index].bulk_product_stock_weight = ""
        this.products[index].bulk_item_weight_unit_price = ""
        this.products[index].bulk_wastage = ""
        this.products[index].packs_quantity = ""
        this.products[index].fixed_pack_size = ""
        this.products[index].fixedpacks_wastage = ""
      }

      // if selected purchase type bulk , another type inputs will be empty
      else if (value === "bulk") {
        this.products[index].individual_items_quantity = ""
        this.products[index].item_unit_price = ""
        this.products[index].individual_wastage = ""
        this.products[index].packs_quantity = ""
        this.products[index].fixed_pack_size = ""
        this.products[index].fixedpacks_wastage = ""
      }

      // if selected purchase type fixpacks , another type inputs will be empty
      else if (value === "fixedpacks") {
        this.products[index].individual_items_quantity = ""
        this.products[index].item_unit_price = ""
        this.products[index].individual_wastage = ""
        this.products[index].bulk_wastage = ""
        this.products[index].bulk_product_stock_weight = ""
      }
    },

    // submit form

    async updateOrder() {
      this.form.items = this.products
      this.loading = true
      await SupplierApi.updatePurchaseOrder(this.form)
        .then(() => {
          this.loading = false
          this.$router.push({ name: "suppliers" })
        })
        .catch(() => {
          this.loading = false
        })
    },

    // repeat form
    repeatForm() {
      this.products.push({
        id: "",
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
      })
    },

    // remove item
    removeItem(index) {
      this.products.splice(index, 1)
    },

    // close category
    async closeCategoryModal() {
      this.showCategoryModal = false
      await this.getcategories()
    },

    // close product
    async closeProductModal() {
      this.showProductModal = false

      const payload = {
        category_id: this.products[this.currentProductIndex].categoryid,
      }

      // call category product for index and wait for the refreshed list
      // before selecting from it, otherwise the newly added product isn't
      // in the (stale) list yet and the selection falls back to the wrong item
      await this.categoryProducts(payload, this.currentProductIndex)

      this.products[this.currentProductIndex].product_id =
        this.products[this.currentProductIndex].categoryproducts[
          this.products[this.currentProductIndex].categoryproducts.length - 1
        ]
    },
  },
}
</script>
