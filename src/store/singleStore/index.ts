/* eslint-disable no-unused-vars */
/* eslint-disable max-classes-per-file */
import { InjectionKey } from "vue";
import {
  CommitOptions,
  createStore,
  DispatchOptions,
  Store as VuexStore,
} from "vuex";
import { Getters, getters } from "./getters/getters";
import { Mutations, mutations } from "./mutations/mutations";
import { State, state } from "./states";
import { Actions, actions } from "./actions/actions";

/** 单仓库vuex */
export const store = createStore({
  state,
  getters,
  mutations,
  actions,
  modules: {},
});

export type Store = Omit<
  VuexStore<State>,
  "getters" | "commit" | "dispatch"
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions,
  ): ReturnType<Mutations[K]>;
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload: Parameters<Actions[K]>[1],
    options?: DispatchOptions,
  ): ReturnType<Actions[K]>;
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
};
export const key: InjectionKey<Store> = Symbol("store");
export const useStoreSingle = (): Store => store as Store;
