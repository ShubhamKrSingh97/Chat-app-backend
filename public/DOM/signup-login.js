var loginForm = document.getElementById('login');
var regForm = document.getElementById('register');
var toggleBtn = document.getElementById('btn');
var toggleLogin = document.getElementById('toggle-login');
var toggleRegister = document.getElementById('toggle-register');
var forgotPassForm = document.getElementById('forgot-pass');
var forgotPassBtn = document.getElementById('forgot');
var forgotPassSubBtn = document.getElementById('forgot-sub-btn');
//------------login and registration form toggling-----------//

let toggles = Array.from(document.querySelectorAll('.toggle'));
toggles.forEach(toggle=>{
    toggle.addEventListener('click',e=>{
        toggles.forEach(toggle=>{
            toggle.classList.toggle('active')
        })
    })
})

toggleRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.left = '-400px';
    regForm.style.left = '50px';
    toggleBtn.style.left = '110px';
    forgotPassForm.style.left = '450px';
});

toggleLogin.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.style.left = '50px';
    regForm.style.left = '450px';
    toggleBtn.style.left = '0px';
    forgotPassForm.style.left = '450px';
});

//--------------registration----------------//

const regEmail = document.getElementById('reg-email');
const regName = document.getElementById('reg-name');
const regPhone = document.getElementById('reg-phone');
const regPassword = document.getElementById('reg-pass');
const checkBox = document.getElementById('check');

regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (regEmail.value && regName.value && regPassword.value && regPhone.value) {
        let obj = {
            name: regName.value,
            email: regEmail.value,
            phone: regPhone.value,
            pass: regPassword.value
        };
        try {
           const res= await axios.post("/add-user", obj);
            regEmail.value = "";
            regName.value = "";
            regPhone.value="";
            regPassword.value = "";
            checkBox.checked = false;
            alert(res.data.message);
        }
        catch (err) {
           alert(err.response.data.message);
        }

    }
    else {
        alert("Please fill in all the details");
    }
});

//-------------login--------------------------//
const loginEmail=document.getElementById('login-email');
const loginPass=document.getElementById('login-pass');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (loginEmail.value && loginPass.value) {
        obj = {
            pass: loginPass.value,
            email: loginEmail.value
        }
        try {
            const res = await axios.post(`/user-login`, obj);
            localStorage.setItem('name',res.data.name);
            localStorage.setItem('token',res.data.token);
            window.location.href="/home"
            alert(res.data.message);
        } catch (err) {
            alert(err.response.data.message);
        }
    }
    else {
            alert("Please fill in all the details");
    }

});
