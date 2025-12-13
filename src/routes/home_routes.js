export default [
  {
    path: "/dashboard",
    name: "home",
    component: () => import("@/views/Home/index.vue"),
    meta: {
      authReuire: true,
      role: ["Super Admin"],
      pageTitle: "Dashboard",
      breadcrumb: [
        {
          text: "Dashboard",
          active: true,
        },
      ],
    },
  },
];
