import { toast } from "@/ApiConstance/toast";

export default {
  init(router, store) {
    router.beforeEach(async (to, _, next) => {
      await store.dispatch("autoLogin");

      const { isLogedIn } = store.getters;
      const { getRole } = store.getters;

      // if autentication alive
      if (
        to.meta.authReuire &&
        isLogedIn &&
        to.meta.role.includes(getRole) === true
      ) {
        return next();
      }
      // if roles are mismatch
      else if (
        to.meta.authReuire &&
        isLogedIn &&
        to.meta.role.includes(getRole) === false
      ) {
        if (
          getRole === "Admin" ||
          getRole === "Staff" ||
          getRole === "Data Operator"
        ) {
          window.location.href = "/factoryorder";
        } else if (getRole === "Area Manager" || getRole === "Distributer") {
          window.location.href = "/distributororder";
        } else if (getRole === "SalesRep") {
          window.location.href = "/salesreporder";
        } else {
          toast("You Dont Have Permissions To Access This", "error");
        }

        return next(false);
      }
      // if not logged in
      else if (to.meta.authReuire && !isLogedIn) {
        return next({
          path: "/",
          replace: true,
        });
      }
      //if logged in but auth required
      else if (!to.meta.authReuire && isLogedIn) {
        return next({
          path: "/factoryorder",
          replace: true,
        });
      }
      // if not authenticated
      else {
        return next();
      }
    });
  },
};
