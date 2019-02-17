import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import * as pages from 'pages'

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={pages.Home} />
        <Route path="/login" exact component={pages.Login} />
      </Switch>
    </Router>
  )
}
