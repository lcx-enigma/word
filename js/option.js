(async()=>{await isLoading()})()//判断是否登陆了

$('.previousPage').addEventListener('click',function(){
    location.href = './dictation.html'
})

const optionList = $('.optionList');
const selectOutline = $('.selectOutline');

//初始化
let wordObj
let wordArr;
let allItemCheck;
let newAllItemCheck;
async function init(){
    wordObj = await allInit();
    if(!wordObj){
        alert('还没有录入单词,请返回首页录入');
        location.href = './memory.html';
        return
    }
    wordArr = Object.keys(wordObj);
    //辅助函数
    function _active(original){
        original.children[0].className === 'isActive'?original.children[0].className = 'active':original.children[0].className = 'isActive';
        selectOutline.children[0].className = 'checkAll';
    }
    for (let i = 0; i < wordArr.length; i++) {
        const li = $$$('li');
        li.className = 'item'
        const itemCheck = $$$('div');
        itemCheck.className = 'itemCheck'
        const active = $$$('div');
        active.className = 'active';
        itemCheck.appendChild(active);
        itemCheck.addEventListener('click',function(){
            _active(this);
        })

        const complete = $$$('div');
        complete.className = 'complete';
        const word = $$$('div');
        word.className = 'word';
        word.innerText = wordArr[i];
        const translate = $$$('div');
        translate.className = 'translate';
        translate.innerText = wordObj[wordArr[i]];
        complete.appendChild(word);
        complete.appendChild(translate);
        complete.addEventListener('click',function(){
            _active(itemCheck)
        })
        li.appendChild(itemCheck);
        li.appendChild(complete);
        optionList.appendChild(li);
    }  
    allItemCheck = $$('.itemCheck');
    newAllItemCheck = Array.from(allItemCheck);
}
init();



selectOutline.addEventListener('click',function(){
    this.children[0].className === 'isCheckAll'?this.children[0].className = 'checkAll':this.children[0].className = 'isCheckAll';
    if(this.children[0].className === 'isCheckAll'){
        newAllItemCheck.forEach(element => {
            element.children[0].className = 'isActive';
        });
    }else{
        newAllItemCheck.forEach(element => {
            element.children[0].className = 'active';
        });
    }
})
$('.all').addEventListener('click',function(){
    selectOutline.children[0].className === 'isCheckAll'?selectOutline.children[0].className = 'checkAll':selectOutline.children[0].className = 'isCheckAll';
    if(selectOutline.children[0].className === 'isCheckAll'){
        newAllItemCheck.forEach(element => {
            element.children[0].className = 'isActive';
        });
    }else{
        newAllItemCheck.forEach(element => {
            element.children[0].className = 'active';
        });
    }
})

const submiting = $('.submit');
async function submit(){
    submiting.innerText = '保存中...'
    submiting.removeEventListener('click',submit);
    await delay(3000);
    showMessage({
        content:'保存成功',
        duration:1500,
        container:$('.space'),
        callBack:function(){
            submiting.innerText = '提交保存';
            submiting.addEventListener('click',submit)
        }
    });
    const obj = {}
    //判断是不是都选中了如果是,返回true,否则返回false
    function _isAllSelect(){
        return newAllItemCheck.every(i=>i.children[0].className==='isActive');
    }
    newAllItemCheck.forEach(element => {
        if(element.children[0].className === 'active'){
            obj[element.nextElementSibling.children[0].innerText] = element.nextElementSibling.children[1].innerText
        }
    });
    if(!_isAllSelect(newAllItemCheck)){//obj里面存放的是没有记下来的单词
        // console.log(JSON.stringify(obj));//////////

        shortSendWordObj(wordObj,obj);
    }else{//都记下来了
        // console.log('都会了');///////////
       
        // MainSendWordObj(wordObj)
    }
}
$('.submit').addEventListener('click',submit);
