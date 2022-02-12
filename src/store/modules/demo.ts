/* eslint-disable max-classes-per-file */
import { ActionTree, MutationTree, StoreOptions } from "vuex";

class State {
  title = "当你用vuex前";

  content = "先考虑，是否真的要用到vuex";

  message = "如果非要用，又要怎么设计数据类型";
}
class Demo implements StoreOptions<State> {
  namespaced = true;

  state = new State();

  getter = {
    // createNamespacedHelpers
    getTitle: (state: State) => () => {
      console.log(state, " this is getters");
      return `想要标题是吧，给你妥了：${state.message}`;
    },
  };

  mutations: MutationTree<State> = {
    demoMutation(state, payload) {
      console.log(payload, "payload");
      state.title += "payload-";
    },
  };

  actions: ActionTree<State, unknown> = {
    demoAction(context, payload) {
      context.commit("demoMutation", "this is demoAction", payload);
      console.log(context.rootGetters, context.rootState, "this is 根节点");
    },
  };
}

export default new Demo();
