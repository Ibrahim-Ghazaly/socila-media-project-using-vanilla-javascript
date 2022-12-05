// import axios from "axios";

let posts = document.getElementById("posts");
let closeLoginBtn = document.getElementById("closeLoginBtn");
let closeRegisterBtn =document.getElementById("closeRegisterBtn");
let closeCreatePostBtn =document.getElementById("closeCreatePostBtn");
let loginBtn = document.getElementById("login-btn");
let registerBtn = document.getElementById("register-btn");
let logOut =document.getElementById("logout-btn");
let user = document.querySelector(".user");
let userImg =document.querySelector(".user img");
let userInfo =document.querySelector(".user span");
let addPostBtn =document.querySelector("#add-post");

console.log(user)
console.log(userImg)
console.log(userInfo)

let lastbage =1
let countpage=1;
// infinite scrolling 
window.addEventListener("scroll", function(){

  console.log(countpage)
  console.log(lastbage)

  const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

  if(endOfPage && countpage < lastbage){
    console.log(countpage++)
    getAllPosts(countpage++)
  }
});
// get all posts from API function 

console.log(countpage)
console.log(lastbage)

function getAllPosts (numOfPage){

    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      

      fetch(`https://tarmeezacademy.com/api/v1/posts?limit=3&page=${numOfPage}`, requestOptions)
        .then(response => response.json())
        .then(result =>{
            console.log(result)
            lastbage = result.meta.last_page;
            showPosts(result.data)

        })
        .catch(error => console.log('error', error));
}
getAllPosts()

// show posts function 

function showPosts(data){
    data.forEach(post => {
        
        posts.innerHTML +=`
        <div class="card shadow mb-3"  >
        <div class="card-header">
            <img src="${post.author.profile_image}"  alt="..." style="width:40px;height:40px" class="rounded-circle border border-2">
            <b>${post.author.name}</b>
        </div>
        
        <div class="card-body" onclick="savePostInLocalStorage(${post})">
            <img src="${post.image}" class="w-100">
          <h6 style="color:rgb(168, 165, 165)" class="mt-1">${post.created_at}</h6>
          <h5>Hello World</h5>
          <p>${post.body}</p>
          <hr>
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill" viewBox="0 0 16 16">
                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z"/>
              </svg>
              <span>(${post.comments_count}) Comments</span>
              ${
                (() =>{
                  if(post.tags.length > 0){
                  return  ` 
                     ${post.tags.map((element)=>{
                       
                   return   ` <span class="bg-secondary text-white pt-1 pb-1 ps-2 pe-2 rounded-4">${element.name}</span>`
                     }).join(" ")}
                  
                  `
                 
                  }else{
                      return ""
                  }
                })()  
            } 
          </div>
        </div>
    </div>`
    });
}

// post Details function 

function savePostInLocalStorage(p){
   
  console.log(p.author.name)
}

// getCurrentuser function 
function getCurrentUser(){

   let user = null;
    let userStorage = localStorage.getItem("user");
   if(userStorage != null ){
     user =JSON.parse(userStorage)
   }
   return user;
}

console.log(getCurrentUser())

// console.log(getCurrentUser)

// register function 

function registerBtnClicked(){


  let nameInpt     = document.getElementById("Name-register").value;
  let userNameInpt = document.getElementById("userName-register").value;
  let passwordInpt = document.getElementById("password-register").value;
  let profile_image =document.getElementById("upload-image");

console.log(profile_image.files[0])

// let token=localStorage.getItem("token");

let formData = new FormData()
formData.append("name",nameInpt)
formData.append("username",userNameInpt)
formData.append("password",passwordInpt)
formData.append("image",profile_image.files[0])



let headers ={
   "Content-Type":"multipart/form-data",
}

  // let params = {"name":nameInpt,"username":userNameInpt,"password":passwordInpt,"image":profile_image.files[0]}

   axios.post("https://tarmeezacademy.com/api/v1/register",formData,{
     headers:headers
   }).then((res)=>{


     console.log(res)
 

     localStorage.setItem("token",res.data.token)
     localStorage.setItem("user",JSON.stringify(res.data.user))
     closeRegisterBtn.click();
     setUI();
     showAlert("You are registerd successfully","success")

  
   }).catch((err)=>{
     console.log(err)
     showAlert(err.response.data.message,"danger")
   })

}



// login function 

function loginBtnClicked(){
    let userName = document.getElementById("userName").value;
    let password = document.getElementById("password").value;

  
    let params = {"username":userName,"password":password}

     axios.post("https://tarmeezacademy.com/api/v1/login",params).then((res)=>{
       console.log(res)

       

       localStorage.setItem("token",res.data.token)
       localStorage.setItem("user",JSON.stringify(res.data.user))

     
       closeLoginBtn.click();
       setUI();
       showAlert("You are logged in successfully!")

    
     }).catch((err)=>{
      console.log(err.response.data.message)
      showAlert(err.response.data.message,"danger")
    })

}



// show alert function 

function showAlert(customeMsg,type = 'success'){

  const alertPlaceholder = document.getElementById('success-alert')

const alert = (message, type) => {
  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" id="btn-close-alert" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  alertPlaceholder.append(wrapper)
}


    alert(customeMsg, type);
    setTimeout(()=>{
      // const alertHide = bootstrap.Alert.getOrCreateInstance('#success-alert')
      // alertHide.close()
      document.getElementById("btn-close-alert").click();
    },2000)
    
 

}


// setUI function 


function setUI(){


  let token = localStorage.token;
      if(token != null){
        loginBtn.style.display="none";
        registerBtn.style.display="none";
        logOut.style.display="block";
        user.style.display="block";
        addPostBtn.style.display="flex"

        let userData = getCurrentUser()
        userImg.src=userData.profile_image;
        userInfo.innerHTML=userData.name;  

      }else{
        loginBtn.style.display="block";
        registerBtn.style.display="block";
        logOut.style.display="none";
        user.style.display="none";
        addPostBtn.style.display="none"

      }

}

setUI();

// logout function 

logOut.addEventListener("click",function(){
  console.log("hello")
   localStorage.removeItem("token");
   localStorage.removeItem("user");
   setUI();
   showAlert("You are logged out successfully!",'success')

  
})


// craete new post 

function createNewPostClicked(){
  
  let postTitle = document.getElementById("post-title-input").value;
  let postBody = document.getElementById("post-body-input").value;
  let postImage = document.getElementById("post-image-input").files[0];
  let token=localStorage.getItem("token");

  let formData = new FormData()
  formData.append("title",postTitle)
  formData.append("body",postBody)
  formData.append("image",postImage)

  
  const headers ={
     "Content-Type":"multipart/form-data",
     "authorization":`Bearer ${token}`
  }

   axios.post("https://tarmeezacademy.com/api/v1/posts",formData,{
     headers:headers
   }).then((res)=>{
     console.log(res)
     closeCreatePostBtn.click();
    //  setUI();
     showAlert("New post has been created successfully!",'success')
     showPosts()
  
   }).catch((err)=>{
 
    if(err){
         console.log(err.response.data.message)
        showAlert(err.response.data.message,"danger")
    }
  })

}