import React from 'react'
import { withRouter, Switch, Redirect } from 'react-router-dom'
// import LoadableComponent from '../utils/LoadableComponent'
import PrivateRoute from './AppRouter/PrivateRoute'

import TaskManageView from '../views/TaskManageView'


// import TEST1 from '../pages/SysConfigInspectMain1'
import InspectResults from '../pages/inspect-result/InspectResults'
import Home2 from '../pages/task-manage/TaskTable'
import TEST2 from '../pages/task-manage/TaskTable'


// const Home1 = LoadableComponent(()=>import('../pages/task-manage/TaskTable'))  //参数一定要是函数，否则不会懒加载，只会代码拆分
// const Home = LoadableComponent(()=>import('../pages/SysConfigInspectMain')) 
// // const Home = LoadableComponent(()=>import('../pages/TableDemo')) 
// const SecConfig = LoadableComponent(()=>import('../pages/security-manage/ConfigTable'))  
// const InspectResult = LoadableComponent(()=>import('../pages/TableDemo')) 
// const SysConfigInspectMain1 = LoadableComponent(()=>import('../pages/SysConfigInspectMain1')) 

@withRouter
class ContentMain extends React.Component {
  render () {
    return (
      <div style={{padding: 16, position: 'relative'}}>
        <Switch>
          <PrivateRoute exact path='/home' component={TaskManageView}/>
          <PrivateRoute exact path='/home/sec-config' component={Home2}/>
          <PrivateRoute exact path='/home/inspect-result' component={InspectResults}/>

          <Redirect exact from='/' to='/home'/>
        </Switch>
      </div>
    )
  }
}

export default ContentMain