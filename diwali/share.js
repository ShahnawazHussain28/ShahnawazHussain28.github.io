// Turn a name into a greeting link anyone can open
const form = document.getElementById("share");
const who = document.getElementById("who");
const copyButton = document.getElementById("copy");

function greetingLink() {
  const url = new URL(location.href);
  url.search = "";
  const name = who.value.trim();
  if (name !== "") {
    url.searchParams.set("name", name);
  }
  return url.toString();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = who.value.trim() || "you";
  const message =
    "Happy Diwali, " + name + "! " +
    "I made you a fireworks show: " + greetingLink();
  const whatsapp =
    "https://wa.me/?text=" + encodeURIComponent(message);
  window.open(whatsapp, "_blank");
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(greetingLink());
    copyButton.textContent = "Copied!";
  } catch (error) {
    prompt("Copy this link:", greetingLink());
  }
  setTimeout(() => {
    copyButton.textContent = "Copy link";
  }, 1500);
});
