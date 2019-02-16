import React from 'react'
import Select from 'cf-select'
import { dispatch } from 'store'

export default class Home extends React.PureComponent {
  render() {
    return (
      <div>
        <Select selector={dispatch.count.getCount} />
      </div>
    )
  }
}
