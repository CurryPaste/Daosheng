import { MutationTree } from "vuex";
import MutationTypes from "./mutation-types";
import { State } from "../states";
/* eslint-disable no-unused-vars */

export type Mutations<S = State> = {
  [MutationTypes.SET_TITLE](state: S, payload: string): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_TITLE](state, payload) {
    state.title = payload;
  },
};
