import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const entriesRef = collection(db, "entries");

const form = document.getElementById("entry-form");
const idField = document.getElementById("entry-id");
const numeroField = document.getElementById("numero");
const contenuField = document.getElementById("contenu");
const valeurField = document.getElementById("valeur");
const lienField = document.getElementById("lien");
const stretchField = document.getElementById("stretch");
const pseudoField = document.getElementById("pseudo");
const submitBtn = document.getElementById("submit-btn");
const cancelEditBtn = document.getElementById("cancel-edit");
const tbody = document.getElementById("entries-body");
const searchInput = document.getElementById("search");
const statsEl = document.getElementById("stats");

let allEntries = [];

function resetForm() {
  form.reset();
  idField.value = "";
  submitBtn.textContent = "Ajouter";
  cancelEditBtn.hidden = true;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    numero: Number(numeroField.value),
    contenu: contenuField.value.trim(),
    valeur: valeurField.value.trim(),
    lien: lienField.value.trim(),
    stretch: stretchField.checked,
    pseudo: pseudoField.value.trim() || "Anonyme",
    updatedAt: serverTimestamp(),
  };

  submitBtn.disabled = true;
  try {
    if (idField.value) {
      await updateDoc(doc(db, "entries", idField.value), payload);
    } else {
      payload.createdAt = serverTimestamp();
      await addDoc(entriesRef, payload);
    }
    resetForm();
  } catch (err) {
    alert("Erreur lors de l'enregistrement : " + err.message);
  } finally {
    submitBtn.disabled = false;
  }
});

cancelEditBtn.addEventListener("click", resetForm);

searchInput.addEventListener("input", () => render());

function startEdit(entry) {
  idField.value = entry.id;
  numeroField.value = entry.numero;
  contenuField.value = entry.contenu;
  valeurField.value = entry.valeur || "";
  lienField.value = entry.lien || "";
  stretchField.checked = !!entry.stretch;
  pseudoField.value = entry.pseudo || "";
  submitBtn.textContent = "Enregistrer les modifications";
  cancelEditBtn.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function removeEntry(entry) {
  if (!confirm(`Supprimer le carton n°${entry.numero} ?`)) return;
  try {
    await deleteDoc(doc(db, "entries", entry.id));
  } catch (err) {
    alert("Erreur lors de la suppression : " + err.message);
  }
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function renderStats(list) {
  const total = list.length;
  const stretchCount = list.filter((e) => e.stretch).length;
  statsEl.innerHTML = `
    <span>${total} carton${total === 1 ? "" : "s"} enregistrés</span>
    <span>${stretchCount} stretch goal${stretchCount === 1 ? "" : "s"}</span>
  `;
}

function render() {
  const term = searchInput.value.trim().toLowerCase();
  const filtered = term
    ? allEntries.filter((e) =>
        [e.numero, e.contenu, e.valeur, e.pseudo]
          .some((v) => String(v ?? "").toLowerCase().includes(term))
      )
    : allEntries;

  renderStats(allEntries);

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-row">Aucun carton pour le moment.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered
    .map((e) => {
      const lien = e.lien
        ? `<a href="${escapeHtml(e.lien)}" target="_blank" rel="noopener noreferrer">source</a>`
        : "";
      const badge = e.stretch
        ? `<span class="badge yes">Oui</span>`
        : `<span class="badge no">Non</span>`;
      return `
        <tr>
          <td>${escapeHtml(e.numero)}</td>
          <td class="wrap">${escapeHtml(e.contenu)}</td>
          <td>${escapeHtml(e.valeur)}</td>
          <td>${lien}</td>
          <td>${badge}</td>
          <td>${escapeHtml(e.pseudo)}</td>
          <td>
            <div class="row-actions">
              <button type="button" class="small secondary" data-action="edit" data-id="${e.id}">Modifier</button>
              <button type="button" class="small danger" data-action="delete" data-id="${e.id}">Supprimer</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
}

tbody.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const entry = allEntries.find((x) => x.id === btn.dataset.id);
  if (!entry) return;
  if (btn.dataset.action === "edit") startEdit(entry);
  if (btn.dataset.action === "delete") removeEntry(entry);
});

const entriesQuery = query(entriesRef, orderBy("numero", "asc"));
onSnapshot(
  entriesQuery,
  (snapshot) => {
    allEntries = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    render();
  },
  (err) => {
    tbody.innerHTML = `<tr><td colspan="7" class="empty-row">Erreur de connexion a Firestore : ${escapeHtml(err.message)}. Verifie firebase-config.js et les regles Firestore.</td></tr>`;
  }
);
