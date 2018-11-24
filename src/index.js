import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import store, { history } from './redux/store'
import { Route, Switch } from 'react-router'
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import App from './App'

import './index.css'

const target = document.querySelector('#root')


render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Switch>
          <Route exact path="/" render={() => (<div>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <App />
            </MuiPickersUtilsProvider>

          </div>)} />
          <Route render={() => (<div>404 - Not Found</div>)} />
        </Switch>
      </div>
    </ConnectedRouter>
  </Provider>,
  target
)