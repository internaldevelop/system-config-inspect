import { observable, action, configure } from 'mobx'
// import { IsEmptyString } from '../../utils/StringUtils'
// import { IsNowExpired, GetExpireTimeGMTStr } from '../../utils/TimeUtils'
// import { GetCookie, SetCookie, DelCookie, SetCookieExpireDays } from '../../utils/CookieUtils'
import { DeepClone } from '../../utils/ObjUtils'

configure({ enforceActions: 'observed' })

class TaskStore {
  // 0: means idle
  // 1: means new record
  // 2: means record to be edited
  @observable taskAction = 0;
  @observable taskProcName = '未知操作';
  @observable taskPopupShow = false;
  // @observable newTaskDataReady = false;

  @action setTaskAction = (action) => {
    this.taskAction = action;
  }
  @action setTaskProcName = (name) => {
    this.taskProcName = name;
  }
  @action switchShow = (show) => {
    this.taskPopupShow = show;
  }

  // TODO: to be deleted
  @observable status = {
    isAdded: false,
    isChanged: false,
    rowId: 0,
  }
  @action setAddStatus() {
    this.status.isAdded = true;
  }
  @action setChangeStatus() {
    this.status.isChanged = true;
  }
  @action clearStatus = () => {
    this.taskAction = 0;
    this.status.isAdded = false;
    this.status.isChanged = false;
  }
  // end of TODO

  @observable taskItem = {};

  @action initTaskItem = (taskItem) => {
    this.taskItem = DeepClone(taskItem);
  }
  @action setParam = (name, data) => {
    this.taskItem[name] = data;
  }

}

export default new TaskStore()