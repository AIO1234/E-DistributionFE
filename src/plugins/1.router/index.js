import { setupLayouts } from "virtual:generated-layouts";
import { createRouter, createWebHistory } from "vue-router/auto";
import home_routes from "@/routes/home_routes";
import order_routes from "@/routes/order_management";
import payments_routes from "@/routes/payment_management";
import return_routes from "@/routes/return_management";
import masterdata_routes from "@/routes/masterdata_route";
import auth_routes from "@/routes/auth_routes";
import auth_controller from "./auth_controller";
import report_controller from "@/routes/report_routes";

import { store } from "@/store";

function recursiveLayouts(route) {
  if (route.children) {
    for (let i = 0; i < route.children.length; i++)
      route.children[i] = recursiveLayouts(route.children[i]);

    return route;
  }

  return setupLayouts([route])[0];
}

const routes = [
  ...home_routes,
  ...masterdata_routes,
  ...order_routes,
  ...payments_routes,
  ...return_routes,
  ...auth_routes,
  ...report_controller,
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: "smooth", top: 60 };

    return { top: 0 };
  },
  extendRoutes: (pages) => [
    ...[...pages, ...routes].map((route) => recursiveLayouts(route)),
  ],
});

auth_controller.init(router, store);

export { router };
export default function (app) {
  app.use(router);
}
