const submitBtn = document.getElementById('submit');
const inputForm = document.getElementById('input-form');
const message = document.getElementById('text-input');
const ul = document.querySelector('section#chat-message-section ul');
const socket = io("http://localhost:5000");

var activeGroupId = null;
var interval;

document.addEventListener('DOMContentLoaded', async (e) => {
    getAllGroups();
    document.querySelector('#open-add-group').addEventListener('click',createGroupModal);
    //typing.... functionality

    document.querySelector('#chat-input').addEventListener('input',e=>{
        const currentUserName = localStorage.getItem('name');
        socket.emit('user typing',{user:currentUserName});
    })
})

async function getAllGroups(searchText = ""){
    const token = localStorage.getItem('token');
    console.log(token)
    const allGroups = await axios.get('http://localhost:5000/get-all-groups', { headers: { 'Authorization': token } });
    document.getElementById('chats').innerHTML='';
    displayGroups('-1', "AI Chatbot");
    allGroups.data.groups.forEach(grp => {
        if(grp.groupName.includes(searchText)){
            displayGroups(grp.id, grp.groupName);
            console.log(grp.id, grp.groupName)
        }
    })
}


async function getAllMessages(groupId, groupName) {
    document.getElementById('current-chat').innerText=groupName;
    const limit = 20;
    const token = localStorage.getItem('token');
    const oldmessages = JSON.parse(localStorage.getItem(`msgs${groupId}`)) || [];
    let lastid = 0;

    if (oldmessages.length > 0) {
        lastid = oldmessages[oldmessages.length - 1].id;
    }

    try {
        const res = await axios.get(`http://localhost:5000/get-all-chats?msgid=${lastid}&groupid=${groupId}`, { headers: { 'Authorization': token } });
        console.log(res.data)
        ul.innerHTML = "";
        const newMessages = res.data.msg;
        if (oldmessages) {
            allmsg = [...oldmessages, ...newMessages];
        }
        else {
            allmsg = [...newMessages]; 
        }
        if (limit < allmsg.length) {
            allmsg = allmsg.splice(allmsg.length - limit);
        }
        localStorage.setItem(`msgs${groupId}`, JSON.stringify(allmsg));
        for (let i = 0; i < allmsg.length; i++) {
            displayOnScreen(allmsg[i].message, allmsg[i].user.name);
        }
    } catch (err) {
        console.log(err)
        // alert(err.response.data.message);
    }

}

function displayOnScreen(msg, name) {
    let currentUserName = localStorage.getItem('name');
    const li = document.createElement('li');
    if(currentUserName===name){
        li.classList.add('self');
    }
    li.innerHTML = `<span>${name}</span> ${msg}`;
    ul.appendChild(li);
};

// const createGroupForm = document.getElementById('create-gc-form');
// const createGroupBtn = document.getElementById('gc-name-sub');
// const groupName = document.getElementById('gc-name');
// const userList = document.getElementById('user-list');
// createGroupForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     console.log(groupName.value)
//     if(groupName.value){
//         const token = localStorage.getItem('token');
//         try {
//             const obj = {
//                 groupName: groupName.value
//             };
//             const res = await axios.post('http://localhost:5000/create-group', obj, { headers: { 'Authorization': token } });
//             groupName.value="";
//             // displayGroups(res.data.groupId, groupName.value);

//             res.data.users.forEach(result => {
//                 displayUsers(result, res.data.groupId);
//             });
//         } catch (err) {
//             console.log(err);
//             alert(err.response.data.message);
//         }
//     }else{
//         alert("Please enter a group name");
//     }
  

// });

