import React from 'react'
import { Route, Redirect, } from 'react-router-dom'
import { IsUserLogin } from '../../login/UserState';

const PrivateRoute2 = ({component: Component, ...rest}) => (
  <Route {...rest} render={(props) => (
    IsUserLogin()
      ? <Component {...props} />
      : <Redirect to={{
        pathname: '/login',
        state: {from: props.location}
      }}/>
  )}/>
)

export default PrivateRoute2