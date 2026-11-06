"use strict";

(() => {
  const dialog = document.getElementById("crypto-dialog");
  const address = document.getElementById("crypto-address");
  const status = document.getElementById("crypto-status");
  const open = document.getElementById("crypto-open");

  open.addEventListener("click", () => {
    status.textContent = "";
    dialog.showModal();
  });

  document.getElementById("crypto-copy").addEventListener("click", async () => {
    const english = document.documentElement.lang === "en";
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(address.value);
      status.textContent = english ? "Address copied." : "Адрес скопирован.";
    } catch (_) {
      address.focus();
      address.select();
      status.textContent = english ? "Could not copy automatically. The address is selected; copy it manually." : "Не удалось скопировать автоматически. Адрес выделен, скопируйте его вручную.";
    }
  });

  document.addEventListener("akaio-language-change", () => { status.textContent = ""; });
})();
