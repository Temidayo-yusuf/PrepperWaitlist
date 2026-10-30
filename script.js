/*
  PREPPER WAITLIST SETUP
  1. Create a Google Form with short-answer questions for Email address and WhatsApp number.
  2. Get the form's formResponse URL and each question's entry ID.
  3. Replace the three placeholders below. See README.md for instructions.
*/
const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSfwbKwMwNxTuTks0N-n56vifYFl5Lx62mqeWxEcwTwJGHR-5Q/formResponse";
const EMAIL_ENTRY_ID = "entry.1437305319";
const WHATSAPP_ENTRY_ID = "entry.1734662025";

const form = document.querySelector("#waitlist-form");
const message = document.querySelector("#form-message");
const submitButton = form.querySelector("button[type='submit']");

document.querySelector("#year").textContent = new Date().getFullYear();

function showMessage(text, type) {
  message.textContent = text;
  message.className = `form-message ${type}`;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";

  const email = document.querySelector("#email").value.trim();
  const whatsapp = document.querySelector("#whatsapp").value.trim();
  const emailInput = document.querySelector("#email");
  const whatsappInput = document.querySelector("#whatsapp");

  if (!emailInput.checkValidity()) {
    emailInput.reportValidity();
    return;
  }
  if (whatsapp.length < 7) {
    whatsappInput.setCustomValidity("Please enter a valid WhatsApp number, including country code.");
    whatsappInput.reportValidity();
    whatsappInput.setCustomValidity("");
    return;
  }

  if (GOOGLE_FORM_ACTION.includes("REPLACE_WITH") ||
      EMAIL_ENTRY_ID.includes("REPLACE_WITH") ||
      WHATSAPP_ENTRY_ID.includes("REPLACE_WITH")) {
    showMessage("Almost ready!, please enter the right values", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.querySelector("span").textContent = "Submitting…";

  // Google Forms accepts formResponse submissions. A hidden iframe avoids navigating away.
  const iframe = document.createElement("iframe");
  iframe.name = "google-form-submit-frame";
  iframe.title = "Google Form submission";
  iframe.style.display = "none";
  document.body.appendChild(iframe);

  const googleForm = document.createElement("form");
  googleForm.action = GOOGLE_FORM_ACTION;
  googleForm.method = "POST";
  googleForm.target = iframe.name;
  googleForm.style.display = "none";

  [[EMAIL_ENTRY_ID, email], [WHATSAPP_ENTRY_ID, whatsapp]].forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    googleForm.appendChild(input);
  });

  document.body.appendChild(googleForm);
  googleForm.submit();

  // Google Forms does not expose a reliable cross-origin success response to a static page.
  // This confirms the submission was sent, not independently verified by Google.
  window.setTimeout(() => {
    showMessage("Thanks for joining Prepper’s waitlist! We'll Be In Touch", "success");
    form.reset();
    googleForm.remove();
    iframe.remove();
    submitButton.disabled = false;
    submitButton.querySelector("span").textContent = "Join the waitlist";
  }, 1400);
});
