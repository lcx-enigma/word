function $(select){
    return document.querySelector(select)
}
function $$(select){
    return document.querySelectorAll(select)
}
function $$$(select){
    return document.createElement(select)
}

//文本框通用规则示例(验证器)
class inputValidator {
    constructor(txtId, validatorFun) {
        this.input = $('#' + txtId);
        this.p = this.input.nextElementSibling;
        this.validatorFun = validatorFun;
        this.input.onblur = () => {
            this.validate();
        };
    }

    /**
     * 验证，成功返回true，失败返回false
     */
    async validate() {
        const err = await this.validatorFun(this.input.value);
        if (err) {
            // 有错误
            this.p.innerText = err;
            return false;
        } else {
            this.p.innerText = '';
            return true;
        }
    }

    /**
     * 对传入的所有验证器进行统一的验证，如果所有的验证均通过，则返回true，否则返回false
     * @param {FieldValidator[]} validators
     */
    static async validate(...validators) {
        const proms = validators.map((v) => v.validate());
        const results = await Promise.all(proms);
        return results.every((r) => r);
    }
}



/**
 * 
 * @param {String} content 弹出的内容
 * @param {Number} duration 这个弹窗持续的时间(多久后消失)
 * @param {HTMLElement} container 弹出到这个容器的正中间，如果不传，则弹出在页面的正中间
 * @param {Function} callBack 一切结束后运行回调函数
 */
function showMessage(option={}){
    const content = option.content || '';
    const duration = option.duration || 1000;
    const container = option.container || document.body;
    const div = document.createElement('div');
    div.style = `z-index: 999;
                background:#00000060;
                color:#fff;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                display: flex;
                align-items: center;
                border: 1px solid #ffffffc7;
                box-shadow: 0px 0px 5px 3px rgba(59,62,156,0.5);
                padding: 10px 15px;
                border-radius: 5px;
                transform: translate(-50%,-50%) translateY(20px);
                opacity: 0;
                transition: 1s;`
    div.innerHTML = `<div>${content}</div>`;
 
    //判断父容器的地位是什么
    if(option.container){//不能让body加上relative
        if(getComputedStyle(container).position==='static'){
            container.style.position = 'relative';
        }
    }
    
    container.appendChild(div);
    
    //让浏览器强行渲染
    div.clientHeight;//导致reflow重排

    //回归到正常位置
    div.style.transform = 'translate(-50%,-50%)'
    div.style.opacity = 1;

    setTimeout(() => {
        div.style.transform = 'translate(-50%,-50%) translateY(-50px)'
        div.style.opacity = 0;
        div.addEventListener('transitionend',function(){
            div.remove();
            //运行回调函数
            option.callBack && option.callBack();
        },{once:true})
    }, duration);
}

//运动函数方法
function createAnimation(option={}) {
    let from = option.from; //从这个值
    const to = option.to; //变到这个值
    const totalMS = option.totalMS || 800; //变化的总时间
    const duration = option.duration || 15; //每一次变化的时间
    const frequency = Math.floor(totalMS / duration); //变化的次数
    const dis = (to - from) / frequency; //每一次变化的值
    let curFrequency = 0; //当前变化的次数
    const timer = setInterval(function () {
        from += dis;
        curFrequency++;
        if (curFrequency >= frequency) { //变化的次数达到了 
            form = to; //完成变化
            clearInterval(timer); //清除计时器不再变化
            option.onmove && option.onmove(from);//运动时候触发
            option.onend && option.onend();//运动结束触发
            return;
        }
        option.onmove && option.onmove(from);//运动时候触发
    }, duration)
}

