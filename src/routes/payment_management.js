export default [
  {
    path: "/payments",
    name: "payments",
    component: () => import("@/views/PaymentManagement/index.vue"),
    meta: {
      authReuire: true,
      role: [
        "Super Admin",
        "Admin",
        "Staff",
        "SalesRep",
        "Area Manager",
        "Distributer",
        "Accountan",
      ],
      pageTitle: "Payment Management",
      breadcrumb: [
        {
          text: "Payment Management",
          active: true,
        },
      ],
    },
  },
];
