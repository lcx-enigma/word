const API = (function () {
    const BASE_URL = 'https://study.duyiedu.com'

    function token(headers) {
        const token = localStorage.getItem('token');
        if (token) {
            headers.authorization = `Bearer ${token}`
        }
    }

    function get(path) {
        const headers = {};
        token(headers);
        return fetch(BASE_URL + path, { headers })
    }

    function post(path, obj) {
        const headers = { 'Content-Type': 'application/json' };
        token(headers);
        return fetch(BASE_URL + path, { method: 'POST', headers, body: JSON.stringify(obj) })
    }

    //注册
    async function enroll(userInfo) {
        const resp = await post('/api/user/reg', userInfo);
        return await resp.json();
    }

    //登陆
    async function landing(data) {
        const response = await post('/api/user/login', data)
        const resp = await response.json();
        //判断是否登陆保存成功
        if (resp.code === 0) {
            const token = response.headers.get('authorization');
            localStorage.setItem('token', token);
        }
        return resp;

    }

    //验证账号
    async function validate(loginId) {
        const resp = await get(`/api/user/exists?loginId=${loginId}`);
        return await resp.json();
    }

    //当前登陆的用户信息
    async function curInfo() {
        const resp = await get('/api/user/profile');
        return await resp.json();
    }

    //发送消息
    async function sendInfo(information) {
        const resp = await post('/api/chat', { content: information });
        return await resp.json();
    }

    //获取消息
    async function getInfo() {
        const resp = await get('/api/chat/history');
        return await resp.json();
    }

    //退出登陆
    function loginOut() {
        localStorage.removeItem('token');
    }

    return {
        enroll,
        landing,
        validate,
        curInfo,
        sendInfo,
        getInfo,
        loginOut
    }
}())