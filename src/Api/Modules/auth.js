import { api } from "../index";
import { store } from "@/store";

export default {
  async login(payload) {
    return await api.post("/auth/login", payload).then((res) => {
      const token = res.data.data.token;
      const role = res.data.data.roles[0].name;
      localStorage.setItem("saaiortn__tyunnunmkkqw", token);
      store.commit("SET_CURRENT_USER_NAME", res.data.data.data.name);
      store.commit("SET_LOGGED_ROLE", role);
      store.commit("SET_CURRENT_USER_TOKEN", token);

      //  based on the logged role , redirect te user to system
      if (role === "Super Admin" || role === "Admin" || role === "Staff") {
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
      // if area mamnager or sales rep loggedin
      else if (role === "Area Manager" || role === "SalesRep") {
        window.location.href = "/salesreporder";
      }
      // if sales rep loggedin
      else if (role === "SalesRep") {
        if (res.data.data.data.salesrep_id !== null) {
          store.commit(
            "SET_CURRENT_SALESREP_Id",
            res.data.data.data.salesrep_id
          );
        }
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
