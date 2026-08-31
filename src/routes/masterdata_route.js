export default [
  {
    path: "/masterdata/areas",
    name: "allareas",
    component: () => import("@/views/MasterData/AreaManagement/index.vue"),
    meta: {
      authReuire: true,
      role: ["Super Admin"],
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
    path: "/masterdata/vehicles",
    name: "allvechicles",
    component: () => import("@/views/MasterData/VehicleManagement/index.vue"),
    meta: {
      authReuire: true,
      role: ["Super Admin"],
      pageTitle: "Vehicle Management",
      breadcrumb: [
        {
          text: "Vehicle Management",
          active: true,
        },
      ],
    },
  },

  {
    path: "/masterdata/couriers",
    name: "allcouriers",
    component: () => import("@/views/MasterData/CourierManagement/index.vue"),
    meta: {
      authReuire: true,
      role: ["Super Admin"],
      pageTitle: "Courier Management",
      breadcrumb: [
        {
          text: "Courier Management",
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
      role: ["Super Admin", "Admin", "Staff", "Data Operator"],
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
      role: ["Super Admin", "Area Manager"],
      pageTitle: "ShowRoom Management",
      breadcrumb: [
        {
          text: "ShowRoom Management",
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
      role: ["Super Admin", "Area Manager", "Distributer"],
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
      role: ["Super Admin", "Area Manager", "Distributer"],
      pageTitle: "Shop Management",
      breadcrumb: [
        {
          text: "Shop Management",
          active: true,
        },
      ],
    },
  },

  // product categories route
  {
    path: "/masterdata/product-categories",
    name: "product-categories",
    component: () =>
      import("@/views/MasterData/ProductCategoryManagement/index.vue"),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Area Manager", "Distributer"],
      pageTitle: "Product Category Management",
      breadcrumb: [
        {
          text: "Product Category",
          active: true,
        },
      ],
    },
  },
  

]
