<template>
  <div>
    <v-skeleton-loader
      :loading="loading"
      style="background-color: transparent"
      type="image, list-item-two-line"
    >
      <v-responsive>
        <v-data-table
          :headers="headers"
          :items="SalesReps"
          items-per-page="100"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title
                ><center>
                  <span class="table_topic">All SaleReps</span>
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
            <!-- rep code -->
            <div v-if="header.key === 'rep_code'">
              {{ props.item.rep_code }}
            </div>

            <!-- rep name -->
            <div v-if="header.key === 'rep_name'">
              <span> {{ props.item.rep_name }}</span>
            </div>

            <!-- rep mobile -->
            <div v-if="header.key === 'rep_mobile'">
              <span> {{ props.item.rep_mobile }}</span>
            </div>

            <!-- rep address -->
            <div v-if="header.key === 'rep_address'">
              <span>
                {{ props.item.rep_address }}
              </span>
            </div>

            <!-- area code -->
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

            <!-- posiition -->
            <div v-if="header.key === 'position'">
              <span>
                {{ props.item.position }}
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
        { title: "Code", align: "start", key: "rep_code" },
        { title: "Name", align: "start", key: "rep_name" },
        { title: "Mobile", align: "start", key: "rep_mobile" },
        { title: "Address", align: "start", key: "rep_address" },
        { title: "Area Code", align: "start", key: "area_code" },
        { title: "Area Name", align: "start", key: "area_name" },
        { title: "Position", align: "start", key: "position" },
        { title: "Last Updated By", align: "start", key: "last_updated_by" },
        { title: "Action", align: "start", key: "action" },
      ],
      SalesReps: [],
    };
  },

  components: {
    Update,
  },

  props: {
    SalesReps: Array,
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
