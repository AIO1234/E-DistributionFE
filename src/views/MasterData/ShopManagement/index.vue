<template>
  <div class="mt-9 masterdata">
    <div class="pt-12">
      <v-row>
        <v-col lg="6" class="text-right" cols="12"> </v-col>
        <!-- create order -->
        <v-col lg="6" class="text-right" cols="12">
          <v-btn class="create_btn" variant="none" @click="show = true">
            <template v-slot:prepend>
              <img src="@/assets/images/IconsSolid.png" />
            </template>
            <span class="text">Create Shop</span>
          </v-btn>
        </v-col>
      </v-row>

      <div class="pt-12"></div>
      <!-- table -->
      <v-card>
        <Table :Shops="Shops" :loading="loading" @close="closeModal" />
      </v-card>
    </div>

    <!-- create dialog -->

    <v-dialog
      v-model="show"
      max-width="758.3px"
      min-height="216.97px"
      persistent
      scrollable=""
    >
      <v-card>
        <div class="text-right">
          <v-btn color="transparent" variant="none" @click="show = false">
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

        <v-card-text> <Create @close="closeModal" /> </v-card-text
      ></v-card>
    </v-dialog>
  </div>
</template>
<script>
import Table from "./Components/Table.vue";
import Create from "./Components/Create.vue";
import ShopsApi from "@/Api/Modules/shop";
export default {
  data() {
    return {
      show: false,
      Shops: [],
      loading: false,
    };
  },
  components: {
    Table,
    Create,
  },

  async created() {
    await this.getAllShops();
  },

  methods: {
    // get all  Shops
    async getAllShops() {
      this.loading = true;
      const res = await ShopsApi.allShops();
      this.Shops = res.data.data;
      this.loading = false;
    },
    // close
    async closeModal() {
      this.show = false;
      // call Shops
      await this.getAllShops();
    },
  },
};
</script>
