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
    // @computed get isPolicyGroupsEmpty(){
    //     return (this.policyGroupsList.length === 0);
    // }

    /**
     * 全局存放策略组字典 policyGroupsArray
     */
    @observable policyGroupsArray = [];

    /**
     * 全局一次性加载策略字典，不和后台的策略字典表同步更新。
     */
    @action loadPolicyGroups = () => {
        if (this.isPolicyGroupsEmpty) {
            this.forceLoadPolicyGroups();
        }
    }
    /**
     * 强制加载策略字典（重新向后台请求字典）
     */
    @action forceLoadPolicyGroups = () => {
        HttpRequest.asyncGet(this.requestPolicyGroupsCB, '/policy-groups/all', )
    }

    requestPolicyGroupsCB = (data) => {
        this.setPolicyGroups(DeepClone(data.payload));
    }

    /**
     * 本函数用于应用在前端动态增加字典，可能和后台字典不一致
     */
    @action setPolicyGroups = (policyGroup) => {
        // 支持增量模式，所以采用 DeepCopy
        if (policyGroup instanceof Array) {
            DeepCopy(this.policyGroupsArray, policyGroup);
        }
    }
    @computed get isPolicyGroupsEmpty(){
        return (this.policyGroupsArray.length === 0);
    }
    @action getPolicyGroupByCode = (code) => {
        for (let policyGroup of this.policyGroupsArray) {
            if (policyGroup.code === code)
                return policyGroup;
        }
        return null;
    }
};

export default new DictStore()