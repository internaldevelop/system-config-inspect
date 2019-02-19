import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import SignIn from '../login/SignIn';
import Login from '../login/LogIn';
import DashBoard from '../navigator/DashBoard';
import DemoPage1 from '../demo-pages/demoPage1';

class App extends Component {
  render() {
    return (
      <Router >
        <div>
          <Route exact path="/" component={Login} />
          <Route exact path="/SignIn" component={SignIn} />
          <Route path="/dp1" component={DemoPage1} />
          <Route path="/DashBoard" component={DashBoard} />
        </div>
      </Router>
    );

  }
}

export default App;
