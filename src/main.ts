import { createApp } from "vue";
import App from "./App.vue";
// eslint-disable-next-line import/no-unresolved
import "virtual:windi.css";
import router from "./router";
import { setupHttp } from "./lib/http";
import store, { key } from "./store";

setupHttp();
createApp(App).use(store, key).use(router).mount("#app");
