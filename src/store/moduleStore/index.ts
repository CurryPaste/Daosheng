import { InjectionKey } from "vue";
import { Store as VuexStore, useStore as baseUseStore } from "vuex";
import {
  TState as TUserState,
  userModule,
  TGetters as TUserGetters,
  TActions,
  TMutations,
} from "./modules/user.type";
import { RootGettersReturnType } from "./index.type";
import { TUserStore } from "./modules/user";

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

/** 模块vuex-useStore */
export const useStoreModule = (): TRootStore => baseUseStore(key);
