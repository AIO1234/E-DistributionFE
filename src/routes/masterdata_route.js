export default [
  {
    path: "/masterdata/areas",
    name: "allareas",
    component: () => import("@/views/MasterData/AreaManagement/index.vue"),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Admin", "Staff"],
      pageTitle: "Area Management",
      breadcrumb: [
        {
          text: "Area Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/masterdata/products",
    name: "allproducts",
    component: () => import("@/views/StockManagement/index.vue"),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Admin", "Staff"],
      pageTitle: "Product Management",
      breadcrumb: [
        {
          text: "Product Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/masterdata/distributers",
    name: "alldistributers",
    component: () =>
      import("@/views/MasterData/DistributerManagement/index.vue"),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Admin", "Staff", "Area Manager"],
      pageTitle: "Distributer Management",
      breadcrumb: [
        {
          text: "Distributer Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/masterdata/salesreps",
    name: "allsalesreps",
    component: () => import("@/views/MasterData/SalesRepManagement/index.vue"),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Admin", "Staff", "Area Manager", "Distributer"],
      pageTitle: "SalesReps Management",
      breadcrumb: [
        {
          text: "SalesReps Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/masterdata/shops",
    name: "allshops",
    component: () => import("@/views/MasterData/ShopManagement/index.vue"),
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
      pageTitle: "Shop Management",
      breadcrumb: [
        {
          text: "Shop Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/masterdata/subdistributers",
    name: "subdistributers",
    component: () =>
      import("@/views/MasterData/SubDistributerManagement/index.vue"),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Admin", "Staff", "Area Manager", "Distributer"],
      pageTitle: "SubDistributer",
      breadcrumb: [
        {
          text: "SubDistributer",
          active: true,
        },
      ],
    },
  },
];
