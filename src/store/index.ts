/* eslint-disable no-redeclare */
import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";
import Demo from "./modules/demo";

export interface State {
  count: number;
}
// eslint-disable-next-line symbol-description
export const key: InjectionKey<Store<State>> = Symbol();
const store = createStore<State>({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count += 1;
    },
  },
  actions: {
    increment(context) {
      context.commit("increment");
    },
  },
  modules: {
    moduleDemo: Demo,
  },
});

// declare module "vuex" {
//   export function useStore<S = StoreStateType & ModulesType>(): Store<S>;
// }
type StoreStateType = {
  tttDe: string;
};
type ModulesType = {
  tttttDemo: typeof Demo;
};
// 定义自己的 `useStore` 组合式函数
// export function useStore<S = StoreStateType & ModulesType>(): Store<S>;
export function useStore<S = StoreStateType & ModulesType>(): Store<S> {
  return baseUseStore<S>(key);
}

export default store;
