import React from 'react'
import { withRouter, Switch, Redirect } from 'react-router-dom'
// import LoadableComponent from '../utils/LoadableComponent'
import PrivateRoute from './AppRouter/PrivateRoute'

import TaskManageView from '../views/TaskManageView'
import SecurityConfigView from '../views/SecurityConfigView'
import InspectResultOverview from '../views/InspectResultOverview'
import InspectResultView from '../views/InspectResultView'


//====================================================================
// old pages, just for reference
import OldResultPage from '../unused/pages/inspect-result/InspectResults'
import OldPolicyPage from '../unused/pages/security-manage/ConfigTable'
import OldTaskPage from '../unused/pages/task-manage/TaskTable'
import TEST1 from '../unused/pages/SysConfigInspectMain1'


@withRouter
class ContentMain extends React.Component {
  render () {
    return (
      <div style={{padding: 16, position: 'relative'}}>
        <Switch>
          <PrivateRoute exact path='/home' component={TaskManageView}/>
          <PrivateRoute exact path='/home/sec-config' component={SecurityConfigView}/>
          <PrivateRoute exact path='/home/inspect-result/overview' component={InspectResultOverview}/>
          <PrivateRoute exact path='/home/inspect-result/details' component={InspectResultView}/>

          <PrivateRoute exact path='/home/sysadmin/users' component={InspectResultView}/>
          <PrivateRoute exact path='/home/sysadmin/personal' component={InspectResultView}/>

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