/** 仓库选择
 *
 * 按照需要使用不同的仓库吧，虽然可以同时引入两个仓库（Symbol）但使用的时候还是有歧义
 *
 * @singleStore 单仓库
 * 实现方式：enum —— 每个代码提示都依赖枚举
 * 使用方式：根据需要引入Type枚举
 * 优点：用了枚举，如果定义时有备注，则在调用时会显示枚举的备注；ctrl可以调转到vuex-type的类型定义上
 * 缺点：（暂时没办法模块化）
 * @moduleStore
 * 实现方式：Object —— 对象键值对；类型约束；
 * 使用方式：getters、commit、dispath后直接就有带有模块的代码提示
 * 优点：不需要引入额外的类型或变量
 * 缺点：没法ctrl跳转对应模块
 */

export { useStoreModule } from "./moduleStore";

export { useStoreSingle as useStore } from "./singleStore";

export default {};
