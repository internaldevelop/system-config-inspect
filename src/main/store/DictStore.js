import { observable, action, configure, computed } from 'mobx'
import { CopyProps, DeepClone, DeepCopy } from '../../utils/ObjUtils'

import HttpRequest from '../../utils/HttpRequest';

configure({ enforceActions: 'observed' })

class DictStore {
    /**
     * 策略分组字典
     * @deprecated
     */
    @observable policyGroupsList = [];
    @action setPolicyGroups = (groups) => {
        this.policyGroupsList = groups;
    }
    @computed get isPolicyGroupsEmpty(){
        return (this.policyGroupsList.length === 0);
    }

    /**
     * 全局存放策略字典
     */
    @observable policiesArray = [];

    /**
     * 全局一次性加载策略字典，不和后台的策略字典表同步更新。
     */
    @action loadPolicies = () => {
        if (this.isPoliciesEmpty) {
            this.forceLoadPolicies();
        }
    }
    /**
     * 强制加载策略字典（重新向后台请求字典）
     */
    @action forceLoadPolicies = () => {
        HttpRequest.asyncGet(this.requestPoliciesCB, '/policies/all', )
    }

    requestPoliciesCB = (data) => {
        this.setPolicies(DeepClone(data.payload));
    }

    /**
     * 本函数用于应用在前端动态增加字典，可能和后台字典不一致
     */
    @action setPolicies = (policies) => {
        // 支持增量模式，所以采用 DeepCopy
        if (policies instanceof Array) {
            DeepCopy(this.policiesArray, policies)
        }
    }
    @computed get isPoliciesEmpty(){
        return (this.policiesArray.length === 0);
    }
    @action getPolicyByCode = (code) => {
        for (let policy of this.policiesArray) {
            if (policy.code === code)
                return policy;
        }
        return null;
    }

};

export default new DictStore()