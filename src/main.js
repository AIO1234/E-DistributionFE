import { createApp, devtools } from "vue";
import App from "@/App.vue";
import { registerPlugins } from "@core/utils/plugins";
import commonmixins from "./mixins/commonmixins";
import { store } from "./store";

// Styles
import "@core/scss/template/index.scss";
import "@styles/styles.scss";
import "@/assets/scss/breadcrumb.scss";
import "@/assets/scss/home.scss";
import "@/assets/scss/order_management.scss";
import "@/assets/scss/payment_management.scss";
import "@/assets/scss/return_management.scss";
import "@/assets/scss/masterdata.scss";
import "@/assets/scss/report_management.scss";

document.addEventListener("contextmenu", (event) => event.preventDefault());

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.shiftKey && event.code === "KeyC") {
    event.preventDefault();
  }
  if (event.ctrlKey && event.shiftKey && event.code === "KeyI") {
    event.preventDefault();
  }
  if (event.ctrlKey && event.code === "KeyU") {
    event.preventDefault();
  }
});

// Create vue app
// document.addEventListener("contextmenu", (event) => event.preventDefault());
const app = createApp(App);

app.mixin(commonmixins);
// window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit("vuex:init", {});
// Register plugins
registerPlugins(app);

app.use(store);
// app.use(store);
// Mount vue app
app.mount("#app");
