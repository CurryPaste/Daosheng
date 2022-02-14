/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
// prefix
export const moduleName = "demoModule" as const;

/** demoModule-state */
export interface State {
  title: string;

  content: string;

  message: string;
}

/** demoModule-getters */
export interface Getters {
  getTitle: () => string;
}

/** demoModule-mutation */
export enum MutationTypes {
  // demoMutation = "demoModule/demoMutation",
  demoMutation = "demoMutation",
}
export type Mutations<S = State> = {
  [MutationTypes.demoMutation](state: S, payload: string): void;
};
