export default {
  state: {},
  reducers: {
    setItems(state, payload) {
      return payload
    },
  },
  actions: ({ dispatch, getState }) => ({
    getItems() {
      return getState().items
    },
  }),
}
