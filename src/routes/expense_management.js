export default [
  {
    path: "/expenses",
    name: "expenses",
    component: () => import("@/views/ExpenseManagement/index.vue"),
    meta: {
      authReuire: true,
      role: ["Super Admin", "Admin", "Accountant"],
      pageTitle: "Expense Management",
      breadcrumb: [
        {
          text: "Expense Management",
          active: true,
        },
      ],
    },
  },
]
