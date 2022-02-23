/* eslint-disable no-unused-vars */

import {
  ActionContext,
  CommitOptions,
  DispatchOptions,
  Store as VuexStore,
} from "vuex";

/**
 * Exclude 的作用是从 T 中找出 U 中没有的元素, 换种更加贴近语义的说法其实就是从T 中排除 U
 * Extract 的作用是提取出 T 包含在 U 中的元素, 换种更加贴近语义的说法就是从 T 中提取出 U
 */

/**
 * 获得getters返回类型
 * question：为什么这里要用extends判断，而不是直接使用returnType获得函数返回类型？
 */
export type GettersReturnType<T, K extends keyof T> = {
  [key in Exclude<keyof T, K>]: T[key] extends (...args: any) => any
    ? ReturnType<T[key]>
    : never;
};

/**
 * 获得rootGetters返回类型
 */
export type RootGettersReturnType<
  T extends Record<string, any>,
  TModuleName extends string,
> = {
  readonly [key in keyof T as `${TModuleName}/${Extract<
    key,
    string
  >}`]: T[key] extends (...args: any) => any ? ReturnType<T[key]> : never;
};

/** 对象-键值对，对函数 */
type TObjFn = Record<string, (...arg: any) => any>;

type FlatRootObj<T extends Record<string, TObjFn>> = T extends Record<
  infer U,
  TObjFn
>
  ? U extends keyof T
    ? {
        [key in keyof T[U] as `${Extract<U, string>}/${Extract<
          key,
          string
        >}`]: T[U][key];
      }
    : never
  : never;
type UnionToIntersection<U extends TObjFn> = (
  U extends TObjFn ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

type A = { q: () => void; w: () => string };
type B = { e: () => string[]; r: () => true };
type C = { a: A; b: B };

type D = FlatRootObj<C>;
// => { "a/q": 1; "a/w": '2'; } | { "b/e": []; "b/r": true; }
type E = UnionToIntersection<D>;
// => { "a/q": 1; "a/w": '2'; } & { "b/e": []; "b/r": true; }
// 也即 { "a/q": 1; "a/w": '2'; "b/e": []; "b/r": true; }

export type TCommit<
  TMutations extends TObjFn,
  TRootMutations extends Record<string, TObjFn>,
  UseInGlobal extends boolean,
> = {
  commit<
    M = UseInGlobal extends true
      ? UnionToIntersection<FlatRootObj<TRootMutations>>
      : UnionToIntersection<FlatRootObj<TRootMutations>> & TMutations,
    K extends keyof M = keyof M,
  >(
    key: K,
    payload: Parameters<Extract<M[K], (...arg: any) => any>>[1],
    options?: CommitOptions,
  ): void;
};
// Extract<M[K], (...arg: any) => any> 此时代表 从函数类型中，获取拿出 M[K] 的函数

export type TDispatch<
  TActions extends TObjFn,
  TRootActions extends Record<string, TObjFn>,
  UseInGlobal extends boolean,
> = {
  dispatch<
    M = UseInGlobal extends true
      ? UnionToIntersection<FlatRootObj<TRootActions>>
      : UnionToIntersection<FlatRootObj<TRootActions>> & TActions,
    K extends keyof M = keyof M,
  >(
    key: K,
    payload: Parameters<Extract<M[K], (...args: any) => any>>[1],
    options?: DispatchOptions,
  ): Promise<ReturnType<Extract<M[K], (...args: any) => any>>>;
};

/**
 *
 * question：这里为什么只处理四个属性
 */
export type TActionContext<
  TState,
  TRootState,
  TActions extends TObjFn,
  TRootActions extends Record<string, TObjFn>,
  TMutations extends TObjFn,
  TRootMutations extends Record<string, TObjFn>,
  TGetters extends TObjFn,
  TRootGetters extends Record<string, any>,
> = Omit<
  ActionContext<TState, TRootState>,
  "commit" | "dispatch" | "getters" | "rootGetters"
> &
  TCommit<TMutations, TRootMutations, false> &
  TDispatch<TActions, TRootActions, false> & {
    getters: {
      [key in keyof TGetters]: ReturnType<TGetters[key]>;
    };
  } & {
    rootGetters: TRootGetters;
  };

/**
 * Store
 * question：为什么这里是 TState extends Record<string, any>
 */
export type TStore<
  TState extends Record<string, any>,
  TICommit extends {
    commit(
      type: string,
      payload?: any,
      options?: CommitOptions | undefined,
    ): void;
  },
  TIDispatch extends {
    dispatch(
      type: string,
      payload?: any,
      options?: DispatchOptions | undefined,
    ): Promise<any>;
  },
  TGetters,
> = Omit<VuexStore<TState>, "commit" | "dispatch" | "getters"> &
  TICommit &
  TIDispatch & { getters: TGetters };
