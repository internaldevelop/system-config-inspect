

const IsUserLogin = () => {
    const {user, password, login=false, expire} = LoadUserLoginInfo();
    return login === true;
    // return true;
};

const UserLogin = (user, password, rememberDays) => {
    let expireDate = new Date();
    if (rememberDays > 0) {
        expireDate.setTime(expireDate.getTime() + rememberDays * 24 * 60 * 60 * 1000);
    } else {
        expireDate.setTime(expireDate.getTime() - 1);
    }

    document.cookie = JSON.stringify({
        user: user,
        password: password,
        login: true,
        expire: expireDate,
    });
};

const UserLogout = () => {
    const {user, password, expire} = LoadUserLoginInfo();
    document.cookie = JSON.stringify({
        user: user,
        password: password,
        login: false,
        expire: expire,
    });
}

function isEmpty(obj){
    if(typeof obj === "undefined" || obj === null || obj === ""){
        return true;
    } else {
        return false;
    }
}

const LoadUserLoginInfo = () => {
    let loginInfo = document.cookie;
    console.log(loginInfo);

    if (isEmpty(loginInfo)) {
        return ({
            user: '',
            password: '',
            login: false,
            expire: '',
        });
    }
    var value = JSON.parse(loginInfo);
    return value;
};


export { UserLogin, LoadUserLoginInfo, IsUserLogin, UserLogout };
