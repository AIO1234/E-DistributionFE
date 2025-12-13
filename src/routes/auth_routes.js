export default [
  {
    path: "/",
    name: "login",
    component: () => import("@/views/login.vue"),
    meta: {
      layout: "blank",
      authReuire: false,
    },
  },

  {
    path: "/users",
    name: "users",
    component: () => import("@/views/UserManagement/index.vue"),
    meta: {
      authReuire: true,
      role: ["Super Admin"],
      pageTitle: "Users",
      breadcrumb: [
        {
          text: "All Users",
          active: true,
        },
      ],
    },
  },
];
