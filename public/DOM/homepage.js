const submitBtn = document.getElementById('submit');
const inputForm = document.getElementById('input-form');
const message = document.getElementById('text-input');
const ul = document.getElementById('messages-list');

var activeGroupId = null;

document.addEventListener('DOMContentLoaded', async (e) => {
    const token = localStorage.getItem('token');
    const allGroups = await axios.get('http://localhost:5000/get-all-groups', { headers: { 'Authorization': token } });
    allGroups.data.groups.forEach(grp => {
        displayGroups(grp.id, grp.groupName);
    })
})

var interval;

function getAllMessages(groupId) {
    const limit = 20;
    const token = localStorage.getItem('token');
    const oldmessages = JSON.parse(localStorage.getItem(`msgs${groupId}`)) || [];
    let lastid = 0;
    if (interval) {
        clearInterval(interval)
    }
    interval = setInterval(async () => {
        if (oldmessages.length > 0) {
            lastid = oldmessages[oldmessages.length - 1].id;
        }

        try {
            const res = await axios.get(`http://localhost:5000/get-all-chats?msgid=${lastid}&groupid=${groupId}`, { headers: { 'Authorization': token } });
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
            alert(err.response.data.message);
        }
    }, 6000);

}

function displayOnScreen(msg, name) {
    const li = document.createElement('li');
    li.innerText = `${name} ${msg}`;
    ul.appendChild(li);
};

const createGroupForm = document.getElementById('create-gc-form');
const createGroupBtn = document.getElementById('gc-name-sub');
const groupName = document.getElementById('gc-name');
const userList = document.getElementById('user-list');
createGroupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(groupName.value){
        const token = localStorage.getItem('token');
        try {
            const obj = {
                groupName: groupName.value
            };
            const res = await axios.post('http://localhost:5000/create-group', obj, { headers: { 'Authorization': token } });
            groupName.value="";
            displayGroups(res.data.groupId, groupName.value);
            res.data.users.forEach(result => {
                displayUsers(result, res.data.groupId);
            });
        } catch (err) {
            console.log(err);
            alert(err.response.data.message);
        }
    }else{
        alert("Please enter a group name");
    }
  

});

function displayUsers(res, groupId) {
    const token = localStorage.getItem('token');
    const userList = document.getElementById('user-list');
    const li = document.createElement('li');
    li.innerText = res.name;
    const addMemberBtn = document.createElement('button');
    addMemberBtn.innerText = 'Add';
    li.appendChild(addMemberBtn);
    userList.appendChild(li);
    addMemberBtn.addEventListener('click', async (e) => {
        const obj = {
            userId: res.id,
            groupId: groupId
        }
        try {
            await axios.post('http://localhost:5000/add-member', obj, { headers: { 'Authorization': token } })
            alert(res.data.message);
        } catch (err) {
            alert(err.response.data.message);
        }
    });
}

function displayGroups(groupId, groupName) {
    const ul = document.getElementById('gc-list');
    const li = document.createElement('li');
    const group = document.createElement('button');
    group.innerText = groupName;
    li.appendChild(group);
    ul.appendChild(li);
    group.addEventListener('click', (e) => {
        getAllMessages(groupId);
        activeGroupId = groupId;
    });
}

function addMessage() {
    inputForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        let groupId = activeGroupId;
        if (message.value) {
            const token = localStorage.getItem('token');
            const obj = { message: message.value, groupId: groupId };
            try {
                const res = await axios.post('http://localhost:5000/send-message', obj, { headers: { "Authorization": token } });
                displayOnScreen(res.data.message, res.data.name);
                message.value="";
            } catch (err) {
                alert(err.response.data.message);
            };
        } else {
            alert('Please type a message');

        }

    });
}

addMessage();

const manageButton = document.getElementById('manage-groups');
manageButton.addEventListener('click', async (e) => {
    const token = localStorage.getItem('token');
    try {
        const res = await axios.get(`http://localhost:5000/get-members?groupId=${activeGroupId}`, { headers: { "Authorization": token } });
        res.data.members.forEach((result)=>{
            displayMembers(result);
        });
    } catch (err) {
        alert(err.response.data.message);
    }
})

function displayMembers(res) {
    const token=localStorage.getItem('token');
    const ul = document.getElementById('manage-members');
    const li = document.createElement('li');
    li.innerText = res.name;
    const admin = document.createElement('button');
    const remove = document.createElement('button');
    admin.innerText = "Make Admin";
    remove.innerHTML = "Remove";
    li.appendChild(admin);
    li.appendChild(remove);
    ul.appendChild(li);
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
        }catch(err){
            console.log(err);
            alert(err.response.data.message);
        }
        

    })
};