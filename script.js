let currentNickname;

const userList = [];
const stopWords = ["баклажан", "огурец", "помидор", "лук"];

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
  const filteredTag = censoredTag(text);
  const message = `<b>[${currentNickname}]:</b> ${filteredTag}`;
  div.appendChild(span);
  div.classList.add("message-line");
  span.innerHTML = message;
  return div;
}


function readUserName() {
  const inputElem = document.querySelector("#username");
  const username = inputElem.value;
  inputElem.value = "";
  return username;
}

function readInputMessage() {
  const inputElem = document.querySelector("#chat-input");
  const msg = inputElem.value;
  inputElem.value = "";
  return msg;
}

function isUserExist(username) {
  const result = userList.includes(username);
  if (!result) {
    userList.push(username);
  }
  return result;
}

function addUser() {
  currentNickname = readUserName();
  const censoredNickname = censoredArray(currentNickname);
  const isExist = isUserExist(currentNickname);
  currentNickname = censoredNickname;
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
  if (message.trim() !== "") {
    const censored = censoredArray(message);
    renderChatFlow("user", censored);
  }
}

function onPingHandler(e) {
  const pingUser = e.target.children[0].innerHTML;
  const message = readInputMessage();
  const newMsg = concatPing(pingUser, message);
  writeInputMessage(newMsg);
  const inputElem = document.querySelector("#chat-input");
  inputElem.focus();
}

function fillStars(text) {
  let len = text.length;
  let star = "*";
  let result = "";

  for (let i = 0; i < len; i++) {
    result = result + star;
  }

  return result;
}

function censoredArray(sourceText) {
  let result = sourceText;
  for (let i = 0; i < stopWords.length; i++) {
    const r = new RegExp(stopWords[i], "gi");
    const stars = fillStars(stopWords[i])
    result = result.replace(r,stars);
  }
  if (sourceText !== result) {
    // reportModerator(currentUserName, sourceText)
  }
  return result;
}

function censoredTag(tag) {
  const tagRegex = /<[^>]+>/g;
  return tag.replace(tagRegex, "");
}

function concatPing(pingName, message) {
  return `@${pingName}: ${message}`;
}

function writeInputMessage(text) {
  const inputElem = document.querySelector("#chat-input");
  inputElem.value = text;
}

function generateUserNickname(nick) {
  const div = document.createElement("div");
  const b = document.createElement("b");
  div.onclick = onPingHandler;
  div.appendChild(b);
  b.innerHTML = nick;
  return div;
}

function renderNicknameList() {
  const censoredNickname = censoredArray(currentNickname);
  const userElem = generateUserNickname(censoredNickname);
  const nicknameList = document.querySelector("#nickname-list");
  nicknameList.appendChild(userElem);
}

function onMessageEnter(e) {
  if (e.key === "Enter") {
    onSendClickHandler();
  }
}


const loginButton = document.querySelector("#login");
loginButton.onclick = onLoginClickHandler;

const sendButton = document.querySelector("#send-btn");
sendButton.onclick = onSendClickHandler;

document.body.onkeydown = onMessageEnter;
