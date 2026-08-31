import { reactive } from "vue";
import CouriersApi from "@/Api/Modules/couriers";

export const couriers = reactive({
  items: [],
});

export const courierMethods = {
  // add new courier
  addNewCourier(item) {
    // check weather all ready items are loaded
    if (couriers.items !== null) {
      couriers.items.push(item);
    }
  },
  // set couriers - the backend now paginates /couriers/index, but this
  // cache is consumed as a flat list by select dropdowns app-wide, so
  // request a large per_page to effectively get everything in one page
  async setCourier() {
    const res = await CouriersApi.allCouriers({ page: 1, per_page: 1000 });

    couriers.items = res.data.data.data;
  },

  clearcouriers() {
    couriers.items = [];
  },
};
