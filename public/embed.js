document.addEventListener("DOMContentLoaded", function () {
  const currentScript = document.currentScript;
  const botId = currentScript && currentScript.getAttribute("data-bot-id");

  if (!botId) return;

  const iframe = document.createElement("iframe");
  iframe.src = `https://embeded-chatbot-jet.vercel.app/?botId=${botId}`;
  iframe.style = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 380px;
    height: 520px;
    border: none;
    z-index: 9999;
    border-radius: 16px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
  `;

  document.body.appendChild(iframe);
});
