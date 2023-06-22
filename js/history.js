(async()=>{
    async function init(){
        const history = await respUserInfo();
        if(!history){
            alert('还没有任何记录,请返回首先录入');
            location.href = './memory.html';
            console.log('gf');
            return;
        }
        const newHistory = history.map(i=>({
        content:i.content,
        curTime:i.createdAt
        })).map(i=>([JSON.parse(i.content),i.curTime])).map(i=>({
            word:{
                ...i[0].word
            },
            last:{
                ...i[0].last
            },
            curTime:i[1]
        }))
        for (let i = 0; i < newHistory.length; i++) {
            if(Object.keys(newHistory[i].last).length!==0){//有没有背的
                lastOutInit(newHistory[i].last);
            }else{//没有没有背的(都背完了)
                wordOutInit(newHistory[i].word,newHistory[i].curTime)
            }
        }
    }
    init();

    //初始化没有没有背的列表
    function wordOutInit(wordObj,curTime){
        const wordOut = $$$('div');
        wordOut.className = 'wordOut';
        const time = $$$('div');
        time.className = 'curTime';
        time.innerText = formatTime(curTime,true);
        const recover = $$$('div');
        recover.className = 'recover';
        recover.innerText = '恢复数据';
        recover.addEventListener('click',function(){
            //简单的辅助函数(传入一个ul的dom对象,将这个以对象的形式返回到主页面去，并且跳转)
            function _init(dom){
                const obj = {}
                const wordList = dom;
                for (let i = 0; i < wordList.children.length; i++) {
                    const li = wordList.children[i];
                    obj[li.children[0].innerText] = li.children[1].innerText;   
                }
                localStorage.setItem('historyWord',JSON.stringify(obj));
                location.href = './memory.html';
            }
            if(!this.parentElement.nextElementSibling){
                _init(this.nextElementSibling);
            }else{
                if(this.parentElement.nextElementSibling.className==='lastOut'){
                showConfirmMsg({
                    title:'提示信息',
                    content:'请选择是全部恢复还是仅恢复上次没有记下来的',
                    isConfirmText:'all',
                    notConfirmText:'last',
                    container:this.parentElement,
                    isConfirm:()=>{
                        _init(this.nextElementSibling);
                    },
                    notConfirm:()=>{
                        _init(this.parentElement.nextElementSibling.children[1]);
                    }
                })
                }else{
                    _init(this.nextElementSibling);
                }
            }
    })
        wordOut.appendChild(time);
        wordOut.appendChild(recover)
        const ul = $$$('ul');
        ul.className = 'wordList';
        const wordArr = Object.keys(wordObj);
        for (let i = 0; i < wordArr.length; i++) {
            const li = $$$('li');
            const word = $$$('div');
            word.innerText = wordArr[i];
            const translate = $$$('div');
            translate.innerText = wordObj[wordArr[i]];
            li.appendChild(word);
            li.appendChild(translate);
            ul.appendChild(li);
        }
        wordOut.appendChild(ul)
        $('.container').appendChild(wordOut);
    }

    //初始化有没有背的列表
    function lastOutInit(wordObj){
        const lastOut = $$$('div');
        lastOut.className = 'lastOut';
        const title = $$$('div');
        title.className = 'title';
        title.innerText = '没有记下来的：';
        lastOut.appendChild(title);
        const ul = $$$('ul');
        ul.className = 'lastList';
        const wordArr = Object.keys(wordObj);
        for (let i = 0; i < wordArr.length; i++) {
            const li = $$$('li');
            const word = $$$('div');
            word.innerText = wordArr[i];
            const translate = $$$('div');
            translate.innerText = wordObj[wordArr[i]];
            li.appendChild(word);
            li.appendChild(translate);
            ul.appendChild(li);
        }
        lastOut.appendChild(ul);
        $('.container').appendChild(lastOut);
    }  
    $('.memory').addEventListener('click',function(){
        location.href = './memory.html';
    })
})()