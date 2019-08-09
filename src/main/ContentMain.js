import React from 'react'
import { withRouter, Switch, Redirect } from 'react-router-dom'
// import LoadableComponent from '../utils/LoadableComponent'
import PrivateRoute from './AppRouter/PrivateRoute'

import { GetSystemType } from "../global/environment"

import TaskManageView from '../views/TaskManageView'
import SecurityKnowledgeBase from '../views/SecurityKnowledgeBase'
import SecurityConfigView from '../views/SecurityConfigView'
import SecurityProjectView from '../views/SecurityProjectView'

import InspectResultOverview from '../views/InspectResultOverview'
import InspectResultView from '../views/InspectResultView'
import SecurityStatistics from '../views/SecurityStatistics'

import TaskExecResultsView from '../views/TaskExecResultsView'
import ExecActionsView from '../views/TaskExecResultsView/ExecActionsView'
import ExceptionLogsView from '../views/TaskExecResultsView/ExceptionLogsView'
import SystemLogsView from '../views/SystemLogsView'
import CheckResultView from '../views/CheckResultView'
import HistoryPerformance from '../views/HistoryPerformance'
import CheckTemplateView from '../views/CheckTemplateView'

import UsersManageView from '../views/UsersManageView'
import UserInfoView from '../views/UsersManageView/UserInfoView'
import AboutView from '../views/AboutView'
import TestView from '../views/TestView'

import AssetOverView from '../views/AssetOverView'
import PerformanceOverView from '../views/PerformanceOverView'
import AssetAnalysisView from '../views/AssetAnalysisView'

import AlertConfigView from '../views/AlertConfigView'


//====================================================================
// old pages, just for reference
import OldResultPage from '../unused/pages/inspect-result/InspectResults'
import OldPolicyPage from '../unused/pages/security-manage/ConfigTable'
import OldTaskPage from '../unused/pages/task-manage/TaskTable'
import AssetManageView from '../views/AssetManageView';
// import TaskManageViewOld from '../views/TaskManageViewOld'
// import TEST1 from '../unused/pages/SysConfigInspectMain1'


@withRouter
class ContentMain extends React.Component {
  render() {
    return (
      <div style={{ padding: 16, position: 'relative' }}>
      {GetSystemType() === 1 && this.getHostSystemRoute()}   
      {GetSystemType() === 2 && this.getTerminalSystemRoute()}
      {GetSystemType() === 3 && this.getPerformanceSystemRoute()}   
      </div>
    )
  }

  getHostSystemRoute() {
    return (
      <Switch>
        <PrivateRoute exact path='/home' component={SecurityProjectView} />
        <PrivateRoute exact path='/home/task-manage' component={TaskManageView} />
        <PrivateRoute exact path='/home/sec-config/knowledge' component={SecurityKnowledgeBase} />
        <PrivateRoute exact path='/home/sec-config/management' component={SecurityConfigView} />

        <PrivateRoute exact path='/home/inspect-result/overview' component={InspectResultOverview} />
        <PrivateRoute exact path='/home/inspect-result/details' component={InspectResultView} />
        <PrivateRoute exact path='/home/sec-config/statistics' component={SecurityStatistics} />

        <PrivateRoute exact path='/home/log-manage/inspect-logs' component={TaskExecResultsView} />
        <PrivateRoute exact path='/home/log-manage/operate-logs' component={ExecActionsView} />
        <PrivateRoute exact path='/home/log-manage/exception-logs' component={ExceptionLogsView} />
        <PrivateRoute exact path='/home/log-manage/system-logs' component={SystemLogsView} />

        <PrivateRoute exact path='/home/sysadmin/users' component={UsersManageView} />
        <PrivateRoute exact path='/home/sysadmin/personal' component={UserInfoView} />
        <PrivateRoute exact path='/home/sysadmin/assets' component={AssetManageView} />

        <PrivateRoute exact path='/home/about' component={AboutView} />

        <PrivateRoute exact path='/home/other/test1' component={TestView} />
        <PrivateRoute exact path='/home/other/ref1' component={OldTaskPage} />
        <PrivateRoute exact path='/home/other/ref2' component={OldPolicyPage} />
        <PrivateRoute exact path='/home/other/ref3' component={OldResultPage} />

        <Redirect exact from='/' to='/home' />
      </Switch>
    );
  }

  getTerminalSystemRoute() {
    return (
      <Switch>
        <PrivateRoute exact path='/home' component={AssetOverView} />
        <PrivateRoute exact path='/home/asset-analysis' component={AssetAnalysisView} />
        <PrivateRoute exact path='/home/check-template' component={CheckTemplateView} />

        <PrivateRoute exact path='/home/sysadmin/users' component={UsersManageView} />
        <PrivateRoute exact path='/home/sysadmin/personal' component={UserInfoView} />
        <PrivateRoute exact path='/home/sysadmin/assets' component={AssetManageView} />
        <PrivateRoute exact path='/home/sysconfig/system-alert' component={AlertConfigView} />
        <PrivateRoute exact path='/home/log-manage/system-logs' component={SystemLogsView} />
        <PrivateRoute exact path='/home/log-manage/check-logs' component={CheckResultView} />

        <PrivateRoute exact path='/home/about' component={AboutView} />

        <Redirect exact from='/' to='/home' />
      </Switch>
    );
  }

  getPerformanceSystemRoute() {
    return (
      <Switch>
        <PrivateRoute exact path='/home' component={PerformanceOverView} />
        <PrivateRoute exact path='/home/history-performance' component={HistoryPerformance} />

        <PrivateRoute exact path='/home/sysadmin/users' component={UsersManageView} />
        <PrivateRoute exact path='/home/sysadmin/personal' component={UserInfoView} />
        <PrivateRoute exact path='/home/sysadmin/assets' component={AssetManageView} />
        <PrivateRoute exact path='/home/log-manage/system-logs' component={SystemLogsView} />
        <PrivateRoute exact path='/home/log-manage/check-logs' component={CheckResultView} />

        <PrivateRoute exact path='/home/about' component={AboutView} />

        <Redirect exact from='/' to='/home' />
      </Switch>
    );
  }
}

export default ContentMain