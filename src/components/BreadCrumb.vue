<template>
  <div class="breadcrumb">
    <div class="d-flex justify-content-center">
      <div lg="2">
        <h2 class="page_title">
          {{ $route.meta.pageTitle }}
        </h2>
      </div>

      &nbsp;
      <div
        class="web_header"
        style="
          border-left: 2px solid lightgrey;
          height: 60px;
          margin-left: 10px;
        "
      ></div>

      <div class="web_header" lg="6">
        <v-breadcrumbs>
          <v-breadcrumbs-item>
            <v-icon
              color="primary"
              style="width: 30px; height: 20px"
              icon="tabler-home"
            >
            </v-icon
          ></v-breadcrumbs-item>

          <v-breadcrumbs-item>
            <v-icon
              style="
                width: 30px;
                height: 20px;
                margin-top: 1px;
                color: lightslategray;
              "
              icon="tabler-arrow-move-right"
            ></v-icon>
          </v-breadcrumbs-item>

          <div>
            <v-breadcrumbs-item
              v-for="item in $route.meta.breadcrumb"
              :key="item.text"
              :active="item.active"
              :to="item.to"
            >
              {{ item.text }}
            </v-breadcrumbs-item>
          </div>
        </v-breadcrumbs>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    title: "",
    page: "",
    items: [
      {
        title: "Link 1",
        disabled: false,
      },
      {
        title: "Link 2",
        disabled: true,
      },
    ],
  }),

  // props: {
  //   pageTitle: Object,
  // },

  // created() {
  //   this.title = this.pageTitle.title;
  //   this.page = this.pageTitle.page;
  // },
};
</script>
