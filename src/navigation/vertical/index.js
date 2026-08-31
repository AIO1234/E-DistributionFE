export default [
  {
    title: "Dashboard",
    to: { name: "home" },
    icon: { icon: "tabler-layout-dashboard" },
    role: ["Super Admin"],
  },

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
      "Staff", "Data Operator",
      "Distributer",
      "Area Manager",
      "SalesRep",
    ],
    children: [
      {
        title: "WearHouse Orders",
        to: { name: "factoryorder" },
        icon: { icon: "tabler-building-factory" },
        role: ["Super Admin", "Admin", "Staff", "Data Operator"],
      },

      {
        title: "ShowRoom Orders",
        to: { name: "distributororder" },
        icon: { icon: "tabler-user-share" },
        role: ["Super Admin", "Admin", "Staff", "Data Operator", "Distributer", "Area Manager"],
      },

      {
        title: "SalesRep Orders",
        to: { name: "salesreporder" },
        icon: { icon: "tabler-user-share" },
        role: ["Super Admin", "Admin", "Staff", "Data Operator", "SalesRep", "Area Manager"],
      },

      {
        title: "Shop Orders",
        to: { name: "shoporder" },
        icon: { icon: "tabler-user-share" },
        role: ["Super Admin", "Admin", "Staff", "Data Operator", "Distributer", "Area Manager"],
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
    role: ["Super Admin", "Admin", "Staff", "Data Operator"],
  },

  {
    title: "Supplier Management",
    to: { name: "suppliers" },
    icon: { icon: "tabler-truck-delivery" },
    role: ["Super Admin", "Data Operator", "Area Manager", "Distributer"],
  },

  {
    title: "Incomming Payments",
    to: { name: "payments" },
    icon: { icon: "tabler-cash" },
    role: [
      "Super Admin",
      "Area Manager",
      "Distributer",
      "Accountan",
    ],
  },

  {
    title: "Supplier Payments",
    to: { name: "supplierpayments" },
    icon: { icon: "tabler-file-invoice" },
    role: [
      "Super Admin",
      "Area Manager",
      "Distributer",
      "Accountan",
    ],
  },

  {
    title: "Expense management",
    to: { name: "expenses" },
    icon: { icon: "tabler-receipt-2" },
    role: ["Super Admin", "Admin", "Accountant"],
  },

  {
    title: "Return management",
    to: { name: "returns" },
    icon: { icon: "tabler-credit-card-refund" },
    role: ["Super Admin", "Admin", "Area Manager", "Distributer"],
  },

  {
    title: "Master Data",
    icon: { icon: "tabler-database-share" },
    role: ["Super Admin", "Area Manager", "Distributer"],
    children: [
      {
        title: "Areas",
        to: { name: "allareas" },
        role: ["Super Admin"],
      },

      {
        title: "Transports",
        to: { name: "allcouriers" },
        role: ["Super Admin"],
      },

      {
        title: "Vehicles",
        to: { name: "allvechicles" },
        role: ["Super Admin"],
      },

      {
        title: "ShowRooms/Distributors",
        to: { name: "alldistributers" },
        role: ["Super Admin", "Area Manager"],
      },

      {
        title: "SalesReps",
        to: { name: "allsalesreps" },
        role: ["Super Admin", "Area Manager", "Distributer"],
      },

      {
        title: "Shops",
        to: { name: "allshops" },
        role: ["Super Admin", "Area Manager", "Distributer"],
      },

      //Product Categories -> catagory details
      {
        title: "Product Categories",
        to: { name: "product-categories" },
        role: ["Super Admin", "Area Manager", "Distributer"],
      },
    ],
  },

  {
    title: "Reports",
    icon: { icon: "tabler-credit-card-refund" },
    role: ["Super Admin", "Admin"],
    children: [
      {
        title: "Sales Detailed Report",
        to: { name: "salesdetailed" },
        role: ["Super Admin", "Admin"],
      },

      // {
      //   title: "Sales Detailed Report",
      //   to: { name: "allareas" },
      //   role: ["Super Admin", "Admin", "Staff", "Data Operator"],
      // },

      {
        title: "Sales Summary Report",
        to: { name: "salessummary" },
        role: ["Super Admin"],
      },

      {
        title: "Profit And Loss Report",
        to: { name: "profitandloss" },
        role: ["Super Admin"],
      },
    ],
  },
];
