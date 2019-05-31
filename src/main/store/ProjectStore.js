import { observable, action, configure } from 'mobx'
import { DeepClone } from '../../utils/ObjUtils'

configure({ enforceActions: 'observed' })

class ProjectStore {
  @observable projectAction = 0;
  @observable projectProcName = '未知操作';
  @observable projectPopupShow = false;
  // @observable newTaskDataReady = false;

  @action setProjectAction = (action) => {
    this.projectAction = action;
  }
  @action setProjectProcName = (name) => {
    this.projectProcName = name;
  }
  @action switchShow = (show) => {
    this.projectPopupShow = show;
  }

  @observable projectItem = {};

  @observable projectOldItem = {};

  @action initProjectItem = (projectItem) => {
    this.projectItem = DeepClone(projectItem);
  }

  @action initProjectOldItem = (projectItem) => {
    this.projectOldItem = DeepClone(projectItem);
  }
  
  @action setParam = (name, data) => {
    this.projectItem[name] = data;
  }

}

export default new ProjectStore()