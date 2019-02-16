export default {
  state: 0,
  reducers: {
    increment(state, payload) {
      return state + 1
    },
  },
  actions: ({ dispatch, getState }) => ({
    getCount() {
      return getState().count
    },
  }),
}
