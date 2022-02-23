# typescript在vue和vuex中的高级应用方式

### 单仓库
- 正常的创建流程
- 正常使用方式的弊端（代码提示、函数名约束、类型限制）
- 如何封装带类型提示的vuex
- 封装后的使用方式与好处

### module仓库
- 先定义 user 模块的state，同时暴露 `user`模块的state类型 `TState`
#### 开始改造`getters`
- `vuex`提供了`GetterTree`类型，第一个是当前state，第二个是rootState，也就是根节点（[问就是官网文档写的](https://vuex.vuejs.org/zh/api/#getters)）

- 对于 user 模块来讲，TState就是 `GetterTree`的state，那么开始处理rootState
- rootState 也就是 `index.ts`里store的类型，包含了两个模块，对应两个命名空间名称，这里统一定义一下模块名称 `moduleName`
- 回到 user 模块，在getters中编写一个函数，会发现 `state` 和 `rootState` 都有了代码类型提示，但是getter并没有，点击vuex的声明文件，会发现 `Getter` 类型，第1、3参数类型是 `State` 和 `RootState`，但是2、4参数类型是`any`，开始手动改造 `Getter`
- 新增 `GettersTypes` 对象，用于明确枚举 `getters` 的key，新增 `TGetters` 类型用于覆盖 `GetterTree`
- 主要看用于定义 `getters` 的类型 `GettersReturnType<TGetters, key>` ，用于获取 `getters` 的返回类型
- - `Exclude` 用于将 `K` 从联合类型 `keyof T` 里排除出去，下面是例子
- - > ts
type TGettersReturnType<T, K extends keyof T> = {
  [key in Exclude<keyof T, K>]: string;
}
interface Tobj {a:number, b:string}
type a = TGettersReturnType<Tobj, 'a'|'b'>
- - 关于 `TGettersPayload` 是基于原博客的方式二次改动后的产物，查询锚点 `te: TState, getters: GettersReturnType<TGetters, key>, rootState: TRootSt`
- 然后看 `TRootGetters`，也就是全局 `getters`，其 `key` 就是模块 `getters` 的命名空间 + `key` ，值还是模块 `getters` 对应的值，利用 模板字符串，将命名空间与 `getters` 的 `key` 进行组合，得到 `TRootGetters` 的 `key`
- 至此 `getters` 也就有了类型提示了
> 原作者的话
> 
> - `GettersTypes` 设计成一个 `js`对象而不是 `enum` ，首先是考虑到这里并不是一个枚举的适用场景，其次是为了明确 `getter` 的 `key` ，以及 `key` 对应的方法及其返回值，如果使用 `enum` ，会因为类型模糊导致丢失 `key` 与 对应的方法及其返回值之间的联系丢失
> - `GettersTypes` 必须使用 `as const` 进行修饰 —— getters麻，只读
> - `Extract<key, string>`写法是由于 `TypeScript` 存在的一个 [feature](https://github.com/Microsoft/TypeScript/issues/25260)
> - `[key in keyof T as ${TModuleName}/${Extract<key, string>}]` 的写法可见于 [ Key Remapping in Mapped Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#key-remapping-in-mapped-types)

#### 改造mutations
- 先去 `vuex` 里看下有没有定义好的类型，发现有个叫 `ActionTree`，先写上去
- 因为 `mutations` 的 `key` 类型是 `string` ，所以也是没法直接 `点` 出来的，需要手动再写个类型进行覆盖，为了明确 `mutation` 的 `key` ，还是和 `getters` 一样，先定义好对应的枚举对象 `MutationTypes`
- 然后在 `user` 中，覆盖 `MutationsTree` ， 并测试代码提示 (`state` `payload`)
- 只是更改值，还是比较简单的

#### 改造Actions
- 还是先定义枚举对象 `ActionTypes`，然后再找到预先定义好的类型，加上去
- 最后照例写个类型 `TActions` 进行覆盖
- 此时 `context` 还是一个 `any` 类型，从 `vuex` 的类型中，`context` 应该有5个属性 `ActionContext`
- `state` 、`getters` 、`rootState` 、`rootGetters` 的类型都已经确定了，至于 `dispatch` 和 `commit` ，类型签名的 `key` 都是 `string` ，所以 `点` 不出来，需要对着这两个进行改造
- 看 type `TActionContext`
- 给 `context` 定义了类型 `TUserActionContext` ，底层是 `TActionContext` ， `TActionContext` 依旧借助了 `vuex` 提供的类型 `ActionContext` 的能力，沿用对 `state` 、 `rootState` 类型的支持，需要手动重写的是 `dispatch` 、 `commit` 、 `getters` 、 `rootGetters`  ，那么使用 `Omit` 将这几个类型挑出来另行定义
- 由于可以在 `module` 之间相互调用 `dispatch` 、 `commit` ，所以给 `TCommit` 、 `TDispatch` 传入第三个参数用于标识是位于当前模块内还是位于其他模块或者全局环境内，主要用于决定是否添加模块命名空间，例如 `user/updateName`
- 下面的 `TCommit` 和 `TDispatch` 过会解释，先当成 {commit: Function} 理解
- `commit` 依赖于 `mutation` ，所以给 `TCommit` 再传入 `TMutations` 、 `TRootMutations` ；同理，给 `TDispatch` 传入 `TActions` 、 `TRootActions`
- 和 `TRootState` 、 `TRootActions` 类似，`TRootMutations` 、 `TRootActions` 也即是所有 `module` 下 `mutaions` 和 `actions` 的集合
- 这个时候就把 `index` 中的 `Root` 关系处理完毕了
- getters & rootGetters
- 覆盖原有的 `getters` ，主要就是给明确定义属性的 `key` ，以及 `key` 对应的类型，即 `getter` 的类型
- `rootGetters` 即是在全局范围内可访问的 `getters` ，带有命名空间

TCommit
```ts
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
```
> - commit 是一个方法，接收三个参数，最后一个参数 options 依旧是使用 vuex 提供的，返回值固定是 void
> - commit 第一个参数为提交的 type ，存在两种情况，在 `module` 内部使用（`UseInGlobal 为 false`）和在其他module或者全局使用（`UseInGlobal 为 true`）,前者的type不需要命名空间前缀，而后者需要，所以使用 UseInGlobal 区分开这两种情况，方便后续判断
> - `TRootMutations` 是所有 module 下 `mutations` 总的集合，所以需要借助 `FlatRootObj` 进行拍平 `看代码`
> - `FlatRootObj` 拍平之后的结果是一个联合类型，拍平出来的对象的 `key` 已经添加了命名空间，但这是一个联合类型，我们希望结果是一个交叉类型，所以再借助 `UnionToIntersection` 将联合类型转为交叉类型
> - 逻辑比较饶，大概解释下 `FlatRootObj` 和 `UnionToIntersection` 所起的作用
```ts
type A = { q: 1; w: '2' }
type B = { e: []; r: true; }
type C = { a: A; b: B; }

type D = FlatRootObj<C>
// => { "a/q": 1; "a/w": '2'; } | { "b/e": []; "b/r": true; }
type E = UnionToIntersection<D>
// => { "a/q": 1; "a/w": '2'; } & { "b/e": []; "b/r": true; }
// 也即 { "a/q": 1; "a/w": '2'; "b/e": []; "b/r": true; }
```
> - commit 第二个参数 payload 是提交的值，也就是 `TMutations` 类型方法签名的第一个参数，借助 Parameters 内置方法可以取出函数的参数
> - 
TDispatch
> - 其实和 `TCommit` 差不多，只不过它们的数据来源不一样，并且 `dispatch` 返回的是一个 `Promise`

#### 处理 TRootStore
- `export type TRootStore = TUserStore & TOtherStore`

#### 编写 User store
- 借助了 `TStore` 类型，接收四个参数，分别是当前 module 的 TState、TCommit、TDispatch 以及 getters
- 最后一个 getters 额外处理了一下，因为在全局调用 `getters` 的时候，肯定需要加命名空间的，所以这里使用模板字符串先把 `moduleName` 给拼接上
- 看 TStore 实现
- 借助了 vuex 提供好的类型 VuexStore，然后因为 commit、dispatch、getters 是自定义的，所以把这三个剔除出来，换成自己定义的 TCommit、TDispatch、TGetters

#### 重写 useStore
```ts
export const key: InjectionKey<VuexStore<TRootState>> = Symbol("storeModule");

/** 模块vuex-useStore */
export const useStoreModule = (): TRootStore => baseUseStore(key);
```


> [参考链接](http://soiiy.com/Vue-js/16443)


### 基础内容
- keyof 获得类型的key——得到的是联合类型
```ts
interface Itest {
  a: string;
  b: number;
}
const a: keyof Itest = 'a'
```

- 索引查询
```ts
T[K] // 表示对象T的属性K所代表的类型
```
- never [参见](https://jkchao.github.io/typescript-book-chinese/typings/neverType.html#%E7%94%A8%E4%BE%8B%EF%BC%9A%E8%AF%A6%E7%BB%86%E7%9A%84%E6%A3%80%E6%9F%A5)

### extends
- 类型约束/泛型约束
```ts
type Textends = 'a' | 'b' | 'c';
type Tchild<T extends Textends> = string;
const ta: Tchild<'a'> = '';
// question：结合索引查询，手动实现一个 Pick
```
- 充当IF
```ts
type A<T> = 'a' extends T ? string : number;
type B = A<'b'>
// 如果 'a' 是 'b' 的子集，则 B 为string，否则为number
```
- 与 `in` 的关系
```ts
// in相当于遍历所有字段
// extends只是约束
```