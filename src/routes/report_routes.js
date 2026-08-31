export default [
  {
    path: "/salessummary",
    name: "salessummary",
    component: () => import("@/views/ReportManagement/SalesSummaryReport.vue"),
    meta: {
      authReuire: true,
      role: ["Super Admin"],
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
      role: ["Super Admin", "Admin"],
      pageTitle: "Report",
      breadcrumb: [
        {
          text: "Sales Detailed Report",
          active: true,
        },
      ],
    },
  },

  {
    path: "/profitandloss",
    name: "profitandloss",
    component: () => import("@/views/ReportManagement/ProfitAndLossReport.vue"),
    meta: {
      authReuire: true,
      role: ["Super Admin"],
      pageTitle: "Report",
      breadcrumb: [
        {
          text: "Profit And Loss Report",
          active: true,
        },
      ],
    },
  },
];
