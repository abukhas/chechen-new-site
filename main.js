const chatBox = document.getElementById("chat");
const input = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const voiceBtn = document.getElementById("voiceBtn");

sendBtn.onclick = sendMessage;
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  appendMessage(text, "user");
  input.value = "";

  fetch("https://chechen-ai-server.onrender.com/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text })
  })
    .then(res => res.json())
    .then(data => {
      appendMessageTyping(data.response, "ai");
    })
    .catch(err => appendMessage("Ошибка подключения к AI", "ai"));
}

function appendMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = "message " + sender;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendMessageTyping(text, sender) {
  const msg = document.createElement("div");
  msg.className = "message " + sender;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  let i = 0;
  const interval = setInterval(() => {
    msg.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 20);
}

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "ru-RU";
recognition.continuous = false;
recognition.interimResults = false;

voiceBtn.addEventListener("click", () => {
  recognition.start();
});

recognition.onresult = (e) => {
  const transcript = e.results[0][0].transcript;
  input.value = transcript;
};