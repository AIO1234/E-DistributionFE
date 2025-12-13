export default [
  {
    path: "/salessummary",
    name: "salessummary",
    component: () => import("@/views/ReportManagement/SalesSummaryReport.vue"),
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
      pageTitle: "Report",
      breadcrumb: [
        {
          text: "Sales Summary Report",
          active: true,
        },
      ],
    },
  },

  {
    path: "/salesdetailed",
    name: "salesdetailed",
    component: () => import("@/views/ReportManagement/SalesDetailedReport.vue"),
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
      pageTitle: "Report",
      breadcrumb: [
        {
          text: "Sales Detailed Report",
          active: true,
        },
      ],
    },
  },
];
