import React from 'react'
import { withRouter, Switch, Redirect } from 'react-router-dom'
// import LoadableComponent from '../utils/LoadableComponent'
import PrivateRoute from './AppRouter/PrivateRoute'

import TaskManageView from '../views/TaskManageView'
import SecurityConfigView from '../views/SecurityConfigView'
import InspectResultView from '../views/InspectResultView'


//====================================================================
// old pages, just for reference
import OldResultPage from '../unused/pages/inspect-result/InspectResults'
import OldPolicyPage from '../unused/pages/security-manage/ConfigTable'
import OldTaskPage from '../unused/pages/task-manage/TaskTable'
import TEST1 from '../unused/pages/SysConfigInspectMain1'


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
          <PrivateRoute exact path='/home/sec-config' component={SecurityConfigView}/>
          <PrivateRoute exact path='/home/inspect-result' component={InspectResultView}/>

          <PrivateRoute exact path='/home/other/ref1' component={OldTaskPage}/>
          <PrivateRoute exact path='/home/other/ref2' component={OldPolicyPage}/>
          <PrivateRoute exact path='/home/other/ref3' component={OldResultPage}/>

          <Redirect exact from='/' to='/home'/>
        </Switch>
      </div>
    )
  }
}

export default ContentMain