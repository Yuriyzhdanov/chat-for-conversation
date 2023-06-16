let currentNickname;
const userList = [];
const stopWords = [
  'баклажан',
  'огурец',
  'помидор',
  'лук',
]

function generateSysMsgLine() {
  const div = document.createElement("div");
  const iSys = document.createElement("i");
  const spanEnter = document.createElement("span");
  const b = document.createElement("b");
  iSys.innerHTML = "{system} ";
  spanEnter.innerHTML = " joined the chat.";
  b.innerHTML = currentNickname;
  div.appendChild(iSys);
  div.appendChild(b);
  div.appendChild(spanEnter);
  return div;
}

function generateUserMsgLine(text) {
  const div = document.createElement("div");
  const span = document.createElement("span");
  const message = `<b>[${currentNickname}]:</b> ${text}`;
  div.appendChild(span);
  div.classList.add("message-line");
  span.innerHTML = message;
  return div;
}

function readMessage() {
  const inputElem = document.querySelector("#chat-input");
  const message = inputElem.value;
  inputElem.value = "";
  return message;
}

function readUserName() {
  const inputElem = document.querySelector("#username");
  const username = inputElem.value;
  inputElem.value = "";
  return username;
}

function isUserExist(username) {
  return userList.includes(username);
}

function addUser() {
  currentNickname = readUserName();
  const censoredNickname = censoredArray(currentNickname);
  const isExist = isUserExist(censoredNickname);
  if (!isExist) {
    userList.push(censoredNickname);
    console.log("censoredNickname",censoredNickname);
    console.log('currentNickname',currentNickname);
    
    // currentNickname = censoredNickname;  ????????????
  }
  return isExist;
}

function renderChatFlow(type, text) {
  const chatFlow = document.querySelector(".chat-flow");
  let msgLine;
  if (type === "user") {
    msgLine = generateUserMsgLine(text);
  } else if (type === "system") {
    msgLine = generateSysMsgLine();
  }
  chatFlow.appendChild(msgLine);
}

function onLoginClickHandler() {
  const isExist = addUser();
  if (!isExist) {
    renderChatFlow("system", "");
    renderNicknameList();
  }
  censoredArray(currentNickname); 
}


function onSendClickHandler() {
  const message = readMessage();
  const censored = censoredArray(message)
  renderChatFlow("user", censored);
}

function onPingHandler(e) {
  const pingUser = e.target.children[0].innerHTML;
  const message = readInputMessage();
  const newMsg = concatPing(pingUser, message);
  writeInputMessage(newMsg);
  const inputElem = document.querySelector("#chat-input");
  inputElem.focus();
}

function censoredArray(sourceText) {
  let result = sourceText
  for(let i = 0; i < stopWords.length; i++) {
    const r = new RegExp(stopWords[i], 'gi')
    result = result.replace(r, '***')
  }
  if (sourceText !== result) {
    // reportModerator(currentUserName, sourceText)
  }

  return result
}

function concatPing(pingName, message) {
  return `@${pingName}: ${message}`;
}

function readInputMessage() {
  const inputElem = document.querySelector("#chat-input");
  const msg = inputElem.value
  inputElem.value = ''
  return msg 
}

function writeInputMessage(text) {
  const inputElem = document.querySelector("#chat-input");
  inputElem.value = text
}

function generateUserNickname(nick) {
  const div = document.createElement('div')
  const b = document.createElement('b')
  div.onclick = onPingHandler
  div.appendChild(b)
  b.innerHTML = nick
  return div
}

function renderNicknameList() {
  const userElem = generateUserNickname(currentNickname)
  const nicknameList = document.querySelector('#nickname-list')
  nicknameList.appendChild(userElem)
}

function onMessageEnter(e) {
  if (e.key === 'Enter') {
    onSendClickHandler();
  }
}

const loginButton = document.querySelector("#login");
loginButton.onclick = onLoginClickHandler;

const sendButton = document.querySelector("#send-btn");
sendButton.onclick = onSendClickHandler;

document.body.onkeydown = onMessageEnter;





