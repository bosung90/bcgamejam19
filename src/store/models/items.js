export default {
  state: {},
  reducers: {
    setItems(state, payload) {
      return payload
    },
  },
  actions: ({ dispatch, getState }) => ({
    getItems(type) {
      if (!type) {
        return getState().items
      } else {
        return Object.values(getState().items).reduce((prev, cur) => {
          if (cur.type === type) {
            prev[cur.id] = cur
          }
          return prev
        }, {})
      }
    },
  }),
}
