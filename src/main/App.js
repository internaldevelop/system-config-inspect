import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import PrivateRoute from './AppRouter/PrivateRoute'
import LoginPage from '../components/login/LoginPage'
import Signup from '../components/login/SignUp';
import SystemEntry from './SystemEntry'

// import { observer, inject } from 'mobx-react'

// @observer
// @inject('userStore')
class App extends Component {
  constructor(props) {
    super(props);
    // const userStore = this.props.userStore;
    // this.state = {
    // };
  }

  render() {
    return (
      <BrowserRouter>
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
      </BrowserRouter>
    );

  }
}

export default App;
