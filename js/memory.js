(async()=>{await isLoading()})()//判断是否登陆了

async function judge(){
    // return await respUserInfo();
    if(!await respUserInfo()){
        $('.overlay').style.zIndex = '9';
        showPopup({
            title:'系统提示',
            content:'检测到您可能是首次使用,可以先去查看看使用规则。',
            callBack(){
                $('.overlay').style.zIndex = '-99';
                $('.rule').style.transition = '1s';
                $('.rule').style.color = '#f40';
                $('.rule').style.fontWeight = 'bold';
            }
        })
    }
}
judge();

$('.nextPage').addEventListener('click',function(){
    location.href = './singleEN.html'
})


const add = $('.add');
const remove = $('.remove');
const ul = $('.yourSelf');
const rule = $('.rule')
//获取一些基本数据
let li = $('li');
let liHeight;//35

//简单的辅助函数
function createCell(){
    const li = $$$('li');
    const input = $$$('input');
    input.maxLength = '12';
    li.appendChild(input);
    ul.appendChild(li)
}
//简单的辅助函数
function _init(){
    const words = $$$('li');
    words.className = 'words';
    words.innerText = '单词';
    const translate = $$$('li');
    translate.className = 'translate';
    translate.innerText = '翻译'
    ul.appendChild(words);
    ul.appendChild(translate);
    for (let i = 0; i < 2; i++) {
        createCell()
    }
    li = $('li')
    liHeight = li.offsetHeight;   
}
//简单的辅助函数
function _lastInit(obj){
    const wordEntries = Object.entries(obj);//格式化一下
    const newWordEntries = wordEntries.reduce((a,b)=>a.concat(b),[]);//格式化一下
    const words = $$$('li');
    words.className = 'words';
    words.innerText = '单词';
    const translate = $$$('li');
    translate.className = 'translate';
    translate.innerText = '翻译';
    ul.appendChild(words);
    ul.appendChild(translate);
    for (let i = 0; i < newWordEntries.length; i++) {
        const li = $$$('li');
        const input = $$$('input');
        input.maxLength = '12';  
        i%2===0?input.value = newWordEntries[i]:input.value = newWordEntries[i];
        li.appendChild(input);
        ul.appendChild(li);         
    }
    li = $('li')
    liHeight = li.offsetHeight;   
}

let wordObj;

const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//简单的初始化
async function init(){
    if(localStorage.getItem('historyWord')){
        $('.overlay').style.zIndex = '9';
        showPopup({
            title:'system info',
            content:'恢复成功,已经为您准备好了',
            callBack(){
                $('.overlay').style.zIndex = '-99';
                ul.style.transition = '1.5s' 
                ul.style.opacity = '1';
            }
        })
        ul.style.opacity = '0';
        _lastInit(JSON.parse(localStorage.getItem('historyWord')));
        return;
    }
    const receiveWordObj = await respWordObj();
    if(!receiveWordObj){
        _init();
        return;
    }
    wordObj = receiveWordObj.word;
    if(!receiveWordObj.last){//(背完的情况)
        _init();
        if(!wordObj){return}
        $('.overlay').style.zIndex = '9';
        showPopup({
            title:'system info',
            content:`恭喜你上次全部背完,您的单词量又多增加了${Object.keys(wordObj).length}个`,
            callBack(){ 
                $('.overlay').style.zIndex = '-99';
                ul.style.transition = '0.7s' 
                ul.style.opacity = '1'
            }
            });
        ul.style.opacity = '0' 

    }else{//(没有背完的情况的初始化)
        const lastWord = receiveWordObj.last
        const content = Object.keys(lastWord).length ===Object.keys(wordObj).length ?`很遗憾您上次一个都没有记下来,已为您重新准备。`:`恭喜你上次背完了${Object.keys(wordObj).length-Object.keys(lastWord).length}个单词,还差${Object.keys(lastWord).length}个没有熟背,已为您重新准备。`;
        $('.overlay').style.zIndex = '9';
        showPopup({
            title:'system info',
            content:content,
            callBack(){ 
                $('.overlay').style.zIndex = '-99';
                ul.style.transition = '1.5s' 
                ul.style.opacity = '1';
            }
            });
        ul.style.opacity = '0';
        _lastInit(lastWord);    
    }
}
init();




