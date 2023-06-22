(async()=>{await isLoading()})()//判断是否登陆了

$('.nextPage').addEventListener('click',function(){
    location.href = './dictation.html'
})
$('.previousPage').addEventListener('click',function(){
    location.href = './singleCH.html'
})


let wordObj;
let provisionalWordArr;

const english = $('.english');
const chinese = $('.chinese')


//看中文写英文的初始化
const enPhraseology = $('.enPhraseology');
const enNeedCompose = $('.enNeedCompose');
async function writeEnInit(){
   wordObj = await allInit();
    if(!wordObj){
        alert('还没有录入单词,请返回首页录入');
        location.href = './memory.html';
        return
    }
    provisionalWordArr = Object.keys(wordObj);
    const wordArr = shuffleArray(provisionalWordArr);
    for (let i = 0; i < wordArr.length; i++) {
        const li = $$$('li');
        li.innerText = wordObj[wordArr[i]]
        enPhraseology.appendChild(li);
    }
    for (let i = 0; i < wordArr.length; i++) {
        const li = $$$('li');
        const input = $$$('input');
        const isExactness = $$$('div');
        isExactness.className = 'isExactness';
        input.addEventListener('input',function(){
            if(this.value === wordArr[i]){
                isExactness.style.opacity = '1';
                isExactness.innerHTML = '<i class="iconfont icon-shuye"></i>';
                isExactness.style.boxShadow = '0px 0px 5px rgb(0, 255, 76)';
            }else{
                isExactness.style.opacity = '1';
                isExactness.innerHTML = '<i class="iconfont icon-chacha"></i>';
                isExactness.style.boxShadow= '0px 0px 5px rgb(255, 0, 0)';
            }
        })
        li.appendChild(input);
        li.appendChild(isExactness)
        enNeedCompose.appendChild(li);
    }  
}

writeEnInit();

//看英文写中文的初始化
const chPhraseology = $('.chPhraseology');
const chNeedCompose = $('.chNeedCompose');
async function writeChInit(){
    wordObj = await allInit();
    if(!wordObj){
        alert('还没有保存值')
        return
    }
    provisionalWordArr = Object.keys(wordObj);
    const wordArr = shuffleArray(provisionalWordArr);
    for (let i = 0; i < wordArr.length; i++) {
        const li = $$$('li');
        li.innerText = wordArr[i];
        chPhraseology.appendChild(li);
    }
    for (let i = 0; i < wordArr.length; i++) {
        const li = $$$('li');
        const input = $$$('input');
        const isExactness = $$$('div');
        isExactness.className = 'isExactness';
        input.addEventListener('input',function(){
            if(this.value === wordObj[wordArr[i]]){
                isExactness.style.opacity = '1';
                isExactness.innerHTML = '<i class="iconfont icon-shuye"></i>';
                isExactness.style.boxShadow = '0px 0px 5px rgb(0, 255, 76)';
            }else{
                isExactness.style.opacity = '1';
                isExactness.innerHTML = '<i class="iconfont icon-chacha"></i>';
                isExactness.style.boxShadow= '0px 0px 5px rgb(255, 0, 0)';
            }
        })
        li.appendChild(input);
        li.appendChild(isExactness)
        chNeedCompose.appendChild(li);
    }  
}

let key = true;
//看英文写中文的初始化
function changeCH(){
    english.style.opacity = '0';
    writeChInit();
    chinese.style.opacity = '1';
    enPhraseology.innerHTML = '';
    enNeedCompose.innerHTML = '';
    key = false;
}
//看中文写英文的初始化
function changeEN(){
    chinese.style.opacity = '0';
    writeEnInit();
    english.style.opacity = '1';
    chPhraseology.innerHTML = '';
    chNeedCompose.innerHTML = '';
    key = true;
}

$('.change').addEventListener('click',function(){
    key?changeCH():changeEN();
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
    popHTML.style = `position: fixed;
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
    const html = provisionalWordArr.map(i=>`
        <div style="display:flex">
            <div>${i}</div>
            <div>${wordObj[i]}</div>
        </div>
    `)
    _showPopup({
        title:'单词提示',
        content:html,
        callBack(){
            isCue = true;
        }
    })
})