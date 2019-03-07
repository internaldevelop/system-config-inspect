import { observable, action, configure, computed } from 'mobx'
import { IsEmptyString } from '../../utils/StringUtils'
import { IsNowExpired, GetExpireTimeStr } from '../../utils/TimeUtils'
import { GetCookie, SetCookie, DelCookie, SetCookieExpireDays } from '../../utils/CookieUtils'

configure({enforceActions: 'observed'})

const loginInfoName = 'loginInfo'

const LoadUserLoginInfo = () => {
    let login = GetCookie(loginInfoName);
    console.log(login);

    if (IsEmptyString(login)) {
        return ({
            user: '',
            password: '',
            expire: '',
        });
    }
    var value = JSON.parse(login);
    return value;
};

class UserStore {
    @observable isLogin = false;
    @observable user = '';
    @observable password = '';
    @observable isExpired = true;

    @computed get loginInfo() {
        return ({
            user: this.user,
            password: this.password,
            isLogin: this.isLogin,
        });
    }

    @action initLogin = () => {
        const { user, password, expire } = LoadUserLoginInfo();
        this.isLogin = false;
        this.user = user;
        this.password = password;
        // this.isExpired = IsNowExpired(expire);
        this.isExpired = IsEmptyString(user);
    }

    @action setLogin = (user, password, bLogin) => {
        this.user = user;
        this.password = password;
        this.isLogin = bLogin;
    }

    @action saveUser = (user, password, expireDays) => {
        this.user = user;
        this.password = password;
        this.isLogin = true;
        let info = JSON.stringify({
            user: user,
            password: password,
            expire: GetExpireTimeStr(expireDays),
        });
        SetCookieExpireDays(loginInfoName, info, expireDays);
    }
}

// export default new UserStore()
export default new UserStore()