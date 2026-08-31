import { api } from "../index";
import { store } from "@/store";
import { toast } from "@/ApiConstance/toast";

export default {
  async login(payload) {
    return await api.post("/auth/login", payload).then((res) => {
      // guard against an account that has no role assigned - without this,
      // roles[0] is undefined and the redirect below throws silently,
      // leaving the user stuck on the login page with no feedback
      if (!res.data.data.roles || res.data.data.roles.length === 0) {
        toast(
          "This account has no role assigned. Contact an administrator.",
          "error"
        );
        return;
      }

      const token = res.data.data.token;
      const role = res.data.data.roles[0].name;
      localStorage.setItem("saaiortn__tyunnunmkkqw", token);
      store.commit("SET_CURRENT_USER_NAME", res.data.data.data.name);
      store.commit("SET_LOGGED_ROLE", role);
      store.commit("SET_CURRENT_USER_TOKEN", token);

      //  based on the logged role , redirect te user to system
      if (
        role === "Super Admin" ||
        role === "Admin" ||
        role === "Staff" ||
        role === "Data Operator"
      ) {
        window.location.href = "/factoryorder";
      } else if (role === "Area Manager" || role === "Distributer") {
        // set distrubter id of the logged user

        if (res.data.data.data.distributer_id !== null) {
          store.commit(
            "SET_CURRENT_DISTRIBUTER_Id",
            res.data.data.data.distributer_id
          );
        }
        window.location.href = "/distributororder";
      }
      // if sales rep loggedin
      else if (role === "SalesRep") {
        if (res.data.data.data.salesrep_id !== null) {
          store.commit(
            "SET_CURRENT_SALESREP_Id",
            res.data.data.data.salesrep_id
          );
        }
        window.location.href = "/salesreporder";
      }
    });
  },
  async profile() {
    return await api.get("/auth/profile");
  },
  async logout() {
    return await api.post("/auth/logout");
  },
};
