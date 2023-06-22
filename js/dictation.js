(async()=>{await isLoading()})()//判断是否登陆了

$('.nextPage').addEventListener('click',function(){
    location.href = './option.html'
})
$('.previousPage').addEventListener('click',function(){
    location.href = './check.html'
})

let wordObj;

async function init(){
    wordObj = await allInit();
    if(!wordObj){
        alert('还没有录入单词,请返回首页录入');
        location.href = './memory.html';
        return
    }
}
init();

const fill = $('.fill');
const english = $('.english');
const chinese = $('.chinese');
const custom = $('.custom');

//往dom的innerText传入value
function entry(dom, value) {
    dom.innerText = '';
    dom.innerText = value;
}

let provisionalWordArr;

let key = true;//控制按钮的启动(如果在报听写,就不能启动)
//传入一个数组和每隔多长时间输出(数组会打乱)
function dictation(word = [], duration,callBack) {
    fill.style.fontSize = '2.7em';
    const shuffledArr = shuffleArray(word);
    provisionalWordArr = shuffledArr;
    fill.innerText = shuffledArr[0]
    let i = 1;
    const timer = setInterval(() => {
        entry(fill, shuffledArr[i])
        i++;
        if (i === shuffledArr.length+1) {
            clearInterval(timer)
            key = true;
            callBack();
        }
    }, duration * 1000);
}



english.addEventListener('click',function(){
    if(key){
        key=false;
        if(wordObj){
            const interval = custom.value || 8//设置时间
            if(!+interval || interval<=0){
                fill.style.fontSize = '1.8em';
                fill.innerText = '请输入正确的时间';
                key=true;
                return;
            }
            setTimeout(() => {
                dictation(Object.keys(wordObj),interval,function(){
                    fill.style.fontSize = '1.8em';
                    fill.innerText = '听写完毕...';
                })
            }, 800);
        }else{
            alert('还没有录入值,请返回首页重新录入值');
            key = true;
        }
    }
})
chinese.addEventListener('click',function(){
    if(key){
        key=false;
        if(wordObj){
            const interval = custom.value || 8//设置时间
            if(!+interval || interval<=0){
                fill.style.fontSize = '1.8em';
                fill.innerText = '请输入正确的时间';
                key=true;
                return;
            }
            setTimeout(() => {
                dictation(Object.values(wordObj),interval,function(){
                    fill.style.fontSize = '1.8em';
                    fill.innerText = '听写完毕...';
                })
            }, 800);
        }else{
            alert('还没有录入值,请返回首页重新录入值');
            key = true;
        }
    }
})


//弹出文本框
function _showPopup(option={}){
    const content = option.content || '';
    const title = option.title || '公告';
    const popHTML = document.createElement('div');
    const titleHTML = document.createElement('div');    
    const contentHTML = document.createElement('div');
    const dissolveHTML = document.createElement('div');
    const container = option.container || document.body;
    if(option.container){//不能让body加上relative
        if(getComputedStyle(container).position==='static'){
            container.style.position = 'relative';
        }
    }
    titleHTML.innerText = title;
    titleHTML.style = `font-size: 1.1em;`;
    contentHTML.innerHTML = content;
    contentHTML.style = `margin-top: 5px;
            max-width: 180px;
            white-space: normal;
            word-wrap: break-word; 
            font-size: 13px;
            `;
    dissolveHTML.innerHTML = '&times;';
    dissolveHTML.style = `position: absolute;
            right: 3px;
            top: -1px;
            text-align: center;
            cursor: pointer;
            z-index:999
            `
    popHTML.style = `position: absolute;
            top:0;
            border-radius: 10px;
            background: linear-gradient(to top, #55a09b,#000);
            border: 1px solid #fff;
            color: #fff;
            text-align: center;
            padding: 10px 15px;
            z-index:9;
            height:500px;
            overflow-Y:auto;`;
    popHTML.className = 'pop'
    dissolveHTML.addEventListener('click',function(){
        container.removeChild(popHTML);
        option.callBack && option.callBack();
    })
    popHTML.appendChild(titleHTML);
    popHTML.appendChild(contentHTML);
    popHTML.appendChild(dissolveHTML);
    container.appendChild(popHTML);
}
let isCue = true;
$('.cue').addEventListener('click',function(){
    if(!isCue){
        return;
    }
    isCue = false;
    if(!provisionalWordArr){
        isCue = true;
        alert('请先听写一遍');
        return;
    }
    let html;
    if(isChineseCharacter(provisionalWordArr[0])){
        html = provisionalWordArr.map(i=>`
        <div style="display:flex">
            <div>${i}</div>
            <div>${findKeyByValue(wordObj,i)}</div>
        </div>
    `)
    }else{
        html = provisionalWordArr.map(i=>`
        <div style="display:flex">
            <div>${i}</div>
            <div>${wordObj[i]}</div>
        </div>
    `)
    }
    _showPopup({
        title:'听写检查',
        content:html,
        callBack(){
            isCue = true;
        }
    })
})
