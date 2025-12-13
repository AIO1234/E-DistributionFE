<template>
  <div>
    <v-skeleton-loader
      :loading="loading"
      style="background-color: transparent"
      type="image, list-item-two-line"
    >
      <v-responsive>
        <v-data-table :headers="headers" :items="Shops" items-per-page="100">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title
                ><center>
                  <span class="table_topic">All Shops</span>
                </center></v-toolbar-title
              >
            </v-toolbar>
          </template>
          <!-- contents -->
          <template
            v-for="header in headers"
            :key="header.value"
            v-slot:[`item.${header.key}`]="props"
          >
            <!-- shop code -->
            <div v-if="header.key === 'shop_code'">
              {{ props.item.shop_code }}
            </div>

            <!-- shop  name -->
            <div v-if="header.key === 'shop_name'">
              <span> {{ props.item.shop_name }}</span>
            </div>

            <!-- shop mobile -->
            <div v-if="header.key === 'shop_mobile'">
              <span> {{ props.item.shop_mobile }}</span>
            </div>

            <!-- shop address -->
            <div v-if="header.key === 'shop_address'">
              <span>
                {{ props.item.shop_address }}
              </span>
            </div>

            <div v-if="header.key === 'area_code'">
              <span v-if="props.item.area === null">
                {{ props.item.area_code }}
              </span>
              <span v-else>
                {{ props.item.area.area_code }}
              </span>
            </div>

            <!-- area name -->
            <div v-if="header.key === 'area_name'">
              <span v-if="props.item.area === null">
                {{ props.item.area_name }}
              </span>
              <span v-else>
                {{ props.item.area.area_name }}
              </span>
            </div>

            <!--last_updated_by -->
            <div v-if="header.key === 'last_updated_by'">
              <span>
                {{ props.item.last_updated_by }}
              </span>
            </div>

            <!-- action -->
            <div v-if="header.key === 'action'">
              <v-row>
                <v-col lg="2">
                  <v-btn
                    color="transparent"
                    variant="none"
                    @click="
                      show = true;
                      selectedItem = props.item;
                    "
                  >
                    <img src="@/assets/images/edit.png" style="width: 70%" />
                  </v-btn>
                </v-col>
                <v-col lg="2"> </v-col>
              </v-row>
            </div>
          </template>
        </v-data-table>
      </v-responsive>
    </v-skeleton-loader>
    <!-- open select dialog -->

    <v-dialog
      v-model="show"
      max-width="758.3px"
      min-height="216.97px"
      persistent
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

        <v-card-text>
          <Update @close="closeModal" :formData="selectedItem" /> </v-card-text
      ></v-card>
    </v-dialog>
  </div>
</template>
<script>
import Update from "./Update.vue";
export default {
  data() {
    return {
      selectedItem: {},
      show: false,
      headers: [
        { title: "Code", align: "start", key: "shop_code" },
        { title: "Name", align: "start", key: "shop_name" },
        { title: "Mobile", align: "start", key: "shop_mobile" },
        { title: "Address", align: "start", key: "shop_address" },
        { title: "Area Code", align: "start", key: "area_code" },
        { title: "Area Name", align: "start", key: "area_name" },
        { title: "Last Updated By", align: "start", key: "last_updated_by" },
        { title: "Action", align: "start", key: "action" },
      ],
      Shops: [],
    };
  },

  components: {
    Update,
  },

  props: {
    Shops: Array,
    loading: Boolean,
  },

  methods: {
    // close
    async closeModal() {
      this.show = false;
      // call close emit
      this.$emit("close");
    },
  },
};
</script>
