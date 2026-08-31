import { reactive } from "vue";
import VehiclesApi from "@/Api/Modules/vehicles";

export const vehicles = reactive({
  items: [],
});

export const vehicleMethods = {
  // add new area
  addNewVehicle(item) {
    // check weather all ready items are loaded
    if (vehicles.items !== null) {
      vehicles.items.push(item);
    }
  },
  // set vehicles - the backend now paginates /vehicles/index, but this
  // cache is consumed as a flat list by select dropdowns app-wide, so
  // request a large per_page to effectively get everything in one page
  async setVehicles() {
    const res = await VehiclesApi.allVehicles({ page: 1, per_page: 1000 });

    vehicles.items = res.data.data.data;
  },

  clearVehicles() {
    vehicles.items = [];
  },
};
