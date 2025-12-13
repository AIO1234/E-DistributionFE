<template>
  <div class="order_management mt-9">
    <div>
      <v-row>
        <v-col lg="5" cols="12">
          <v-autocomplete
            placeholder="Select Sales Rep /ID"
            class="user_select_button"
            v-model="subDistributer_id"
            :items="subDistributers"
            item-title="rep_name"
            item-value="id"
            @update:model-value="getAllsubDistributerOrders()"
          ></v-autocomplete>
        </v-col>

        <v-col lg="3" cols="12">
          <v-text-field
            placeholder="Search Order Number.."
            class="search_input"
          >
            <template v-slot:prepend-inner>
              <v-icon icon="tabler-search"></v-icon>
            </template>
          </v-text-field>
        </v-col>

        <v-col lg="2" cols="12">
          <AppDateTimePicker placeholder="Start Order Date" class="search_date">
          </AppDateTimePicker>
        </v-col>

        <v-col lg="2" cols="12">
          <AppDateTimePicker placeholder="End Order Date" class="search_date">
          </AppDateTimePicker>
        </v-col>
      </v-row>
    </div>

    <div class="pt-12">
      <!-- table -->
      <v-card>
        <Table
          :subDistributerOrders="subDistributerOrders"
          :loading="loading"
        />
      </v-card>
    </div>
  </div>
</template>
<script>
import loading from "@/ApiConstance/loading";
import Table from "./Components/OrderTable.vue";
import subDistributerApi from "@/Api/Modules/sub_distributer";
export default {
  data() {
    return {
      subDistributerOrders: [],
      subDistributers: [],
      subDistributer_id: "Select Sales Rep /ID",
      loading: false,
    };
  },

  components: {
    Table,
  },

  async created() {
    await this.subDistributers();
  },

  methods: {
    // get subDistributers
    async subDistributers() {
      const res = await subDistributerApi.allSaleReps();

      this.subDistributers = res.data.data;
    },

    // get all subDistributer orders
    async getAllsubDistributerOrders() {
      this.loading = true;
      const payload = {
        subDistributer_id: this.subDistributer_id,
      };
      const res = await subDistributerApi.allsubDistributerOrders(payload);
      this.subDistributerOrders = res.data.data;
      this.loading = false;
    },
  },
};
</script>
