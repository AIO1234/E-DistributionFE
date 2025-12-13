import { api } from "../index";

export default {
  // all products
  async allProducts(payload) {
    return await api.post("/products/index", payload);
  },

  // store product
  async storeProduct(payload) {
    return await api.post("/products/store", payload);
  },

  // update product
  async updateProduct(payload) {
    return await api.post("/products/update", payload);
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
};
