/* eslint-disable no-unused-vars */
import { ActionContext, ActionTree } from "vuex";
import MutationTypes from "../mutations/mutation-types";
import { Mutations } from "../mutations/mutations";
import ActionTypes from "./action-types";
import { State } from "../states";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1],
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, State>, "commit">;

export interface Actions {
  [ActionTypes.GET_API_INFO](
    { commit }: AugmentedActionContext,
    payload: string,
  ): Promise<void>;
}

export const actions: ActionTree<State, State> & Actions = {
  [ActionTypes.GET_API_INFO]({ commit }) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        commit(MutationTypes.SET_TITLE, "apiapiapi");
        resolve();
      });
    });
  },
};
