import { createApp } from "vue";
import App from "./App.vue";
// eslint-disable-next-line import/no-unresolved
import "virtual:windi.css";
import router from "./router";
import { setupHttp } from "./lib/http";
import { store as singleStore, key as singleKey } from "./store/singleStore";
import { store as moduleStore, key as moduleKey } from "./store/moduleStore";

setupHttp();
createApp(App)
  .use(singleStore, singleKey)
  .use(moduleStore, moduleKey)
  .use(router)
  .mount("#app");
