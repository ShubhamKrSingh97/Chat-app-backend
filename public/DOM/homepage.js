const submitBtn = document.getElementById('submit');
const inputForm = document.getElementById('input-form');
const message = document.getElementById('text-input');
const ul = document.getElementById('messages-list');

inputForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (message.value) {
        const token = localStorage.getItem('token');
        const obj = { message: message.value };
        try {
            const res = await axios.post('http://localhost:5000/send-message', obj, { headers: { "Authorization": token } });
            displayOnScreen(res.data.message, res.data.name);
        } catch (err) {
            alert(err.response.data.message);
        };
    } else {
        alert('Please type a message');
    }

});

document.addEventListener('DOMContentLoaded', async (e) => {
    const limit = 10;
    const token = localStorage.getItem('token');
    const oldmessages = JSON.parse(localStorage.getItem('msgs'));
    let lastid = 0;
    setInterval(async () => {
        if (oldmessages.length > 0) {
            lastid = oldmessages[oldmessages.length - 1].id;
        }

        try {
            const res = await axios.get(`http://localhost:5000/get-all-chats?msgid=${lastid}`, { headers: { 'Authorization': token } });
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
            localStorage.setItem('msgs', JSON.stringify(allmsg));
            for (let i = 0; i < allmsg.length; i++) {
                displayOnScreen(allmsg[i].message, allmsg[i].user.name);
            }
        } catch (err) {
            alert(err.response.data.message);
        }
    }, 1000);

})

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
    const token = localStorage.getItem('token');
    try {
        const obj = {
            groupName: groupName.value
        };
        const res = await axios.post('http://localhost:5000/create-group', obj, { headers: { 'Authorization': token } });
        console.log(res);
        res.data.users.forEach(result => {
            displayUsers(result,res.data.groupId);
        });
    } catch (err) {
        console.log(err);
        alert(err.response.data.message);
    }

});

function displayUsers(res,groupId) {
    const token=localStorage.getItem('token');
    const userList = document.getElementById('user-list');
    const li = document.createElement('li');
    li.innerText = res.name;
    const addMemberBtn = document.createElement('button');
    addMemberBtn.innerText = 'Add';
    li.appendChild(addMemberBtn);
    userList.appendChild(li);
    addMemberBtn.addEventListener('click', async (e) => {
        const obj={
            userId:res.id,
            groupId: groupId
        }
        try{
           await axios.post('http://localhost:5000/add-member',obj, { headers: { 'Authorization': token } })
        }catch(err){
            console.log(err);
        }
    });
}