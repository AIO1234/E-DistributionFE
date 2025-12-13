import { api } from "../index";

export default {
  // all products with sales summary
  async SalesWiseReport(
    searchdata = "",
    shopid = "",
    distributerid = "",
    salesrepid = "",
    startdate = "",
    enddate = ""
  ) {
    return await api.get(
      `/reports/productsales?filter[distributer_salesrep_shop_order_items.shop_id]=${shopid}&filter[distributer_order_items.distributer_id]=${distributerid}&filter[distributer_salesrep_order_items.salesrep_id]=${salesrepid}&filter[starts_between_shop]=${startdate},${enddate}&filter[searchdata]=${searchdata}`
    );
  },

  // invoice wise sales summary
  async SalesWiseDetailedReport(
    searchdata = "",
    shopid = "",
    distributerid = "",
    salesrepid = "",
    areaid = "",
    startdate = "",
    enddate = ""
  ) {
    return await api.get(
      `/reports/salesdetailedreport?filter[shop_id]=${shopid}&filter[distributer_id]=${distributerid}&filter[salesrep_id]=${salesrepid}&filter[shop.area_id]=${areaid}&filter[starts_between_shop]=${startdate},${enddate}&filter[searchdata]=${searchdata}`
    );
  },
};
