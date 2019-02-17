export default {
  state: {},
  reducers: {
    setUser(state, payload) {
      return payload
    },
  },
  actions: ({ dispatch, getState }) => ({
    getId() {
      return getState().user.id
    },
  }),
}
