/* eslint-disable no-unused-vars */
import { GetterTree } from "vuex";
import { State } from "../states";

export type Getters = {
  getTitle(state: State): string;
  getTitle2(state: State): string;
};

export const getters: GetterTree<State, State> & Getters = {
  getTitle: (state) => state.title,
  getTitle2: (state) => state.title2,
};
