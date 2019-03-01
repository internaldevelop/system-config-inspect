import Login from '../../login/LogIn';
import Signup from '../../login/SignUp';
import DashBoard from '../../navigator/DashBoard';
import DemoPage1 from '../../demo-pages/demoPage1';
import TaskPage from '../../pages/SysConfigInspectMain'


export default [
    { path: "/", name: "login", component: Login, auth: false, },
    { path: "/login", name: "login", component: Login, auth: false, },
    { path: "/main", name: "main", component: TaskPage, auth: false, },
    { path: "/tasks", name: "tasks", component: TaskPage, auth: false, },
    { path: "/signup", name: "signup", component: Signup, auth: false, },
  ]
