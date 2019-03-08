import { observable, action, configure, computed } from 'mobx'
import { IsEmptyString } from '../../utils/StringUtils'
import { IsNowExpired, GetExpireTimeStr } from '../../utils/TimeUtils'
import { GetCookie, SetCookie, DelCookie, SetCookieExpireDays } from '../../utils/CookieUtils'

configure({ enforceActions: 'observed' })

class TaskStore {
  @observable taskProcName = '未知操作';
  @observable taskPopupShow = false;
  // @observable newTaskDataReady = false;

  @action setTaskProcName = (name) => {
    this.taskProcName = name;
  }
  @action switchShow = (show) => {
    this.taskPopupShow = show;
  }

  @observable configItem = {
    isNeedToAdd: false,
    taskName: '新建任务',
    taskDesc: '',
    hostName: '本机',
    hostIP: '127.0.0.1',
    hostPort: '8192',
    loginUser: 'root',
    loginPwd: '',
    osType: 'Ubuntu',
    osVer: 'V16.0',
    patch: false,
    sysService: true,
    sysFileProtect: true,
    accountConfig: true,
    pwdPolicy: true,
    commConfig: true,
    logAudit: true,
    securityAudit: true,
    firewall: false,
    selfDefined: true,
  };

  @action setTaskParams = (params, add) => {
    this.configItem = JSON.parse(JSON.stringify(params));
    this.configItem.isNeedToAdd = add;
  }
  @action clearTaskParams = () => {
    this.configItem.isNeedToAdd = false;
  }

}

export default new TaskStore()