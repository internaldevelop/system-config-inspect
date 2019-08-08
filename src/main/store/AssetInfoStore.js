import { observable, action, configure } from 'mobx'
import { DeepClone } from '../../utils/ObjUtils'

configure({ enforceActions: 'observed' })

class AssetInfoStore {
    @observable cpuUsed = 0.0;
    @observable memUsed = 0.0;
    @observable diskUsed = 0.0;
    @observable procCpuPercents = [];
    @observable procMemPercents = [];
    @observable cpuRealTimeList = [];//[['time', 'value']]
    @observable memRealTimeList = [];
    @observable diskRealTimeList = [];

    @action setCpu = (percent) => {
        this.cpuUsed = percent;
    }
    @action setMem = (percent) => {
        this.memUsed = percent;
    }
    @action setDisk = (percent) => {
        this.diskUsed = percent;
    }
    @action setProcCpu = (procCpu) => {
        this.procCpuPercents = procCpu;
    }
    @action setProcMem = (procMem) => {
        this.procMemPercents = procMem;
    }
    @action setCpuRealTimeList = (realTimeList) => {
        this.cpuRealTimeList = realTimeList;
    }
    @action setMemRealTimeList = (realTimeList) => {
        this.memRealTimeList = realTimeList;
    }
    @action setDiskRealTimeList = (realTimeList) => {
        this.procMemPercents = realTimeList;
    }
    // @action initProcCpu = () => {
    //     this.procCpuPercents = [['procname', 'percent', 'score']];
    // }
    // @action initProcMem = () => {
    //     this.procMemPercents = [['procname', 'percent', 'score']];
    // }
    // @action addProcCpu = (procname, percent) => {
    //     let record = [procname, percent, this.procCpuPercents.length];
    //     this.procCpuPercents.push(record);
    // }
    // @action addProcMem = (procname, percent) => {
    //     let record = [procname, percent, this.procMemPercents.length];
    //     this.procMemPercents.push(record);
    // }
}

export default new AssetInfoStore()