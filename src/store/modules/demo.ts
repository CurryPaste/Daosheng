/* eslint-disable max-classes-per-file */
import { ActionTree, MutationTree, StoreOptions } from "vuex";
import { Mutations, MutationTypes, State as StateType } from "./demoType";

class State implements StateType {
  title = "当你用vuex前";

  content = "先考虑，是否真的能用到vuex";

  message = "如果非要用，又要怎么设计仓库";
}
class Demo implements StoreOptions<State> {
  namespaced = true;

  state = new State();

  getter = {
    // createNamespacedHelpers
    getTitle: (state: State) => (): string => {
      console.log(state, " this is getters");
      return `想要标题是吧，给你妥了：${state.message}`;
    },
  };

  mutations: MutationTree<State> & Mutations = {
    [MutationTypes.demoMutation](state, payload) {
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
