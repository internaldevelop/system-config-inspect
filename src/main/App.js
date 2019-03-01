import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, HashRouter, Route, Redirect, Switch } from 'react-router-dom'
import Login from '../login/LogIn';
import Signup from '../login/SignUp';
import DashBoard from '../navigator/DashBoard';
import DemoPage1 from '../demo-pages/demoPage1';
import TaskPage from '../pages/SysConfigInspectMain'
import AppRouter from './AppRouter'
import PrivateRoute from './AppRouter/PrivateRoute'
import PrivateRoute2 from './AppRouter/PrivateRoute2'
import LoginPage from '../login/LoginPage'

// class App extends Component {
//   render() {
//     return (
//       <AppRouter />
//     );

//   }
// }

class App extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    // };
  }
  render1() {
    return (
      <BrowserRouter>
        <div>
      <Switch>
        <Route path='/login' component={Login}/>
        <PrivateRoute2 path='/' component={TaskPage}/>
      </Switch>
      </div>
      </BrowserRouter>
    )
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            {/* <Route exact path="/" component={Login} /> */}
            {/* <PrivateRoute path='/' component={TaskPage} /> */}
            <PrivateRoute path='/tasks' component={TaskPage} />
            <Route path="/signup" component={Signup} />
            {/* <Route path="/tasks" component={TaskPage} /> */}
            <Route path="/dp1" component={DemoPage1} />
            <Route path="/DashBoard" component={DashBoard} />
            {/* <Route  {...this.props}  component={Login} /> */}
          </Switch>
        </div>
      </BrowserRouter>
    );

  }
}

export default App;
