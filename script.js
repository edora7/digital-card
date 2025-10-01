document.addEventListener("DOMContentLoaded", () => {

  // QR Code
  new QRious({
    element: document.getElementById("qrcode"),
    value: "https://edora7.github.io/digital-card",
    size: 120,
    background: "white",
    foreground: "#2575fc",
    level: "H"
  });

  // To-Do List
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTask");
  const taskList = document.getElementById("taskList");

  function addTask() {
    const task = taskInput.value.trim();
    if(!task) return;
    const li = document.createElement("li");
    li.textContent = task;

    const del = document.createElement("button");
    del.textContent = "×";
    del.className = "delete-btn";
    del.onclick = () => li.remove();
    li.appendChild(del);

    taskList.appendChild(li);
    taskInput.value = "";
  }

  addTaskBtn.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", e => { if(e.key==="Enter") addTask(); });

  // AI Chat Box
  const chatBtn = document.getElementById("chatBtn");
  const chatBox = document.getElementById("chatBox");
  const closeChat = document.getElementById("closeChat");
  const chatBody = document.getElementById("chatBody");
  const chatInput = document.getElementById("chatInput");
  const sendChat = document.getElementById("sendChat");
  const voiceBtn = document.getElementById("voiceBtn");

  chatBtn.addEventListener("click", () => { chatBox.style.display = "flex"; chatInput.focus(); });
  closeChat.addEventListener("click", () => { chatBox.style.display = "none"; });

  function getBotReply(msg){
    const text = msg.toLowerCase();
    if(text.includes("hello")||text.includes("hi")) return "Hi there! How can I help you today?";
    if(text.includes("name")) return "I am your digital assistant 🤖.";
    if(text.includes("job")||text.includes("work")) return "Edward is a Digital Marketer & Web Developer.";
    if(text.includes("todo")) return "You can add tasks to your To-Do list below 📝.";
    if(text.includes("social")||text.includes("link")) return "Check out the social icons above to connect with me!";
    if(text.includes("help")||text.includes("question")) return "Ask me anything and I will try my best to answer!";
    return "Interesting! I am still learning to answer that. 😄";
  }

  function sendMessage() {
    const msg = chatInput.value.trim();
    if(!msg) return;

    const userMsg = document.createElement("p");
    userMsg.textContent = msg;
    userMsg.className = "user";
    chatBody.appendChild(userMsg);
    chatInput.value="";
    chatBody.scrollTop = chatBody.scrollHeight;

    const botMsg = document.createElement("p");
    botMsg.className = "bot";
    chatBody.appendChild(botMsg);

    const reply = getBotReply(msg);
    let index = 0;
    function typeLetter() {
      if(index < reply.length){
        botMsg.textContent += reply.charAt(index);
        index++;
        chatBody.scrollTop = chatBody.scrollHeight;
        setTimeout(typeLetter, 30);
      }
    }
    setTimeout(typeLetter, 400);
  }

  sendChat.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", e => { if(e.key==="Enter") sendMessage(); });

  // Voice recognition
  let recognition;
  if("webkitSpeechRecognition" in window){
    recognition = new webkitSpeechRecognition();
    recognition.lang="en-US";
    recognition.continuous=false;
    recognition.interimResults=false;
    recognition.onresult = (event)=>{ chatInput.value = event.results[0][0].transcript; chatInput.focus(); };
    recognition.onerror = (event)=>console.log("Speech recognition error:",event.error);
    voiceBtn.addEventListener("click",()=>{ recognition.start(); });
  } else { voiceBtn.disabled=true; voiceBtn.title="Speech recognition not supported"; }

});
