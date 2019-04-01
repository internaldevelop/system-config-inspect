import { observable, action, configure, computed } from 'mobx'
import { IsEmptyString } from '../../utils/StringUtils'
import { GetExpireTimeGMTStr } from '../../utils/TimeUtils'
import { GetCookie, SetCookieExpireDays } from '../../utils/CookieUtils'

configure({enforceActions: 'observed'})

const loginInfoName = 'loginInfo'

const LoadUserLoginInfo = () => {
    let login = GetCookie(loginInfoName);
    console.log(login);

    if (IsEmptyString(login)) {
        return ({
            user: '',
            userUuid: '',
            password: '',
            expire: '',
        });
    }
    var value = JSON.parse(login);
    return value;
};

class UserStore {
    @observable isLogin = false;
    @observable userUuid = '';
    @observable user = '';
    @observable password = '';
    @observable isExpired = true;

    @computed get loginInfo() {
        return ({
            user: this.user,
            userUuid: this.initLogin.userUuid,
            password: this.password,
            isLogin: this.isLogin,
        });
    }

    @action initLogin = () => {
        const { user, userUuid, password } = LoadUserLoginInfo();
        this.isLogin = false;
        this.user = user;
        this.userUuid = userUuid;
        this.password = password;
        // this.isExpired = IsNowExpired(expire);
        this.isExpired = IsEmptyString(user);
    }

    @action setLogin = (user, userUuid, password, bLogin) => {
        this.user = user;
        this.userUuid = userUuid;
        this.password = password;
        this.isLogin = bLogin;
    }

    @action saveUser = (user, userUuid, password, expireDays) => {
        this.user = user;
        this.userUuid = userUuid;
        this.password = password;
        this.isLogin = true;
        let info = JSON.stringify({
            user: user,
            password: password,
            expire: GetExpireTimeGMTStr(expireDays),
        });
        SetCookieExpireDays(loginInfoName, info, expireDays);
    }
}

// export default new UserStore()
export default new UserStore()