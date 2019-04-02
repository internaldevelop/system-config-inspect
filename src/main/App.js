import React, { Component } from 'react';
import './App.css';
import { HashRouter, Route, Switch } from 'react-router-dom'
import PrivateRoute from './AppRouter/PrivateRoute'
import LoginPage from '../components/login/LoginPage'
import Signup from '../components/login/SignUp';
import SystemEntry from './SystemEntry'

class App extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/signup" component={Signup} />
            <PrivateRoute path='/home' component={SystemEntry} />
            {/* <PrivateRoute path='/tasks' component={TaskPage} /> */}
            {/* <Redirect exact from='/' to='/home'/> */}
          </Switch>
        </div>
      </HashRouter>
    );

  }
}

export default App;
