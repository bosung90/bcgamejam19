import { init } from '@rematch/core'
import * as models from './models'
import actions from './actionsPlugin'

const store = init({
  models,
  plugins: [actions],
})

const { dispatch, getState } = store
export { dispatch, getState, store }
