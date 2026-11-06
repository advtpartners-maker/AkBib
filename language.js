"use strict";

const translations = {
  ".skip-link": "Skip to content",
  "nav a:nth-child(1)": "Home",
  "nav a:nth-child(2)": "Features",
  "nav a:nth-child(3)": "Releases",
  "nav a:nth-child(4)": "Support",
  ".hero-copy .eyebrow": '<span class="status-dot"></span> TEXT. CONTEXT. IDEA.',
  "#hero-title": "Rightly<br><em>dividing<br>the word of truth.</em>",
  ".hero-description": "Your new tool for studying the Bible. Translations, commentaries, dictionaries, atlases, books and much more in one application.",
  ".hero-copy .button": 'Download the app <span aria-hidden="true">↗</span>',
  ".hero-note": "Windows 10-11 x64 / ZIP, 1.91 GB",
  ".intro > .eyebrow": "About the app",
  "#about-title": "<strong>Akaio Bible</strong><br><span>Bible study software</span>",
  ".intro-grid > div > p:nth-child(1)": "Sometimes, seeing a familiar text in another translation is enough to make a new discovery. At other times, you need to consult a dictionary, turn to a commentary and compare several sources.",
  ".intro-grid > div > p:nth-child(2)": "Akaio brings these tools together in one workspace. The goal is to provide a convenient environment for studying Holy Scripture.",
  "#features-title": "Application features",
  ".release-intro .eyebrow": "APPLICATION RELEASES",
  "#releases-title": "Update<br><span>history.</span>",
  ".release-intro > p:not(.eyebrow)": "All versions of Akaio Bible",
  ".release .release-meta span:first-child": "VERSION 1.0.0",
  ".release h3": "First release",
  ".release h3 + p": "Akaio Bible beta version.",
  ".release-download": 'Download beta for Windows <span aria-hidden="true">↓</span>',
  ".download-size": "ZIP archive / 1.91 GB",
  "#requirements-title": 'System requirements and setup <span aria-hidden="true">+</span>',
  "#download-os-label": "Operating system",
  "#download-ram-label": "RAM",
  "#download-ram": "At least 4 GB",
  "#download-disk-label": "Free disk space",
  "#download-disk": "At least 6 GB",
  "#download-instructions": "Extract the ZIP archive to a separate folder and launch the app from that folder. Do not run it directly from the archive.",
  ".release-notice": "You are downloading a beta version of AKAIO. Errors and instability in some features are possible. Keep backups of important notes. When reporting an issue, include the application version, operating system and steps to reproduce it; if possible, attach a screenshot without personal information.",
  ".support > .eyebrow": "GET IN TOUCH",
  "#support-title": "Support <span>and feedback.</span>",
  ".support-intro": "Join the Telegram community, share your thoughts or support the development of the project.",
  ".support-card:nth-child(1) h3": "Our community",
  ".support-card:nth-child(1) p": "More information about the project in our Telegram channel.",
  ".telegram-link .sr-only": "Open the Telegram channel (opens in a new tab)",
  ".support-card:nth-child(2) h3": "Support the project",
  ".support-card:nth-child(2) p": "Help Akaio Bible continue to grow.",
  "#crypto-title": "Support with USDT",
  ".crypto-network": "Network: <strong>Arbitrum One</strong>",
  "#crypto-warning": "Send only USDT via the Arbitrum One network. Sending through another network may result in lost funds. Verify the network, token and address in your wallet before sending.",
  "#crypto-address-label": "Wallet address",
  "#crypto-copy": "Copy address",
  ".stripe-new-tab": " (opens in a new tab)",
  ".paypal-new-tab": " (opens in a new tab)",
  ".revolut-new-tab": " (opens in a new tab)",
  ".closing .eyebrow": "QUOTE",
  // Collected Works of Abraham Lincoln, VII, p. 542 (September 7, 1864).
  ".closing h2": "“In regard to this Great Book, I have but to say, it is the best gift God has given to man. All the good the Saviour gave to the world was communicated through this book.”",
  ".closing-author": "Abraham Lincoln",
  "#scene-title": "AKAIO in a space for study",
  "#scene-description": "A warm study with books and a laptop. The laptop screen displays an original screenshot of the Bible window in AKAIO."
};

[
  ["Main window", "Brings tools together in one workspace and lets you arrange the windows."],
  ["Bible", "Read a selected Bible module and navigate between books and chapters."],
  ["Translation comparison", "Compare selected translations and examine differences in individual verses."],
  ["Dictionary", "Find entries in a dictionary module using its contents or article titles."],
  ["Commentary", "Read explanations from connected commentary modules alongside the biblical text."],
  ["Lexicon", "Explore lexical entries by choosing a letter or using search."],
  ["Textual variants", "View connected PDF editions of Nestle–Aland and the UBS Greek New Testament."],
  ["Structure", "Explore a diagram of the biblical text's structure for a selected verse."],
  ["Atlases", "Open connected atlases and browse their contents."],
  ["Chronicles", "Explore biblical history on a chronological timeline."],
  ["Daily readings", "Choose a module and date to open a daily reading."],
  ["Reading plans", "Choose a plan, browse daily passages and track your progress."],
  ["Resources", "Browse images and tables from modules using search and filters."],
  ["Notes", "Create note pages, organise them in a tree and edit their text."],
  ["Task list", "Organise tasks into lists and plan them by date."],
  ["Bookmarks", "Find saved passages, organise bookmarks into folders and return to reading."],
  ["Search", "Use the separate advanced search window to work with texts."]
].forEach(([title, description], index) => {
  translations[`.feature:nth-child(${index + 1}) h3`] = title;
  translations[`.feature:nth-child(${index + 1}) p`] = description;
});

