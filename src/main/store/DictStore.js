import { observable, action, configure, computed } from 'mobx'
import { CopyProps } from '../../utils/ObjUtils'

configure({ enforceActions: 'observed' })

class DictStore {
    /**
     * 策略分组字典
     */
    @observable policyGroupsList = [];

    @action setPolicyGroups = (groups) => {
        this.policyGroupsList = groups;
    }

    @computed get isPolicyGroupsEmpty(){
        return (this.policyGroupsList.length === 0);
    }


};

export default new DictStore()