export default [
  
  // supplier route
  {
    path: "/masterdata/suppliers",
    name: "suppliers",
    component: () =>
      import("@/views/MasterData/SupplierManagement/index.vue"),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Data Operator", "Area Manager", "Distributer"],
      pageTitle: "Suppliers",
      breadcrumb: [
        {
          text: "Supplier Management",
          active: true,
        },
      ],
    },
  },

  // supplier summery - Data Operator excluded (shows supplier contact
  // details + an edit-supplier button + full purchase amounts, which is
  // more than the "view supplier names only" access that role is allowed)
  {
    path: "/supply_summary/:id",
    name: "supply_summary",
    component: () =>
      import(
        "@/views/MasterData/SupplierManagement/SupplierOrderView/Components/PurchasedSummary.vue"
      ),
    meta: {
      authReuire: true,
      role: ["Super Admin"],
      pageTitle: "Suppply Chain",
      breadcrumb: [
        {
          text: "Product Summary",
          active: true,
        },
      ],
    },
  },

  // adding purchesing order for supplier
  {
    path: "/add_purchase_order/:id/:name",
    name: "add_purchase_order",
    component: () =>
      import(
        "@/views/MasterData/SupplierManagement/SupplierOrderView/Components/AddProduct.vue"
      ),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Data Operator"],
      pageTitle: "Suppply Chain",
      breadcrumb: [
        {
          text: "Add Purchase Order",
          active: true,
        },
      ],
    },
  },

  // edit purchedorder for supplier
  {
    path: "/edit_purchase_order/:suplier_id/:order_id/:suplier_name",
    name: "edit_purchase_order",
    component: () =>
      import(
        "@/views/MasterData/SupplierManagement/SupplierOrderView/Components/EditProduct.vue"
      ),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Data Operator"],
      pageTitle: "Suppply Chain",
      breadcrumb: [
        {
          text: "Edit Purchase Order",
          active: true,
        },
      ],
    },
  },

  // supplier invoice
  {
    path: "/supply_invoice/:order_id/:supplier_id",
    name: "supply_invoice",
    component: () =>
      import(
        "@/views/MasterData/SupplierManagement/SupplierOrderView/Components/SupplierOrderInvoice.vue"
      ),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Data Operator"],
      pageTitle: "Suppply Chain",
      breadcrumb: [
        {
          text: "Supplier Invoice",
          active: true,
        },
      ],
    },
  },


]
