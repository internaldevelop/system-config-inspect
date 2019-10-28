import { observable, action, configure } from 'mobx'
import { DeepClone } from '../../utils/ObjUtils'

configure({ enforceActions: 'observed' })

class VulnerMethodStore {
  // 0: means idle
  // 1: means new record
  // 2: means record to be edited
  @observable vulnerMethodAction = 0;
  @observable vulnerMethodProcName = '未知操作';
  @observable vulnerMethodPopupShow = false;

  @action setVulnerMethodAction = (action) => {
    this.vulnerMethodAction = action;
  }
  @action setVulnerMethodProcName = (name) => {
    this.vulnerMethodProcName = name;
  }
  @action switchShow = (show) => {
    this.vulnerMethodPopupShow = show;
  }

  @observable vulnerMethodItem = {};

  @action initVulnerMethodItem = (vulnerMethodItem) => {
    this.vulnerMethodItem = DeepClone(vulnerMethodItem);
  }
  @action setParam = (name, data) => {
    this.vulnerMethodItem[name] = data;
  }
  @action setPOCParam = (name, data) => {
    this.vulnerMethodItem.poc[name] = data;
  }
}

export default new VulnerMethodStore()