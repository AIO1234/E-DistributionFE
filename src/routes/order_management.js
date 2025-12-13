export default [
  {
    path: "/factoryorder",
    name: "factoryorder",
    component: () =>
      import("@/views/OrderManagement/FactoryOrderManagement/index.vue"),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Admin", "Staff"],
      pageTitle: "Factory Orders",
      breadcrumb: [
        {
          text: "Order Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/distributororder",
    name: "distributororder",
    component: () =>
      import("@/views/OrderManagement/DistributerOrderManagement/index.vue"),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Admin", "Staff", "Distributer", "Area Manager"],
      pageTitle: "Distributors",
      breadcrumb: [
        {
          text: "Order Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/salesreporder",
    name: "salesreporder",
    component: () =>
      import("@/views/OrderManagement/SalesRepOrderManagement/index.vue"),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Admin", "Staff", "SalesRep", "Area Manager"],
      pageTitle: "Sales Reps",
      breadcrumb: [
        {
          text: "Order Management",
          active: true,
        },
      ],
    },
  },

  // {
  //   path: "/subdistributerorder",
  //   name: "subdistributerorder",
  //   component: () => import("@/views/SubDistributerOrders/index.vue"),
  //   meta: {
  //     pageTitle: "Sub Distributer Orders",
  //     breadcrumb: [
  //       {
  //         text: "Order Management",
  //         active: true,
  //       },
  //     ],
  //   },
  // },

  {
    path: "/shoporder",
    name: "shoporder",
    component: () =>
      import("@/views/OrderManagement/ShopOrderManagement/index.vue"),
    meta: {
      authReuire: true,
      role: [
        "Super Admin",
        "Admin",
        "Staff",
        "Distributer",
        "SalesRep",
        "Area Manager",
      ],
      pageTitle: "Shops",
      breadcrumb: [
        {
          text: "Order Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/senddistributer/:main_order_id",
    name: "senddistributer",
    component: () =>
      import(
        "@/views/OrderManagement/FactoryOrderManagement/Components/SendDistributer.vue"
      ),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Admin", "Staff"],
      pageTitle: "Distributor Management",
      breadcrumb: [
        {
          text: "Order Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/updatedistributerorders/:main_order_id",
    name: "updatedistributers",
    component: () =>
      import(
        "@/views/OrderManagement/FactoryOrderManagement/Components/UpdateDistributers.vue"
      ),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Admin", "Staff"],
      pageTitle: "Distributor Management",
      breadcrumb: [
        {
          text: "Order Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/sendsalesrep/:main_order_id/:distributer_id/:distributer_order_id",
    name: "sendsalesrep",
    component: () =>
      import(
        "@/views/OrderManagement/DistributerOrderManagement/Components/SendSalesRep.vue"
      ),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Admin", "Staff", "Distributer", "Area Manager"],
      pageTitle: "Sales Rep Management",
      breadcrumb: [
        {
          text: "Order Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/updatesalesreps/:main_order_id/:distributer_id/:distributer_order_id",
    name: "updatesalesrep",
    component: () =>
      import(
        "@/views/OrderManagement/DistributerOrderManagement/Components/UpdateSalesRep.vue"
      ),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Admin", "Staff", "Distributer", "Area Manager"],
      pageTitle: "Sales Rep Management",
      breadcrumb: [
        {
          text: "Order Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/sendshop/:main_order_id/:distributer_id/:distributer_order_id/:sales_rep_id/:reporder_id",
    name: "sendshop",
    component: () =>
      import(
        "@/views/OrderManagement/SalesRepOrderManagement/Components/SendShop.vue"
      ),
    props: true,
    meta: {
      authReuire: true,
      role: ["Super Admin", "Admin", "Staff", "SalesRep", "Area Manager"],
      pageTitle: "Shop Management",
      breadcrumb: [
        {
          text: "Order Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/sendsubdistributer/:main_order_id/:distributer_id/:distributer_order_id",
    name: "sendsubdistributer",
    component: () =>
      import(
        "@/views/OrderManagement/DistributerOrderManagement/Components/SendSubDistributer.vue"
      ),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Admin", "Staff", "Distributer", "Area Manager"],
      pageTitle: "Sub Distributor Management",
      breadcrumb: [
        {
          text: "Order Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/ordersummary/:summary_type/:order_id",
    name: "ordersummary",
    component: () =>
      import("@/views/OrderManagement/CommonComponents/OrderSummary.vue"),
    meta: {
      authReuire: true,
      role: [
        "Super Admin",
        "Admin",
        "Staff",
        "SalesRep",
        "Distributer",
        "Area Manager",
      ],
      pageTitle: "Order Summary",
      breadcrumb: [
        {
          text: "Order Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/factoryorderinvoice/:order_id",
    name: "factoryorderinvoice",
    component: () =>
      import(
        "@/views/OrderManagement/FactoryOrderManagement/Components/OrderInvoice.vue"
      ),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Admin", "Staff"],
      pageTitle: "factoryorderinvoice",
      breadcrumb: [
        {
          text: "Order Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/distributeorderinvoice/:order_id",
    name: "distributeorderinvoice",
    component: () =>
      import(
        "@/views/OrderManagement/DistributerOrderManagement/Components/OrderInvoice.vue"
      ),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Admin", "Staff", "Distributer", "Area Manager"],
      pageTitle: "Distributer Order Invoice",
      breadcrumb: [
        {
          text: "Order Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/salesreporderinvoice/:order_id",
    name: "salesreporderinvoice",
    component: () =>
      import(
        "@/views/OrderManagement/SalesRepOrderManagement/Components/OrderInvoice.vue"
      ),
    meta: {
      authReuire: true,
      role: [
        "Super Admin",
        "Admin",
        "Staff",
        "Distributer",
        "SalesRep",
        "Area Manager",
      ],
      pageTitle: "SalesRep Order Invoice",
      breadcrumb: [
        {
          text: "Order Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/shoporderinvoice/:order_id",
    name: "shoporderinvoice",
    component: () =>
      import(
        "@/views/OrderManagement/ShopOrderManagement/Components/OrderInvoice.vue"
      ),
    meta: {
      authReuire: true,
      role: [
        "Super Admin",
        "Admin",
        "Staff",
        "Distributer",
        "SalesRep",
        "Area Manager",
      ],
      pageTitle: "Shop Order Invoice",
      breadcrumb: [
        {
          text: "Order Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/shoporderdeliverynote/:order_id",
    name: "shoporderdeliverynote",
    component: () =>
      import(
        "@/views/OrderManagement/ShopOrderManagement/Components/DeliveryNote.vue"
      ),
    meta: {
      authReuire: true,
      role: [
        "Super Admin",
        "Admin",
        "Staff",
        "Distributer",
        "SalesRep",
        "Area Manager",
      ],
      pageTitle: "Shop Order Delivery Note",
      breadcrumb: [
        {
          text: "Order Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/subdistributerorderinvoice/:order_id",
    name: "subdistributerorderinvoice",
    component: () =>
      import(
        "@/views/OrderManagement/SubDistributerOrders/Components/OrderInvoice.vue"
      ),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Admin", "Staff", "Distributer", "Area Manager"],
      pageTitle: "Sub Distributer Order Invoice",
      breadcrumb: [
        {
          text: "Order Management",
          active: true,
        },
      ],
    },
  },
];
