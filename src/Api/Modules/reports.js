import { api } from "../index";

export default {
  // all products with sales summary - server-side paginated, same as the
  // management list pages (default 50/page)
  async SalesWiseReport(
    searchdata = "",
    shopid = "",
    distributerid = "",
    salesrepid = "",
    startdate = "",
    enddate = "",
    page = 1,
    perPage = 50
  ) {
    return await api.get(
      `/reports/productsales?filter[distributer_salesrep_shop_order_items.shop_id]=${shopid}&filter[distributer_order_items.distributer_id]=${distributerid}&filter[distributer_salesrep_order_items.salesrep_id]=${salesrepid}&filter[starts_between_shop]=${startdate},${enddate}&filter[searchdata]=${searchdata}&page=${page}&per_page=${perPage}`
    );
  },

  // supplier orders report for a date range, optionally filtered by
  // purchased_status ('Purchased' expense orders or 'Distributed From
  // ShowRoom' income orders); omit purchased_status to get both
  async SupplierPurchasesReport(startdate = "", enddate = "", purchased_status = "") {
    return await api.get(
      `/reports/supplierpurchasesreport?startdate=${startdate}&enddate=${enddate}&purchased_status=${purchased_status}`
    );
  },

  // profit and loss report - one row per calendar month for the given
  // year, fully aggregated server-side
  async ProfitAndLossReport(year) {
    return await api.get(`/reports/profitandlossreport?year=${year}`);
  },

  // invoice wise sales summary - server-side paginated, same as the
  // management list pages (default 50/page)
  async SalesWiseDetailedReport(
    searchdata = "",
    shopid = "",
    distributerid = "",
    salesrepid = "",
    areaid = "",
    startdate = "",
    enddate = "",
    page = 1,
    perPage = 50
  ) {
    return await api.get(
      `/reports/salesdetailedreport?filter[shop_id]=${shopid}&filter[distributer_id]=${distributerid}&filter[salesrep_id]=${salesrepid}&filter[shop.area_id]=${areaid}&filter[starts_between_shop]=${startdate},${enddate}&filter[searchdata]=${searchdata}&page=${page}&per_page=${perPage}`
    );
  },
};
