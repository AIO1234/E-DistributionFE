import { reactive } from "vue";
import DistributerApi from "@/Api/Modules/distributer";

export const areas = reactive({
  items: [],
});

export const areaMethods = {
  // add new area
  addNewArea(item) {
    // check weather all ready items are loaded
    if (areas.items !== null) {
      areas.items.push(item);
    }
  },
  // set areas
  async setAreas() {
    const res = await AreasApi.allAreas();

    areas.items = res.data.data;
  },

  clearAreas() {
    areas.items = [];
  },
};
