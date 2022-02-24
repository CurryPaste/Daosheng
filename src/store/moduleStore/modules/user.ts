/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/** user模块 */
import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import { TRootActions, TRootGetters, TRootMutations, TRootState } from "..";
import { TCommit, TDispatch, TStore } from "../index.type";
import {
  ActionTypes,
  GettersTypes,
  MutationTypes,
  TActions,
  TGetters,
  TMutations,
  TState,
  userModule,
  moduleName,
} from "./user.type";

const stateData: () => TState = () => ({
  name: "",
  role: "",
  code: "",
  age: 0,
});

/** getters */
const getters: GetterTree<TState, TRootState> & TGetters = {
  [GettersTypes.sayMsg]: (state, getter, rootState, rootGetter) =>
    state.age + rootState.user.name,
  [GettersTypes.getUserAge]: (state, getter, rootState, rootGetter) =>
    `${state.name}:${state.age}`,
  [GettersTypes.get10After]: (state, getter, rootState, rootGetter) =>
    state.age + 10 + +getter.getUserAge,
};

/** mutations */
const mutations: MutationTree<TState> & TMutations = {
  [MutationTypes.updateName](state, payload) {
    console.log(state, "state");
    state.name = payload;
  },
  [MutationTypes.updateRole](state, payload) {
    console.log(payload);
    state.role = payload;
  },
};

/** actions */
const actions: ActionTree<TState, TRootState> & TActions = {
  [ActionTypes.promiseFun](ctx, payload) {
    return new Promise((reject) => {
      console.log(111, payload);
      reject("111");
    });
  },
  [ActionTypes.promiseVoid]() {
    return new Promise((reject) => {
      console.log("this is void");
      reject();
    });
  },
};

export type TUserStore = TStore<
  { [userModule]: TState },
  TCommit<TMutations, TRootMutations, true>,
  TDispatch<TActions, TRootActions, true>,
  {
    [key in keyof TGetters as `${moduleName}/${key}`]: ReturnType<
      TGetters[key]
    >;
  }
>;

export const store: Module<TState, TRootState> = {
  namespaced: true,
  state: stateData,
  getters,
  actions,
  mutations,
} as const;
