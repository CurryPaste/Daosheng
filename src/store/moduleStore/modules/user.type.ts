/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
/**
 * user模块类型
 */

import { TRootActions, TRootGetters, TRootMutations, TRootState } from "..";
import { GettersReturnType, TActionContext } from "../index.type";

/** user模块 命名空间名称 */
export const userModule = "user" as const;
export type moduleName = typeof userModule;

export type TUserRole = "student" | "teacher" | "admin" | "";

export type TState = {
  /** 用户名 */
  name: string;
  /** code */
  code: string;
  /** role */
  role: TUserRole;
  /** age */
  age: number;
};

/** getters */

/** 枚举对象 */
export const GettersTypes = {
  sayMsg: "sayMsg",
  getUserAge: "getUserAge",
  get10After: "get10After",
} as const;
/** 原作者的类型，优化后不需要了 */
export type ValueGettersTypes = typeof GettersTypes[keyof typeof GettersTypes];
/** getters函数payload参数元组 */
type TGettersPayload<key extends keyof TGetters> = [
  state: TState,
  getters: GettersReturnType<TGetters, key>,
  rootState: TRootState,
  rootGetters: TRootGetters,
];
export type TGetters = Readonly<{
  // readonly [key in ValueGettersTypes]: (state: TState, getters: GettersReturnType<TGetters, key>, rootState: TRootState, rootGetters: TRootGetters) => string
  [GettersTypes.sayMsg]: (
    state: TState,
    getters: GettersReturnType<TGetters, typeof GettersTypes.sayMsg>, // question：为什么要用 GettersReturnType 剔除。answer：这里是为了获得到除了自己以外的其他getters
    rootState: TRootState,
    rootGetters: TRootGetters,
  ) => string;
  [GettersTypes.getUserAge]: (
    ...arg: TGettersPayload<typeof GettersTypes.getUserAge>
  ) => string;
  [GettersTypes.get10After]: (
    ...arg: TGettersPayload<typeof GettersTypes.get10After>
  ) => number;
}>;

/** mutations */
export const MutationTypes = {
  updateName: "updateName",
  updateRole: "updateRole",
} as const;
export type TMutations = {
  [MutationTypes.updateName](state: TState, payload: string): void;
  [MutationTypes.updateRole](state: TState, payload: TUserRole): void;
};

/** actions */
export const ActionTypes = {
  promiseFun: "promiseFun",
  promiseVoid: "promiseVoid",
} as const;

type TUserActionContext = TActionContext<
  TState,
  TRootState,
  TActions,
  TRootActions,
  TMutations,
  TRootMutations,
  TGetters,
  TRootGetters
>;

export type TActions = {
  [ActionTypes.promiseFun](
    context: TUserActionContext,
    payload: string,
  ): Promise<string>;
  [ActionTypes.promiseVoid](
    context: TUserActionContext,
    payload: number,
  ): Promise<void>;
};
