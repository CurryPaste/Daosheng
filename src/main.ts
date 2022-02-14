import { createApp } from "vue";
import App from "./App.vue";
// eslint-disable-next-line import/no-unresolved
import "virtual:windi.css";
import router from "./router";
import { setupHttp } from "./lib/http";
import store from "./store";

setupHttp();
createApp(App).use(store).use(router).mount("#app");
