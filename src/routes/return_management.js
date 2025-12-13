export default [
  {
    path: "/returns",
    name: "returns",
    component: () => import("@/views/ReturnManagement/index.vue"),
    meta: {
      authReuire: true,
      role: [
        "Super Admin",
        "Admin",
        "Staff",
        "Area Manager",
        "Distributer",
        "SalesRep",
      ],
      pageTitle: "Return Management",
      breadcrumb: [
        {
          text: "All Returns",
          active: true,
        },
      ],
    },
  },

  {
    path: "/returnsummary/:id",
    name: "returnsummary",
    component: () =>
      import("@/views/ReturnManagement/Components/ReturnSummary.vue"),
    meta: {
      authReuire: true,
      role: [
        "Super Admin",
        "Admin",
        "Staff",
        "Area Manager",
        "Distributer",
        "SalesRep",
      ],
      pageTitle: "Return Management",
      breadcrumb: [
        {
          text: "Return Summary",
          active: true,
        },
      ],
    },
  },
];
