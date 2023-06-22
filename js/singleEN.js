(async()=>{await isLoading()})()//判断是否登陆了

$('.nextPage').addEventListener('click',function(){
    location.href = './singleCH.html'
})
$('.previousPage').addEventListener('click',function(){
    location.href = './memory.html'
})
const ul = $('.ul');//获取ul
const translateWord = $('.translateWord');//获取翻译按钮
const refurbish =  $('.refurbish');//刷新按钮
const outline = $('.outline');//获取外边框
const next = $('.next');//下一个
const previous = $('.previous');//上一个
let li//所有的li
let total//总数并且加上最后一个重复的
let width//获取应该移动的距离


let wordObj;//单词对象
let wordArr;//单词

//初始化
async function init(){
    wordObj = await allInit();
    if(!wordObj){
        alert('还没有录入单词,请返回首页录入');
        location.href = './memory.html';
        return
    }
    wordArr = shuffleArray(Object.keys(wordObj));
    function _create(index){
        const li = $$$('li');
        const word = $$$('div');
        const translate = $$$('div');
        word.className = 'word';
        word.innerText = `${wordArr[index]}`
        translate.className = 'translate';
        translate.innerText = `${wordObj[`${wordArr[index]}`]}`
        li.appendChild(word);
        li.appendChild(translate);
        ul.appendChild(li)
    };
    for (let i = 0; i < wordArr.length; i++) {
        _create(i)
    }
    _create(0);    
    li = $$('li');//所有的li
    Array.from(li).forEach(item=>{
        item.childNodes[1].style.opacity = '0';
    })
    total = li.length;//总数并且加上最后一个重复的
    width = outline.clientWidth;//获取应该移动的距离
    ul.style.width = `${total*width}px`  
}
init();

translateWord.addEventListener('click',function(){
    if(!wordObj){
        alert('还没有保存值')
        return
    }
    li[currentIndex].childNodes[1].style.opacity = '1'
})

refurbish.addEventListener('click',function(){
    ul.innerHTML = '';//把之前的清空
    init();
})

let currentIndex = 0;
//出现对应索引的图片函数
let isPlaying = false;
function getWordCard(index, onend) {
    if (isPlaying || index === currentIndex) {
        return;
    }
    isPlaying = true;
    const from = parseInt(ul.style.marginLeft) || 0;
    const to = -index * width;
    createAnimation({
        from: from,
        to: to,
        onmove: function (n) {
            ul.style.marginLeft = n + 'px';
        },
        onend: function () {
            isPlaying = false;
            const newArr = Array.from(li)
            newArr.forEach(item=>{
                item.childNodes[1].style.opacity = '0';
            })
            onend && onend();
        }
    })
    currentIndex = index;
}


next.addEventListener('click',function(){
    if(!wordObj){
        alert('还没有值');
        return;
    }
    if(wordArr.length===1){return}
    const newIndex = currentIndex+1;
    let onend;
    if (newIndex === total-1) {
        onend = function () {
            ul.style.marginLeft = 0 + 'px';
            currentIndex = 0;
        }
    }
    getWordCard(newIndex,onend)
})

previous.addEventListener('click',function(){
    if(!wordObj){
        alert('还没有值');
        return;
    }
    if(wordArr.length===1){return}
    let newIndex = currentIndex-1;
    if(newIndex<0){
       ul.style.marginLeft = `-${(total-1)*width}px`;
       newIndex = total-2;
    }
    getWordCard(newIndex);
})