import { reactive } from "vue";
import AreasApi from "@/Api/Modules/areas";

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
  // set areas - the backend now paginates /areas/index, but this cache is
  // consumed as a flat list by select dropdowns app-wide, so request a
  // large per_page to effectively get everything in one page
  async setAreas() {
    const res = await AreasApi.allAreas({ page: 1, per_page: 1000 });

    areas.items = res.data.data.data;
  },

  clearAreas() {
    areas.items = [];
  },
};
