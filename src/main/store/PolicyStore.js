import { observable, action, configure } from 'mobx'
import { CopyProps } from '../../utils/ObjUtils'

configure({ enforceActions: 'observed' })

class PolicyStore {
    @observable policyItem = {
        index: 0,
        name: '',
        group: '',
        type: '',
        riskLevel: '中',
        solution: '',
    };

    @action initPolicyItem = (params) => {
        CopyProps(this.policyItem, params);
    }
    @action setParam = (name, data) => {
        this.policyItem[name] = data;
    }

}

export default new PolicyStore()