import React from 'react';
import {Route, withRouter} from 'react-router-dom';
import LoginPage from '../../components/login/LoginPage';
// import { IsUserLogin } from '../../components/login/UserState';
// import { IsUserLogin } from '../store/UserStore'

import userStore from '../../main/store/UserStore'
import { observer, inject } from 'mobx-react'

// import LoginUser from 'service/login-service/LoginUser';

// import Unauthorized from "page/error/Unauthorized";


//私有路由，只有登录的用户才能访问
@observer
@inject("userStore")
class PrivateRoute extends React.Component{
    constructor(props) {
        super(props);
        const userStore = this.props.userStore;
        const { isLogin } = userStore.loginInfo;
        this.state = {
            isUserLogin: userStore.isLogin,
        }
    }
    // componentWillMount(){
    //     if(!this.state.isUserLogin){
    //         toastr.error('login timeOut, return to the login page after 3s');
    //         const {history} = this.props;
    //         setTimeout(() => {
    //             history.replace("/login");
    //         }, 3000)
    //     }
    // }
    render(){
        const { component: Component, path="/", exact=false, strict=false} = this.props;
        return this.state.isUserLogin ?  (
            <Route  path={path} exact={exact}  strict={strict}
                    render={(props)=>( <Component {...props} /> )} />) : <LoginPage />;
    }
}
export default withRouter(PrivateRoute);