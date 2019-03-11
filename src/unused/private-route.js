import React from 'react';
import {Route,Redirect,withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import { UserIsAuthenticated } from './session'

// https://www.cnblogs.com/kdcg/p/9309600.html
// 查阅以上页面，修改全局路由登陆拦截

//私有路由，只有登录的用户才能访问
class PrivateRoute extends React.Component{
    componentWillMount(){
        let  isAuthenticated = UserIsAuthenticated();
        this.setState = {isAuthenticated:isAuthenticated};
        if(!isAuthenticated){
          const {history} = this.props;
          setTimeout(() => {
            history.replace("/login");
          }, 1000)
        }
    }
    render(){
        let { component: Component,path="/",exact=false,strict=false, ...rest} = this.props;
        return (
          <Route
          {...rest}
          render={props => {
            const postId = props.match.params.postId;
            return this.state.isAuthenticated ? (
              <Component {...props} />
            ) : (
              <Redirect
                to={{
                  pathname: "/login",
                  state: { from: props.location }
                }}
              />
            )
          }}
        />
      
        );
        // return this.state.isAuthenticated ?  (
        //     <Route  path={path} exact={exact}  strict={strict}  render={(props)=>( <Component {...props} /> )} />
        // ) : ("请重新登录");
    }
}
PrivateRoute.propTypes  ={
        path:PropTypes.string.isRequired,
        exact:PropTypes.bool,
        strict:PropTypes.bool,
        component:PropTypes.func.isRequired
}
export default withRouter(PrivateRoute);

// import React from 'react'
// import { Route, Redirect, } from 'react-router-dom'
// import { UserIsAuthenticated } from './session'

// const PrivateRoute = ({ component: Component, ...rest }) => (
//   <Route {...rest} render={(props) => (
//     !!UserIsAuthenticated()
//       ? <Component {...props} />
//       : <Redirect to={{
//         pathname: '/login',
//         state: { from: props.location }
//       }} />
//   )} />
// )

// export default PrivateRoute