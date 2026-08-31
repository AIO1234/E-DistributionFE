<template>
  <div>
    <VSkeletonLoader
      :loading="loading"
      style="background-color: transparent"
      type="image, list-item-two-line"
    >
      <VResponsive>
        <VDataTable
          :headers="headers"
          :items="Expenses"
          items-per-page="100"
        >
          <!-- contents -->
          <template
            v-for="header in headers"
            :key="header.value"
            #[`item.${header.key}`]="props"
          >
            <!-- expense reference id -->
            <div v-if="header.key === 'expense_reference_id'">
              {{ props.item.expense_reference_id }}
            </div>

            <!-- expense type -->
            <div v-if="header.key === 'expense_type'">
              <span> {{ props.item.expense_type }}</span>
            </div>

            <!-- description / reason -->
            <div v-if="header.key === 'reason'">
              <span>{{ props.item.reason || "N/A" }}</span>
            </div>

            <!-- related person/entity -->
            <div v-if="header.key === 'related_entity'">
              <span>{{ getRelatedEntity(props.item) }}</span>
            </div>

            <!-- amount -->
            <div v-if="header.key === 'amount'">
              <span> {{ getPrice(props.item.amount) }}</span>
            </div>

            <!-- date -->
            <div v-if="header.key === 'expense_date'">
              <span v-if="props.item.expense_date !== null">
                {{ props.item.expense_date }}
              </span>
              <span v-else>N/A</span>
            </div>

            <!-- status -->
            <div v-if="header.key === 'status'">
              <VChip
                :color="statusColor(props.item.status)"
                size="small"
                label
              >
                {{ props.item.status || "Pending" }}
              </VChip>
            </div>

            <!-- action -->
            <div v-if="header.key === 'action'">
              <VRow>
                <VCol lg="2">
                  <VBtn
                    color="transparent"
                    variant="none"
                    @click="
                      show = true;
                      selectedItem = props.item;
                    "
                  >
                    <img
                      src="@images/edit.png"
                      style="width: 70%"
                    >
                  </VBtn>
                </VCol>
                <VCol lg="2" />
              </VRow>
            </div>
          </template>
        </VDataTable>
      </VResponsive>
    </VSkeletonLoader>

    <!-- open update dialog -->

    <VDialog
      v-model="show"
      max-width="758.3px"
      min-height="216.97px"
      persistent
      scrollable=""
    >
      <VCard>
        <div class="text-right">
          <VBtn
            color="transparent"
            variant="none"
            @click="show = false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="icon icon-tabler icons-tabler-filled icon-tabler-square-x"
            >
              <path
                stroke="none"
                d="M0 0h24v24H0z"
                fill="none"
              />
              <path d="M19 2h-14a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3 -3v-14a3 3 0 0 0 -3 -3zm-9.387 6.21l.094 .083l2.293 2.292l2.293 -2.292a1 1 0 0 1 1.497 1.32l-.083 .094l-2.292 2.293l2.292 2.293a1 1 0 0 1 -1.32 1.497l-.094 -.083l-2.293 -2.292l-2.293 2.292a1 1 0 0 1 -1.497 -1.32l.083 -.094l2.292 -2.293l-2.292 -2.293a1 1 0 0 1 1.32 -1.497z" />
            </svg>
          </VBtn>
        </div>

        <VCardText>
          <Update
            :form-data="selectedItem"
            @close="closeModal"
          />
        </VCardText>
      </VCard>
    </VDialog>
  </div>
</template>

<script>
import Update from "./Update.vue"

export default {

  components: {
    Update,
  },

  props: {
    Expenses: Array,
    loading: Boolean,
  },
  data() {
    return {
      selectedItem: {},
      show: false,
      headers: [
        { title: "Expense ID", align: "start", key: "expense_reference_id" },
        { title: "Expense Type", align: "start", key: "expense_type" },
        { title: "Description / Reason", align: "start", key: "reason" },
        {
          title: "Related Person/Entity",
          align: "start",
          key: "related_entity",
        },
        { title: "Amount(Rs)", align: "start", key: "amount" },
        { title: "Date", align: "start", key: "expense_date" },
        { title: "Status", align: "start", key: "status" },
        { title: "Action", align: "start", key: "action" },
      ],
    }
  },

  methods: {
    // close
    async closeModal() {
      this.show = false

      // call close emit
      this.$emit("close")
    },

    // resolve the related courier/sales rep name for a row
    getRelatedEntity(item) {
      return item.courier?.company_name || item.salesrep?.rep_name || "N/A"
    },

    // status chip color
    statusColor(status) {
      if (status === "Confirmed") return "success"

      return "warning"
    },
  },
}
</script>


