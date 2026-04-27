import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const WHATSAPP = "919581179117";

const firebaseConfig = {
  apiKey: "AIzaSyDuOLUT9QVZmGfzrvmysBX0Mgvqk6LYxMM",
  authDomain: "manana360-claude.firebaseapp.com",
  projectId: "manana360-claude",
  storageBucket: "manana360-claude.firebasestorage.app",
  messagingSenderId: "234206031398",
  appId: "1:234206031398:web:83cab2c5c229050b5dc0e7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function qs(s, root = document) {
  return root.querySelector(s);
}

function qsa(s, root = document) {
  return [...root.querySelectorAll(s)];
}

function formData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function waLink(message) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;
}

async function saveEnquiry(type, data) {
  await addDoc(collection(db, "enquiries"), {
    type,
    ...data,
    status: "New",
    createdAt: new Date().toISOString()
  });
}

function bindForms() {
  qsa("[data-lead-form]").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = formData(form);
      const type = form.getAttribute("data-lead-form") || "lead";

      try {
        await saveEnquiry(type, data);

        const msg =
          `Manana360 ${type} enquiry\n` +
          `Name: ${data.name || ""}\n` +
          `Mobile: ${data.mobile || ""}\n` +
          `Business: ${data.businessType || data.industry || ""}\n` +
          `City: ${data.city || ""}\n` +
          `Requirement: ${data.requirement || ""}`;

        alert("Saved to Firebase cloud successfully 🚀");
        form.reset();

        const openWa = form.getAttribute("data-whatsapp") === "true";
        if (openWa) window.open(waLink(msg), "_blank");
      } catch (error) {
        console.error("Firebase save error:", error);
        alert("Error saving data. Please check Firebase Firestore rules.");
      }
    });
  });

  qsa("[data-wa]").forEach((a) => {
    a.href = waLink(a.getAttribute("data-wa") || "I want Manana360 demo");
  });
}

function renderAdmin() {
  const box = qs("#adminList");
  if (!box) return;

  box.innerHTML =
    '<div class="notice">Firebase cloud saving is active. Admin live cloud data view will be connected in the next step. Please check Firestore → enquiries for submitted leads.</div>';

  const total = qs("#totalLeads");
  const newLeads = qs("#newLeads");
  const demoLeads = qs("#demoLeads");
  const franchiseLeads = qs("#franchiseLeads");

  if (total) total.textContent = "Cloud";
  if (newLeads) newLeads.textContent = "ON";
  if (demoLeads) demoLeads.textContent = "Firebase";
  if (franchiseLeads) franchiseLeads.textContent = "Next";
}

document.addEventListener("DOMContentLoaded", () => {
  bindForms();
  renderAdmin();
});
