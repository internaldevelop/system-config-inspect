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
            account: '',
            userUuid: '',
            password: '',
            expire: '',
        });
    }
    var value = JSON.parse(login);
    return value;
};

class UserStore {
    @observable loginUser = {
        isLogin: false,
        account: '',
        userUuid: '',
        password: '',
        expire: '',
    };
    @action setLoginUser = (user) => {
        Object.assign(this.loginUser, user);
    };
    @action saveLoginUser = (expireDays) => {
        let info = JSON.stringify({
            account: this.loginUser.account,
            userUuid: this.loginUser.uuid,
            password: this.loginUser.password,
            expire: GetExpireTimeGMTStr(expireDays),
        });
        SetCookieExpireDays(loginInfoName, info, expireDays);
    }
    // 从cookie中读取保存的 remember user 信息
    @action initLoginUser = () => {
        let cachedUser = LoadUserLoginInfo();
        Object.assign(this.loginUser, cachedUser);
    }

    @computed get isUserExpired(){
        return IsEmptyString(this.loginUser.account);
    }

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

export default new UserStore()