//传入一个数组,返回一个打乱之后的数组
function shuffleArray(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

//添加历史记录,第一个值传入一个单词对象,第二个值传入上次没有背完的
function setHistory(obj,last){
    const newObj = {
        curTime:Date.now(),
        data:{
            ...obj
        },
        last:{
            ...last
        }
    }
    if(!localStorage.getItem('history')){//如果里面一开始没有history的话
        const history = [];
        history.push(newObj);
        const newHistory = history.map(i => JSON.stringify(i));
        localStorage.setItem('history',newHistory);
    }else{//有的情况
        const getHistory = JSON.parse(`[${localStorage.getItem('history')}]`);
        getHistory.push(newObj);
        const newHistory = getHistory.map(i => JSON.stringify(i));        
        localStorage.setItem('history',newHistory);
    }
}

//等待执行函数
function delay(duration){
    return new Promise(resolve=>{
        setTimeout(() => {
            resolve();
        }, duration);
    })
}


//弹出文本框
function showPopup(option={}){
    const content = option.content || '';
    const title = option.title || '公告';
    const popHTML = document.createElement('div');
    const titleHTML = document.createElement('div');    
    const contentHTML = document.createElement('div');
    const dissolveHTML = document.createElement('div');
    titleHTML.innerText = title;
    titleHTML.style = `font-size: 1.2em;`;
    contentHTML.innerText = content;
    contentHTML.style = `margin-top: 7px;
            max-width: 180px;
            white-space: normal;
            word-wrap: break-word; 
            font-size: 13px;
            `;
    dissolveHTML.innerHTML = '&times;';
    dissolveHTML.style = `position: absolute;
            right: 8px;
            top: 5px;
            text-align: center;
            cursor: pointer;`
    popHTML.style = `position: absolute;
            border-radius: 10px;
            background: #00000080;
            border: 1px solid #fff;
            color: #fff;
            text-align: center;
            padding: 10px 15px;
            left: 50%;
            top: 35%;
            transform: translate(-48%, -50%);
            z-index:999`;
    dissolveHTML.addEventListener('click',function(){
        document.body.removeChild(popHTML);
        option.callBack && option.callBack();
    })
    popHTML.appendChild(titleHTML);
    popHTML.appendChild(contentHTML);
    popHTML.appendChild(dissolveHTML);
    document.body.appendChild(popHTML);
}

//弹出带有两个按钮的文本框
function showConfirmMsg(option={}){
    const content = option.content || '';
    const title = option.title || 'option';
    const isConfirmText = option.isConfirmText || '确认';
    const notConfirmText = option.notConfirmText || '取消';
    const container = option.container || document.body;
    if(option.container){//不能让body加上relative
        if(getComputedStyle(container).position==='static'){
            container.style.position = 'relative';
        }
    }
    
    const confirmMsgHTML = document.createElement('div');
    confirmMsgHTML.style = `position: absolute;
            border-radius: 10px;
            background: linear-gradient(to left,#ccc,#c58f56);
            border: 1px solid #ffffffc7;
            box-shadow: 0px 0px 5px 3px rgba(59,62,156,0.5);
            color: #fff;
            text-align: center;
            padding: 8px 15px;
            left: 20%;
            top:120px;
            z-index:999;`;
    const contentHTML = document.createElement('div');
    contentHTML.innerText = content;
    contentHTML.style = `margin-top: 7px;
            max-width: 180px;
            white-space: normal;
            word-wrap: break-word; 
            font-size: 13px;
            `;
    const titleHTML = document.createElement('div');
    titleHTML.innerText = title;
    titleHTML.style = `font-size: 1.2em;`;
    const confirm = document.createElement('div');
    confirm.style = `margin-top: 5px;
            position: relative;
            height: 30px;`
    const isConfirmHTML = document.createElement('span');
    isConfirmHTML.innerText = isConfirmText;
    isConfirmHTML.style = `position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-size: 14px;
            border-bottom: 1px solid #fff;
            padding: 2px;
            cursor: pointer;
            right: 5px;`
    isConfirmHTML.addEventListener('click',function(){
        container.removeChild(confirmMsgHTML);
        option.isConfirm && option.isConfirm();
    })
    const notConfirmHTML = document.createElement('span');
    notConfirmHTML.innerText = notConfirmText;
    notConfirmHTML.style = `position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-size: 14px;
            border-bottom: 1px solid #fff;
            padding: 2px;
            cursor: pointer;
            left: 5px;`
    notConfirmHTML.addEventListener('click', function () {
        container.removeChild(confirmMsgHTML);
        option.notConfirm && option.notConfirm();
    })
    const dissolveHTML = document.createElement('div');
    dissolveHTML.innerHTML = '&times;';
    dissolveHTML.style = `position: absolute;
            right: 8px;
            top: 5px;
            text-align: center;
            cursor: pointer;`
    dissolveHTML.addEventListener('click',function(){
        container.removeChild(confirmMsgHTML);
    })
   confirm.appendChild(isConfirmHTML);
   confirm.appendChild(notConfirmHTML);
   confirmMsgHTML.appendChild(dissolveHTML);
   confirmMsgHTML.appendChild(titleHTML);
   confirmMsgHTML.appendChild(contentHTML);
   confirmMsgHTML.appendChild(confirm);
   container.appendChild(confirmMsgHTML);
}


//格式化时间戳
function formatTime(timestamp, showTime = false) {
  const date = new Date(+timestamp);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date
    .getDate()
    .toString()
    .padStart(2, "0");
  let str = `${date.getFullYear()}-${month}-${day}`;
  if (showTime) {
    const hour = date
      .getHours()
      .toString()
      .padStart(2, "0");
    const minute = date
      .getMinutes()
      .toString()
      .padStart(2, "0");
    const second = date
      .getSeconds()
      .toString()
      .padStart(2, "0");
    str += ` ${hour}:${minute}:${second}`;
  }
  return str;
}


//返回所以用户录入的单词对象数组
async function respUserInfo(){
    const resp = await API.getInfo();
    if(resp.data !== null && resp.data.length !== 0){
        return Array.from(resp.data).filter(i=>i.from!==null);
    }
    else{
        return false;
    }
}


//返回最后一次录入的单词信息(obj)也就是获取单词对象
async function respWordObj(){
    const newData = await respUserInfo();
    if(!newData[newData.length-1]){return}
    const respStr = newData[newData.length-1].content;
    return JSON.parse(respStr);
}

//正常发送单词对象
function MainSendWordObj(obj){
    if(!obj){return};
    const newObj = {
        word:{
            ...obj
        }
    }
    const json = JSON.stringify(newObj);
    API.sendInfo(`${json}`);
}

//如有没有记下来的发送对象,第一个从参数是所有的单词,第二个参数是没有记下来的单词
function shortSendWordObj(AllObj,shortObj){
    if(!AllObj||!shortObj){return};
    const newObj = {
        word:{
            ...AllObj
        },
        last:{
            ...shortObj
        }
    }
    const json = JSON.stringify(newObj);
    API.sendInfo(`${json}`);
}

//通用获取wordObj
async function allInit(){
    const receiveWordObj = await respWordObj();
    if(!receiveWordObj){return}
    return receiveWordObj.word;
}

//通用判断是否登陆
async function isLoading(){
    const resp = await API.curInfo();
    const user = resp.data;
    if (!user) {
        alert('未登录或者登陆已过期,请重新登陆');
        location.href = './login.html';
        return;
    }
}

//可以通过值找到键的方法
function findKeyByValue(obj, value) {
  for (let key in obj) {
    if (obj[key] === value) {
      return key;
    }
  }
  return null; // 如果未找到匹配的键，则返回 null 或其他适当的值
}

function isChineseCharacter(char) {
  const charCode = char.charCodeAt(0);
  // 判断 Unicode 值是否在中文字符范围内
  return (charCode >= 0x4e00 && charCode <= 0x9fa5);
}

function isEnglishLetter(char) {
  const charCode = char.charCodeAt(0);
  // 判断 Unicode 值是否在英文字母范围内
  return ((charCode >= 0x0041 && charCode <= 0x005a) || (charCode >= 0x0061 && charCode <= 0x007a));
}