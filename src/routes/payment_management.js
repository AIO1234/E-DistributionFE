export default [
  {
    path: "/payments",
    name: "payments",
    component: () => import("@/views/PaymentManagement/index.vue"),
    meta: {
      authReuire: true,
      role: [
        "Super Admin",
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

  // supplier payment routes 
  {
    path: "/supplierpayments",
    name: "supplierpayments",
    component: () => import("@/views/PaymentManagement/SupplierPayments/index.vue"),
    meta: {
      authReuire: true,
      role: [
        "Super Admin",
      ],
      pageTitle: " Supplier Payments",
      breadcrumb: [
        {
          text: "Supplier Payment History & purches order details",
          active: true,
        },
      ],
    },
  },
]
