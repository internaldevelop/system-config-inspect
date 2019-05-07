import { observable, action, configure } from 'mobx'
import { DeepClone } from '../../utils/ObjUtils'

configure({ enforceActions: 'observed' })

class PolicyStore {
    @observable policyItem = {};

    @action initPolicyItem = (policyItem) => {
        this.policyItem = DeepClone(policyItem);
    }
    @action setParam = (name, data) => {
        this.policyItem[name] = data;
    }

}

export default new PolicyStore()