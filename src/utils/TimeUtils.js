export function IsNowExpired(expire) {
    let currentTime = new Date();
    return (currentTime.getTime() > expire.getTime());
}

export function GetExpireTimeStr(expireDays) {
    var exp = new Date();
    exp.setTime(exp.getTime() + expireDays*24*60*60*1000);
    return exp.toGMTString();
}