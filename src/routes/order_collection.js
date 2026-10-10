export default [
  {
    path: "/ordercollection",
    name: "ordercollection",
    component: () =>
      import("@/views/OrderCollectionManagement/index.vue"),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Admin", "Staff", "Data Operator"],
      pageTitle: "Order Collection Management",
      breadcrumb: [
        {
          text: "Warehouse Management",
          active: false,
        },
        {
          text: "Order Collection Management",
          active: true,
        },
      ],
    },
  },
];
