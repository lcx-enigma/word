const validateLoginId = new inputValidator('txtLoginId', function (data) {
    if (!data) {
        return '请填写账号'
    }
})

const validateLoginPwd = new inputValidator('txtLoginPwd', function (data) {
    if (!data) {
        return '请填写密码'
    }
})

const loginForm = $('.login-form');
loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const result = await inputValidator.validate(validateLoginId, validateLoginPwd);
    if (!result) {
        return;
    }
    const re = await API.landing({
        loginId: validateLoginId.input.value,
        loginPwd: validateLoginPwd.input.value
    })
    if (re.code === 0) {
        location.href = './memory.html';
    } else {
        validateLoginId.p.innerText = '账号或密码错误';
        validateLoginPwd.input.value = '';
    }
})

$('.enroll').addEventListener('click',function(){
    alert('暂不支持用户自行注册账号，如有需要请联系作者。')
})