const originals = Object.fromEntries(Object.keys(translations).map(selector => [selector, document.querySelector(selector).innerHTML]));
const language = document.querySelector(".language-picker");
const languageInputs = [...language.querySelectorAll('input[name="language"]')];
const description = document.querySelector('meta[name="description"]');
const screen = document.querySelector(".original-screen");
const brand = document.querySelector(".header .brand");
const nav = document.querySelector("nav");
const canonical = document.querySelector('link[rel="canonical"]');
const siteURL = canonical.href;
const russian = { title: document.title, description: description.content, alt: screen.alt, brand: brand.getAttribute("aria-label"), nav: nav.getAttribute("aria-label") };

function setLanguage(value, { updateURL = true, pushHistory = false } = {}) {
  const english = value === "en";
  for (const [selector, text] of Object.entries(translations)) {
    document.querySelector(selector).innerHTML = english ? text : originals[selector];
  }
  document.documentElement.lang = value;
  document.title = english ? "Akaio Bible | Bible Study Software for Windows" : russian.title;
  description.content = english ? "Akaio Bible: Bible study software for Windows. Translations, commentaries, dictionaries, atlases, notes and reading plans in one app." : russian.description;
  const pageURL = new URL(siteURL);
  if (english) pageURL.searchParams.set("lang", "en");
  canonical.href = pageURL.href;
  document.querySelector('meta[property="og:url"]').content = pageURL.href;
  document.querySelector('meta[property="og:locale"]').content = english ? "en_GB" : "ru_RU";
  document.querySelector('meta[property="og:locale:alternate"]').content = english ? "ru_RU" : "en_GB";
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector('meta[name="twitter:title"]').content = document.title;
  document.querySelector('meta[property="og:description"]').content = description.content;
  document.querySelector('meta[name="twitter:description"]').content = description.content;
  const previewAlt = english ? "Akaio Bible: Bible study software" : "Akaio Bible: приложение для изучения Библии";
  document.querySelector('meta[property="og:image:alt"]').content = previewAlt;
  document.querySelector('meta[name="twitter:image:alt"]').content = previewAlt;
  screen.alt = english ? "Original AKAIO screenshot: Bible window, Genesis 1" : russian.alt;
  brand.setAttribute("aria-label", english ? "AKAIO, home" : russian.brand);
  nav.setAttribute("aria-label", english ? "Main navigation" : russian.nav);
  document.querySelector(".payment-methods").setAttribute("aria-label", english ? "Ways to support" : "Способы поддержки");
  document.querySelector(".crypto-close").setAttribute("aria-label", english ? "Close" : "Закрыть");
  document.querySelector(".footer-social .social-icon").setAttribute("aria-label", english ? "Telegram (opens in a new tab)" : "Telegram (откроется в новой вкладке)");
  languageInputs.forEach(input => { input.checked = input.value === value; });
  language.querySelector(".language-current").textContent = english ? "English" : "Русский";
  if (updateURL && location.protocol !== "file:") {
    const url = new URL(location.href);
    url.searchParams.set("lang", value);
    if (pushHistory) history.pushState(null, "", url);
    else history.replaceState(null, "", url);
  }
  document.dispatchEvent(new CustomEvent("akaio-language-change"));
  try { localStorage.setItem("akaio-v7-language", value); } catch (_) { /* Storage may be disabled. */ }
}

language.addEventListener("change", event => {
  if (!event.target.matches('input[name="language"]')) return;
  setLanguage(event.target.value, { pushHistory: true });
  language.open = false;
  language.querySelector("summary").focus();
});
document.addEventListener("click", event => {
  if (!language.contains(event.target)) language.open = false;
});
language.addEventListener("keydown", event => {
  if (event.key === "Escape" && language.open) {
    language.open = false;
    language.querySelector("summary").focus();
  }
});
window.addEventListener("popstate", () => {
  setLanguage(new URLSearchParams(location.search).get("lang") === "en" ? "en" : "ru", { updateURL: false });
});
const requestedLanguage = new URLSearchParams(location.search).get("lang");
if (requestedLanguage === "en" || requestedLanguage === "ru") {
  setLanguage(requestedLanguage, { updateURL: false });
} else {
  try { if (localStorage.getItem("akaio-v7-language") === "en") setLanguage("en"); } catch (_) { /* Russian remains the default. */ }
}
