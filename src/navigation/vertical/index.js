export default [
  // {
  //   title: "Dashboard",
  //   to: { name: "home" },
  //   icon: { icon: "tabler-layout-dashboard" },
  //   role: ["Super Admin"],
  // },

  {
    title: "Users",
    to: { name: "users" },
    icon: { icon: "tabler-users" },
    role: ["Super Admin"],
  },

  {
    title: "Order management",
    icon: { icon: "tabler-gift" },
    role: [
      "Super Admin",
      "Admin",
      "Staff",
      "Distributer",
      "Area Manager",
      "SalesRep",
    ],
    children: [
      {
        title: "Factory Orders",
        to: { name: "factoryorder" },
        icon: { icon: "tabler-building-factory" },
        role: ["Super Admin", "Admin", "Staff"],
      },

      {
        title: "Distributor Orders",
        to: { name: "distributororder" },
        icon: { icon: "tabler-user-share" },
        role: ["Super Admin", "Admin", "Staff", "Distributer", "Area Manager"],
      },

      {
        title: "SalesRep Orders",
        to: { name: "salesreporder" },
        icon: { icon: "tabler-user-share" },
        role: ["Super Admin", "Admin", "Staff", "SalesRep", "Area Manager"],
      },

      {
        title: "Shop Orders",
        to: { name: "shoporder" },
        icon: { icon: "tabler-user-share" },
        role: [
          "Super Admin",
          "Admin",
          "Staff",
          "Distributer",
          "SalesRep",
          "Area Manager",
        ],
      },

      // {
      //   title: "Sub Distributer Orders",
      //   to: { name: "subdistributerorder" },
      //   icon: { icon: "tabler-user-share" },
      // },
    ],
  },
  {
    title: "Stock management",
    to: { name: "allproducts" },
    icon: { icon: "tabler-stack-3" },
    role: ["Super Admin", "Admin", "Staff"],
  },

  {
    title: "Payment management",
    to: { name: "payments" },
    icon: { icon: "tabler-cash" },
    role: [
      "Super Admin",
      "Admin",
      "Staff",
      "SalesRep",
      "Area Manager",
      "Distributer",
      "Accountan",
    ],
  },

  {
    title: "Return management",
    to: { name: "returns" },
    icon: { icon: "tabler-credit-card-refund" },
    role: [
      "Super Admin",
      "Admin",
      "Staff",
      "Area Manager",
      "Distributer",
      "SalesRep",
    ],
  },

  {
    title: "Master Data",
    icon: { icon: "tabler-database-share" },
    role: [
      "Super Admin",
      "Admin",
      "Staff",
      "Area Manager",
      "Distributer",
      "SalesRep",
    ],
    children: [
      {
        title: "Areas",
        to: { name: "allareas" },
        role: ["Super Admin", "Admin", "Staff"],
      },

      {
        title: "Distributors",
        to: { name: "alldistributers" },
        role: ["Super Admin", "Admin", "Staff", "Area Manager"],
      },

      {
        title: "SalesReps",
        to: { name: "allsalesreps" },
        role: ["Super Admin", "Admin", "Staff", "Area Manager", "Distributer"],
      },

      {
        title: "Shops",
        to: { name: "allshops" },
        role: [
          "Super Admin",
          "Admin",
          "Staff",
          "Area Manager",
          "Distributer",
          "SalesRep",
        ],
      },

      {
        title: "Sub Distributors",
        to: { name: "subdistributers" },
        role: ["Super Admin", "Admin", "Staff", "Area Manager", "Distributer"],
      },
    ],
  },

  {
    title: "Reports",
    icon: { icon: "tabler-credit-card-refund" },
    role: [
      "Super Admin",
      "Admin",
      "Staff",
      "Area Manager",
      "Distributer",
      "SalesRep",
    ],
    children: [
      {
        title: "Sales Detailed Report",
        to: { name: "salesdetailed" },
        role: [
          "Super Admin",
          "Admin",
          "Staff",
          "Area Manager",
          "Distributer",
          "SalesRep",
        ],
      },
      // {
      //   title: "Sales Detailed Report",
      //   to: { name: "allareas" },
      //   role: ["Super Admin", "Admin", "Staff"],
      // },

      {
        title: "Sales Summary Report",
        to: { name: "salessummary" },
        role: [
          "Super Admin",
          "Admin",
          "Staff",
          "Area Manager",
          "Distributer",
          "SalesRep",
        ],
      },
    ],
  },
];
