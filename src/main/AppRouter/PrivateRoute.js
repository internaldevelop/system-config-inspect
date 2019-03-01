import React from 'react';
import {toastr} from "react-redux-toastr";
import {Route, withRouter} from 'react-router-dom';
import Login from '../../login/LogIn';
import LoginPage from '../../login/LoginPage';
import Signup from '../../login/SignUp';
import { IsUserLogin } from '../../login/UserState';

// import LoginUser from 'service/login-service/LoginUser';

// import Unauthorized from "page/error/Unauthorized";


//私有路由，只有登录的用户才能访问
class PrivateRoute extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isUserLogin: IsUserLogin(),
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