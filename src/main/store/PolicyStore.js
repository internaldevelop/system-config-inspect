import { observable, action, configure, computed } from 'mobx'
import { DeepClone, DeepCopy } from '../../utils/ObjUtils'
import HttpRequest from '../../utils/HttpRequest';

configure({ enforceActions: 'observed' })

class PolicyStore {
  // 0: means idle
  // 1: means new record
  // 2: means record to be edited
  @observable policyAction = 0;
  @observable policyProcName = '未知操作';
  @observable policyPopupShow = false;

  @action setPolicyAction = (action) => {
    this.policyAction = action;
  }
  @action setPolicyProcName = (name) => {
    this.policyProcName = name;
  }
  @action switchShow = (show) => {
    this.policyPopupShow = show;
  }

    @observable policyItem = {};

    @action initPolicyItem = (policyItem) => {
        this.policyItem = DeepClone(policyItem);
    }
    @action setParam = (name, data) => {
        this.policyItem[name] = data;
    }

    /**
     * 全局存放策略字典 policiesArray
     */
    @observable policiesArray = [];

    /**
     * 全局一次性加载策略字典，不和后台的策略字典表同步更新。
     */
    @action loadPolicies = () => {
        if (this.isPoliciesEmpty) {
            this.forceLoadPoliciess();
        }
    }
    /**
     * 强制加载策略字典（重新向后台请求字典）
     */
    @action forceLoadPoliciess = () => {
        HttpRequest.asyncGet(this.requestPoliciessCB, '/policies/all', )
    }

    requestPoliciessCB = (data) => {
        this.setPolicies(DeepClone(data.payload));
    }

    /**
     * 本函数用于应用在前端动态增加字典，可能和后台字典不一致
     */
    @action setPolicies = (policies) => {
        // 支持增量模式，所以采用 DeepCopy
        if (policies instanceof Array) {
            DeepCopy(this.policiesArray, policies);
        }
    }
    @computed get isPoliciesEmpty(){
        return (this.policiesArray.length === 0);
    }
    @action getPoliciesByGroupCode = (code) => {
        let currentGroupGolicies = [];
        if (this.policiesArray instanceof Array) {
            for (let policy of this.policiesArray) {
                if (policy.code === code)
                currentGroupGolicies.push(policy);
            }
        }
        return currentGroupGolicies;
    }
}

export default new PolicyStore()