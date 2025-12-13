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
        next();
        return next();
      }
      // if roles are mismatch
      else if (
        to.meta.authReuire &&
        isLogedIn &&
        to.meta.role.includes(getRole) === false
      ) {
        if (getRole === "Admin" || getRole === "Staff") {
          window.location.href = "/factoryorder";
        } else if (getRole === "Area Manager" || getRole === "Distributer") {
          window.location.href = "/distributororder";
        } else if (getRole === "Area Manager" || getRole === "SalesRep") {
          window.location.href = "/salesreporder";
        } else {
          toast("You Dont Have Permissions To Access This", "error");
        }

        return next(false);
      }
      // if not logged in
      else if (to.meta.authReuire && !isLogedIn) {
        next({
          path: "/",
          replace: true,
        });
        return next();
      }
      //if logged in but auth required
      else if (!to.meta.authReuire && isLogedIn) {
        next({
          path: "/factoryorder",
          replace: true,
        });
        return next();
      }
      // if not authenticated
      else {
        return next();
      }
    });
  },
};
