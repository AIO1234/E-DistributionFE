import profile from "@/Api/Modules/auth";

export default {
  state: {
    current_user_profile: null,
    current_user_data: null,
    current_user_token: null,
    current_user_name: null,
    logged_distributer_id: null,
    logged_salesrep_id: null,
    current_user_permission: null,
    logged_role: null,
    selected_distributer_id: null,
    selected_salesrep_id: null,
    selected_shop_id: null,
    selected_return_shop_id: null,
    selected_return_shop_name: null,
  },
  mutations: {
    CLEAR_CURRENT_USER: (state) => {
      state.current_user_data = undefined;
      state.current_user_permission = undefined;
      state.logged_role = undefined;
      state.current_user_token = undefined;
      localStorage.removeItem("saaiortn__tyunnunmkkqw");
    },

    SET_CURRENT_USER_PERMISSION: (state, value) => {
      state.current_user_permission = value;
    },

    SET_LOGGED_ROLE: (state, value) => {
      state.logged_role = value;
    },

    SET_CURRENT_USER: (state, value) => {
      state.current_user_data = value;
    },

    SET_CURRENT_USER_TOKEN: (state, value) => {
      state.current_user_token = value;
    },

    SET_CURRENT_USER_NAME: (state, value) => {
      state.current_user_name = value;
    },

    SET_CURRENT_DISTRIBUTER_Id: (state, value) => {
      state.logged_distributer_id = value;
    },

    SET_CURRENT_SALESREP_Id: (state, value) => {
      state.logged_salesrep_id = value;
    },

    SET_CURRENT_USER_PROFILE: (state, value) => {
      state.current_user_profile = value;
    },
    UPDATE_USER_INFO: (state, { displayName, photoURL }) => {
      state.current_user_data.user.name = displayName;
      state.current_user_data.user.image = photoURL;
    },

    SET_SELECTED_DISTRIBUTER_ID: (state, value) => {
      state.selected_distributer_id = value;
    },

    SET_SELECTED_SALESREP_ID: (state, value) => {
      state.selected_salesrep_id = value;
    },

    SET_SELECTED_SHOP_ID: (state, value) => {
      state.selected_shop_id = value;
    },

    SET_SELECTED_RETURN_SHOP_ID: (state, value) => {
      state.selected_return_shop_id = value;
    },

    SET_SELECTED_RETURN_SHOP_NAME: (state, value) => {
      state.selected_return_shop_name = value;
    },
  },
  getters: {
    isLogedIn: (state) =>
      state.logged_role !== null && state.current_user_name !== null,

    getRole: (state) => state.logged_role,

    getToken: (state) => state.current_user_token,

    getUserName: (state) => state.current_user_name,

    getLoggedDistributer: (state) => state.logged_distributer_id,

    getLoggedSaleRep: (state) => state.logged_salesrep_id,

    getSelectedDistributerId: (state) => state.selected_distributer_id,

    getSelectedSalesRepId: (state) => state.selected_salesrep_id,

    getSelectedShopId: (state) => state.selected_shop_id,

    getSelectedReturnShopId: (state) => state.selected_return_shop_id,

    getSelectedReturnShopName: (state) => state.selected_return_shop_name,
  },
  actions: {
    setCurrentUser: ({ commit }, payload) => {
      commit("SET_CURRENT_USER", payload);
    },
    // eslint-disable-next-line no-unused-vars
    async afterLogin({ commit }, fromLogin) {
      if (!fromLogin) {
        router.replace("/");
      }
    },
    // async profile({ commit }) {
    //   const profileData = (await profile.profile()).data.data;
    //   commit("SET_CURRENT_USER_PROFILE", profileData);
    //   return profileData;
    //   // await this.dispatch('afterLogin')
    // },
    async autoLogin({ commit, getters }) {
      try {
        const cacheUserToken = localStorage.getItem("saaiortn__tyunnunmkkqw");

        if (cacheUserToken) {
          if (!getters.getRole || !getters.getUserName || !getters.getToken) {
            const res = await profile.profile();

            if (
              res.data.data.roles[0].name === "Area Manager" ||
              res.data.data.roles[0].name === "Distributer"
            ) {
              commit(
                "SET_CURRENT_DISTRIBUTER_Id",
                res.data.data.user.distributer_id
              );
            } else if (res.data.data.roles[0].name === "SalesRep") {
              commit("SET_CURRENT_SALESREP_Id", res.data.data.user.salesrep_id);
            }
            commit("SET_CURRENT_USER_NAME", res.data.data.user.name);
            commit("SET_LOGGED_ROLE", res.data.data.roles[0].name);
            commit("SET_CURRENT_USER_TOKEN", cacheUserToken);
          }
          if (
            getters.getToken &&
            cacheUserToken &&
            getters.getToken !== cacheUserToken
          ) {
            await this.dispatch("logout");
          }
          // commit('UPDATE_USER_INFO', {
          //   displayName: cacheUserData.name,
          // })
          // await this.dispatch("afterLogin", true);
        }
      } catch (e) {
        // console.log(e)
        await this.dispatch("logout");
      }
    },
    // async login({ commit }, payload) {
    //   const loginData = (await profile.login(payload)).data.data;

    //   // await this.dispatch('afterLogin')
    // },

    // logout
    async logout({ commit }) {
      try {
        await profile.logout();
      } catch (error) {
        await commit("CLEAR_CURRENT_USER");
      }
      await commit("CLEAR_CURRENT_USER");
      window.location.href = "/";
    },

    async updateCurrentUserPhotoUrl({ commit }, newUrl) {
      commit("UPDATE_USER_INFO", {
        photoURL: newUrl,
      });
    },
  },
};
