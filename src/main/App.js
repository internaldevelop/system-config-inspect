import React, { Component } from 'react';
import './App.css';
import { HashRouter, BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import PrivateRoute from './AppRouter/PrivateRoute'
import LoginPage from '../components/login/LoginPage'
import Signup from '../components/login/SignUp';
import SystemEntry from './SystemEntry'

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <HashRouter>
        <div>
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <Route exact path="/login" component={LoginPage} />
            <PrivateRoute path='/home' component={SystemEntry} />
            {/* <PrivateRoute path='/tasks' component={TaskPage} /> */}
            <Route exact path="/signup" component={Signup} />
            {/* <Redirect exact from='/' to='/home'/> */}
          </Switch>
        </div>
      </HashRouter>
    );

  }
}

export default App;