function createGroupModal(){
    document.querySelector('section#modal').innerHTML=`  <div class="create-group-modal">
        <div class="modal-container">
            <button class="modal-close close" id="close-create-group"><i class="fa-solid fa-xmark"></i></button>
            <form id="create-gc-form">
                <div class="mb-3">
                <label class="form-label">Enter group name</label>
                <input id="gc-name" type="text" class="form-control" aria-describedby="groupnameHelp">
                </div>
                <button id="gc-name-sub" type="submit" class="btn btn-primary">Submit</button>
            </form>
            <div class="user-list-container">
                <ul id="user-list"></ul>
            </div>
        </div>
    </div>`;
    const createGroupForm = document.getElementById('create-gc-form');
    const createGroupBtn = document.getElementById('gc-name-sub');
    const groupName = document.getElementById('gc-name');
    const userList = document.getElementById('user-list');
    const modalContainer = document.querySelector('.modal-container');
    document.querySelector('.modal-container .close').addEventListener('click',function(e){
        document.getElementById('modal').innerHTML="";
        console.log("lol?")
    })
    createGroupForm.addEventListener('submit',async e=>{
        e.preventDefault();
        console.log(groupName.value)
        if(groupName.value){
            const token = localStorage.getItem('token');
            try {
                const obj = {
                    groupName: groupName.value
                };
                const res = await axios.post('http://localhost:5000/create-group', obj, { headers: { 'Authorization': token } });
                groupName.value="";
                // displayGroups(res.data.groupId, groupName.value);
                modalContainer.innerHTML=`<button class="modal-close close" id="close-create-group"><i class="fa-solid fa-xmark"></i></button>
                <ul id="user-list"></ul>
                <button class="btn btn-danger close" id="gc-done">Done</button>`;
                res.data.users.forEach(result => {
                    displayUsers(result, res.data.groupId);
                });
                document.querySelector('.modal-container .close').addEventListener('click',function(e){
                    document.getElementById('modal').innerHTML="";
                })
                document.getElementById('gc-done').addEventListener('click',e=>{
                    document.getElementById('modal').innerHTML="";
                    window.location.reload();
                })
            } catch (err) {
                console.log(err);
                alert(err.response.data.message);
            }
        }else{
            alert("Please enter a group name");
        }
    })
}
// createGroupModal()

function displayUsers(res, groupId) {
    const token = localStorage.getItem('token');
    const userList = document.getElementById('user-list');
    const li = document.createElement('li');
    li.innerText = res.name;
    const addMemberBtn = document.createElement('button');
    addMemberBtn.className="btn btn-primary";
    addMemberBtn.innerText = 'Add';

    addMemberBtn.addEventListener('click', async (e) => {
        e.preventDefault()
        const obj = {
            userId: res.id,
            groupId: groupId
        }
        console.log(addMemberBtn)
        try {
            await axios.post('http://localhost:5000/add-member', obj, { headers: { 'Authorization': token } })
            addMemberBtn.disabled=true;
        } catch (err) {
            console.log(err)
        }
    });
    li.appendChild(addMemberBtn);
    userList.appendChild(li);
}

function displayGroups(groupId, groupName) {
    const chats = document.getElementById('chats');
    let chatList = JSON.parse(localStorage.getItem(`msgs${groupId}`)) ?? [];
    let lastText="";
    if(chatList.length>0){
        lastText=chatList[chatList.length-1].message;
    }
    let chat = document.createElement('div');
    chat.className='col user-section shallow-border-bottom';
    chat.innerHTML=` <div class="row">
        <div class="col-2 d-flex align-items-center justify-content-center">
            <div class="gradient-circle gradient-dark user-icon">
                <img src="../assets/user_pictures/boi-2.jpg" alt="Profile icon">
            </div>
        </div>
        <div class="col user-desc">
            <h2 class="user-name">${groupName}</h2>
            <p>${groupId==-1 ? "Hi! How can i help you?" : lastText}</p>
        </div>
    </div>`;
    chat.addEventListener('click', (e) => {
        getAllMessages(groupId, groupName);
        activeGroupId = groupId;
        toggleScreen();
        console.log(groupId);
    });
    chats.appendChild(chat)
}

function addMessage() {
    document.querySelector('.chat-group-input form#send-message').addEventListener('submit', async (e) => {
        e.preventDefault();
        let groupId = activeGroupId;
        const message = document.querySelector('form#send-message input');
        console.log(groupId)
        if(groupId == -1){
            return generateSolution(message.value);
        }
        else{
            if (message.value && activeGroupId) {
                const token = localStorage.getItem('token');
                const obj = { message: message.value, groupId: groupId };
                try {
                    const res = await axios.post('http://localhost:5000/send-message', obj, { headers: { "Authorization": token } });
                    socket.emit('chat message',{...obj,username:res.data.name});
                    message.value="";
                } catch (err) {
                    alert(err.response.data.message);
                };
            } else {
                alert('Please type a message');
    
            }
        }
       

    });
}

addMessage();


//Handle Manage Chat users

const manageChatBox = document.querySelector('#manage-chat');
function openManageBox(){
    manageChatBox.style.display='block';
}
function closeManageBox(){
    manageChatBox.innerHTML=`<div class="relative">
        <button id="close-manage-chat" class="icon-white-button">
            <i class="fa-solid fa-xmark"></i>
        </button>
        <table></table>
    </div>`;
    manageChatBox.style.display='none';
}
document.querySelector('#close-manage-chat').addEventListener('click',e=>{
    closeManageBox();
})
window.addEventListener('click',e=>{
    if(!manageChatBox.contains(e.target) && 
        manageChatBox.querySelector('table').innerHTML!==""
    ){
        closeManageBox();
    }
})

