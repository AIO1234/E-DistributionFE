import { api } from "../index";

export default {
  // all products
  async allProducts(payload) {
    return await api.post("/products/index", payload);
  },

  // products filtered by category
  async categoryproducts(payload) {
    return await api.post("/products/categoryproducts", payload);
  },

  // store product
  async storeProduct(payload) {
    return await api.post("/products/store", payload);
  },

  // suggested next product code, shown as an editable default on the add form
  async nextProductCode() {
    return await api.get("/products/nextcode");
  },

  // update product
  async updateProduct(payload) {
    return await api.post("/products/update", payload);
  },

  // update ONLY the product image - image-only access for the Data Operator
  // role (payload is a FormData with id + product_image)
  async updateProductImage(payload) {
    return await api.post("/products/updateimage", payload);
  },

  // increae stock
  async increaseStock(payload) {
    return await api.post("/products/increasestock", payload);
  },

  //  product with sales summary
  async productbincard(
    id  = "",
    shopid = "",
    distributerid = "",
    salesrepid = "",
    startdate = "",
    enddate = ""
  ) {
    return await api.get(
      `/products/bincard?filter[id]=${id}&filter[distributer_salesrep_shop_order_items.shop_id]=${shopid}&filter[distributer_order_items.distributer_id]=${distributerid}&filter[distributer_salesrep_order_items.salesrep_id]=${salesrepid}&filter[starts_between_shop]=${startdate},${enddate}`
    );
  },

  // vehicle-wise bin card for a product
  async productVehicleBinCard(id = "", startdate = "", enddate = "") {
    return await api.get(
      `/products/vehiclebincard?filter[id]=${id}&filter[starts_between_shop]=${startdate},${enddate}`
    );
  },

  // product stock in/out history
  async stockMovements(payload) {
    return await api.post("/products/stockmovements", payload);
  },
};
