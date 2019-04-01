
import { message } from 'antd'

import axios from 'axios';
import Qs from 'qs';
import { errorCode } from '../global/error'
import { GetBackEndRootUrl } from '../global/environment'

class HttpRequest {
    async get(path, params = {}) {
        let payload = {};
        await axios.get( GetBackEndRootUrl() + path )
        // axios.get( 'https://www.easy-mock.com/mock/59801fd8a1d30433d84f198c/example/user/all' )
        // await axios.get( 'http://127.0.0.1:8090/api/users/all' )
        .then((response) => response.data)
        .then((data) => {
            console.log('axios get data, return:');
            console.log(data);//输出返回的数据
            if (data.code !== errorCode.success) {
                message.info('请求资源错误码：' + data.code + '  错误信息：' + data.error);
            } else {
                payload = data.payload;
            }
        })
        .catch(error => {
            console.log('axios catch error:');
            console.log(error);
        })
        return payload;
    }

    asyncGet(callback, path, params = {}) {
        axios.get( GetBackEndRootUrl() + path, {params: params} )
        .then((response) => response.data)
        .then((data) => {
            console.log('axios asyncGet data, return:');
            console.log(data);//输出返回的数据
            if (data.code !== errorCode.success) {
                message.error('请求资源错误码：' + data.code + '  错误信息：' + data.error);
            } else {
                callback(data.payload);
            }
        })
        .catch(error => {
            console.log('axios asyncGet catch error:');
            console.log(error);
        })
    }

    asyncPost(callback, path, params) {
        axios.post( GetBackEndRootUrl() + path, Qs.stringify(params) )
        .then((response) => response.data)
        .then((data) => {
            console.log('axios asyncPost data, return:');
            console.log(data);//输出返回的数据
            if (data.code !== errorCode.success) {
                message.error('请求资源错误码：' + data.code + '  错误信息：' + data.error);
            } else {
                callback(data.payload);
            }
        })
        .catch(error => {
            console.log('axios catch error:');
            console.log(error);
        })
    }

}

export default new HttpRequest()