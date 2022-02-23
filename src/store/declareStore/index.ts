import { createStore, Store, useStore as useVuex } from "vuex";

interface IuserData {
  userName: string;
  age: number;
}
const user = {
  state: {
    userName: "",
    age: 11,
  },
  action: {
    updateAge(stateData: IuserData, payload: number) {
      stateData.age = payload;
    },
  },
};

const store = createStore({
  state: {
    config: "findsoft",
    name: "name",
  },
  mutations: {},
  actions: {},
  modules: {
    user,
  },
});

declare module "vuex" {
  type StoreStateType = typeof store.state;
  type ModulesType = {
    user: typeof user.state;
  };
  export function useStore<S = StoreStateType & ModulesType>(): Store<S>;
}

const testA = useVuex();
console.log(testA, "testA");

export default store;
