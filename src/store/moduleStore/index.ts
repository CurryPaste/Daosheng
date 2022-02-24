import { InjectionKey } from "vue";
import {
  createLogger,
  createStore,
  Store as VuexStore,
  useStore as baseUseStore,
} from "vuex";
import {
  TState as TUserState,
  userModule,
  TGetters as TUserGetters,
  TActions,
  TMutations,
} from "./modules/user.type";
import { RootGettersReturnType } from "./index.type";
import { TUserStore, store as userStore } from "./modules/user";

const debug = process.env.NODE_ENV !== "production";

export type TRootState = {
  [userModule]: TUserState;
};
export type TRootGetters = RootGettersReturnType<
  TUserGetters,
  typeof userModule
>;
export type TRootActions = {
  [userModule]: TActions;
};
export type TRootMutations = {
  [userModule]: TMutations;
};
export type TRootStore = TUserStore;

export const key: InjectionKey<VuexStore<TRootState>> = Symbol("storeModule");

export const store = createStore({
  modules: {
    [userModule]: userStore,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});

/** 模块vuex-useStore */
export const useStoreModule = (): TRootStore => baseUseStore(key);
