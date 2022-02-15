import { InjectionKey } from "vue";
import { Store as VuexStore, createStore } from "vuex";

export const state = { test22: 111, test11: "sss" };
type TState = typeof state;
/** 模块vuex */
export const store = createStore({
  state,
});
export const key: InjectionKey<VuexStore<TState>> = Symbol("storeModule");

/** 模块vuex-useStore */
export const useStoreModule = (): VuexStore<TState> => store;