const manageButton = document.getElementById('settings-chat');

manageButton.addEventListener('click', async (e) => {
    const token = localStorage.getItem('token');
    try {
        const res = await axios.get(`http://localhost:5000/get-members?groupId=${activeGroupId}`, { headers: { "Authorization": token } });
        res.data.members.forEach((result)=>{
            displayMembers(result);
        });
        openManageBox();
    } catch (err) {
        console.log(err)
    }
})

function displayMembers(res) {
    const token=localStorage.getItem('token');
    const currentUsername  = localStorage.getItem('name');
    const table = document.querySelector('#manage-chat table');
    const tr = document.createElement('tr');
    let td1 =document.createElement('td');
    let td2 =document.createElement('td');
    let td3 =document.createElement('td');
    td1.innerText = res.name;
    const admin = document.createElement('button');
    const remove = document.createElement('button');
    if(res.name === currentUsername){
        admin.disabled=true;
        remove.disabled=true;
    }
    admin.innerHTML = '<img width="48" height="48" src="https://img.icons8.com/color-glass/48/add-administrator.png" alt="add-administrator"/>';
    remove.innerHTML = '<i class="fa-solid fa-trash"></i>';
    td2.appendChild(admin);
    td3.appendChild(remove);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    table.appendChild(tr);
    admin.addEventListener('click', async (e) => {
        let obj = {
            id: res.id,
            groupId: activeGroupId
        }
        try{
           const res= await axios.post('http://localhost:5000/make-admin', obj, { headers: { 'Authorization': token } });
            alert(res.data.message);
        }catch(err){
            alert(err.response.data.message);
        }
    });
    remove.addEventListener('click',async (e)=>{
        try{
            const response=await axios.delete(`http://localhost:5000/remove-member?id=${res.id}&groupId=${activeGroupId}`,
        { headers: { 'Authorization': token } });
            alert(response.data.message);
            manageButton.click()
        }catch(err){
            console.log(err);
            alert(err.response.data.message);
        }
        

    })
};


//Handle screen change> chat list to single chat screen and vice verca

var chatListActive=true;
function toggleScreen(){
    var screen = document.getElementById('toggle-screen');
    if(chatListActive){
        screen.style.transform='translateX(-100%)';
        chatListActive=false;
    }
    else{
        screen.style.transform='translateX(0%)';
        chatListActive=true;
    }
}
document.querySelector('#back-to-chats').addEventListener('click',toggleScreen);

//search chats
const searchChatForm = document.getElementById('search-chat-form');
searchChatForm.addEventListener('submit',e=>{
    e.preventDefault();
    const input = searchChatForm.querySelector('#search-chat');
    getAllGroups(input.value);
})



//AI integration
// Function to generate a solution using the OpenAI API
async function generateSolution(prompt) {
    let username = localStorage.getItem('name');
    displayOnScreen(prompt, username);
    const apiKey = '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';
    if(prompt.toLowerCase()==='hi'){
        return displayOnScreen("Hello! How can I help you?", 'AI Chatbot');
    }
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/completions',
        {
         "model": "text-davinci-003",
          prompt,
          max_tokens: 100,
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );
      console.log(response.data.choices[0].text.trim());
      displayOnScreen(response.data.choices[0].text.trim(), 'AI Chatbot');
    } catch (error) {
      console.error('An error occurred:', error);
    }
    // try {
    //     const response = await axios.post(
    //       'https://api.openai.com/v1/chat/completions',
    //       {
    //         "model": "gpt-3.5-turbo",
    //         max_tokens: 100,
    //         temperature: 0.7,
    //         top_p: 1,
    //         frequency_penalty: 0,
    //         presence_penalty: 0
    //       },
    //       {
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'Authorization': `Bearer ${apiKey}`
    //         }
    //       }
    //     );
    //       console.log(response)
    //     console.log(response.data.choices[0].text.trim());
    //   } catch (error) {
    //     console.error('An error occurred:', error);
    //   }
  }
  



socket.on("connect", () => {
    console.log(socket.id); 
  });
  
  socket.on("chat message", (obj)=>{
    console.log("Recieved message", obj)
    const {message, username} = obj;
    displayOnScreen(message, username);
  })

  socket.on("user typing", (obj) => {
    const currentUserName = localStorage.getItem('name');
    if(obj.user!=currentUserName){
        const typingSpan = document.getElementById('typing');
        typingSpan.style.display='block';
        setTimeout(function(){
            typingSpan.style.display='none';
        },500);
    }
  });

  socket.on("disconnect", () => {
    console.log(socket.id); 
  });
