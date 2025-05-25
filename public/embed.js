(function () {
  const botId = document.currentScript.getAttribute("data-bot-id");

  const iframe = document.createElement("iframe");
  iframe.src = `https://custombot.vercel.app/chat-widget.html?botId=${botId}`;
  iframe.style = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 350px;
    height: 500px;
    border: none;
    z-index: 9999;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
  `;

  document.body.appendChild(iframe);
})();