//点击增加两个文本框
add.addEventListener('click',function(){
    for(let i = 0;i < 2;i++){
        createCell();
    }
    if(ul.clientHeight>=liHeight*3){//大于等于三个格子(单词)
        remove.style.opacity = '1';
        remove.style.top = `${ul.clientHeight-25}px`;
        remove.addEventListener('click',removeInput);//添加删除事件
    }
})
//删除两个文本框
function removeInput(){
    const li = $$('li');
    ul.removeChild(li[li.length-1]);
    ul.removeChild(li[li.length-2]);
    if(ul.clientHeight<=liHeight*2){//小于等于两个格子(单词)
        remove.style.opacity = '0';
        remove.removeEventListener('click',removeInput);//删除 删除事件
    }
    if(ul.clientHeight>=liHeight*3){//大于等于三个格子(单词)
        remove.style.top = `${ul.clientHeight-25}px`;
    }
}
remove.addEventListener('click',removeInput);


let test
//录入
async function entering(){
    $('.overlay').style.zIndex = '9';
     //检查数组里面所以的input的value是否有值，如果没有值则返回true
    function _check(arr){
        for (let i = 0; i < arr.length; i++) {
            if(!arr[i].value){
                return true;
            }
        }
    }
    const enter = $('.entering');
    enter.innerText = '录入中...';
    enter.removeEventListener('click',entering)
    const i = $$('input');//获取所有的input元素
    const inputArr = Array.from(i)
    if(_check(inputArr)){
        showMessage({
            content:'录入失败,请填写完整',
            duration:3000,
            container:$('.space'),
            callBack(){
                $('.overlay').style.zIndex = '-99';
                enter.innerText = 'entering';
                enter.addEventListener('click',entering);
            }
        })
        return;
    }
    await delay(3000);
    $('.overlay').style.zIndex = '9';
    showMessage({content:'录入成功',
                duration:2000,
                container:$('.space'),
                callBack(){
                        $('.overlay').style.zIndex = '-99';
                         window.scrollTo({
                            top: 0,
                            behavior: 'smooth'
                        });
                        enter.innerText = 'entering';
                        enter.addEventListener('click',entering);
                        ul.innerHTML = '';
                        _init();
                        if(ul.clientHeight<=liHeight*2){//小于等于两个格子(单词)
                            remove.style.opacity = '0';
                            remove.removeEventListener('click',removeInput);//删除 删除事件
                        }
                    }
                });
    const obj = {}
    const wordArr = [];
    const translateArr = [];
    inputArr.forEach((item,i)=>{
        i%2===0?wordArr.push(item.value):translateArr.push(item.value)
    })
    const newWordArr = wordArr.map(i=>i.trim());//清除每个的首位空格
    const newTranslateArr = translateArr.map(i=>i.trim());//清除每个的首位空格
    for (let i = 0; i < wordArr.length; i++) {
        obj[newWordArr[i]] = newTranslateArr[i];
    }
    localStorage.removeItem('historyWord');
    MainSendWordObj(obj);
}
$('.entering').addEventListener('click',entering);

rule.addEventListener('click',function(){
    $('.overlay').style.zIndex = '9';
    showPopup({
            title:'使用规则',
            content:'声明“该网站所以单词信息均为用户自行输入，若有错误请自行承担，该网站仅适合一些简短常用意思单词的记忆，如需系统的学习记忆，请到专业软件上学习。” “该网站样式基于移动端编写”。第一点：请记住每次的录入(entering)和提交保存，我们会根据您录入的信息来创建出单词列表。第二点：如果不保存,我们会默认认为您全部背完，将不会记录您没有背完的(option选择的是您已经记下来的单词)。第三点：网站上所有的刷新按钮均用来打乱单词列表。第四点：在请自定义时间中，输入的是您希望听写的间隔时间(单位是秒)。本站可能存在未知的错误，如有发现请联系作者',
            callBack(){
                $('.overlay').style.zIndex = '-99';
            }
        })
})

$('.history').addEventListener('click',function(){
    location.href = './history.html';
})
$('.secede').addEventListener('click',function(){
    API.loginOut();
    location.href = './login.html';
    localStorage.removeItem('historyWord')
})