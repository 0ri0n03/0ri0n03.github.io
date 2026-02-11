// URL base de la liste des boss (ordre conserve par l'API).
const API_BASE_URL = "https://eldenring.fanapis.com/api/bosses";
const PAGE_SIZE = 20; // 20 par page, navigation continue

// Affiche par blocs de 20 boss, dans l'ordre de l'API.

// Zone d'affichage principale.
const app = document.getElementById("app");
const nextButton = document.getElementById("next-page");
const previousButton = document.getElementById("previous-page")
const searchForm = document.querySelector("form");
const searchInput = document.getElementById("search");
const pageActuelle = document.getElementById("page")
// Suivi de pagination.
let page = 0; // page de base (0 -> premiers boss)
let total = null;
let lastQuery = ""; // memorise la derniere recherche pour paginer dessus
let lastPageData = []; // garde la derniere page chargee (utile pour debug/affichage)

// Construit l'affichage des boss avec image + nom.
// Les doublons de nom sont filtres uniquement sur la page courante.
function renderBossList(bossList) {
  const fragment = document.createDocumentFragment();
  const seenNames = new Set();

  bossList.forEach((boss) => {
    const nameText = boss.name || "Boss inconnu";
    const regionText = boss.region;
    if (seenNames.has(nameText)) {
      return;
    }
    seenNames.add(nameText);

    const row = document.createElement("tr");

    const imageCell = document.createElement("td");
    if (boss.image) {
      const img = document.createElement("img");
      img.src = boss.image;
      img.alt = nameText;
      img.loading = "lazy";
      imageCell.appendChild(img);
    } else {
      imageCell.textContent = "Image indisponible";
    }

    const nameCell = document.createElement("td");
    nameCell.textContent = nameText;

    const regionCell = document.createElement("td");
    regionCell.textContent = regionText || "Region inconnue";

    const infoCell = document.createElement("td");
    if (boss.id) {
      const link = document.createElement("a");
      link.href = `boss.html?boss=${boss.id}`;
      link.textContent = "Voir";
      infoCell.appendChild(link);
    } else {
      infoCell.textContent = "-";
    }

    row.appendChild(imageCell);
    row.appendChild(nameCell);
    row.appendChild(regionCell);
    row.appendChild(infoCell);

    fragment.appendChild(row);
  });

  // Remplace le contenu du tbody par la liste generee.
  app.innerHTML = "";
  app.appendChild(fragment);
}

function updatePreviousButton() {
  if (!previousButton) {
    return;
  }
    previousButton.disabled = page <= 0;
}
// Active ou desactive le bouton suivant selon le total.
function updateNextButton() {
  if (!nextButton) {
    return;
  }
    if (total === null) {
    nextButton.disabled = false;
    return;
  }
  const nextPageStart = (page + 1) * PAGE_SIZE;
  nextButton.disabled = nextPageStart >= total;
}

// Affiche un message d'erreur simple dans l'UI.
function renderError(message) {
  app.innerHTML = `<tr><td colspan="4">Erreur : ${message}</td></tr>`;
}

function updatePage(NumeroPageActuelle, NombreTotalPage) {
  
  pageActuelle.innerHTML = `<span> Page ${NumeroPageActuelle} / ${NombreTotalPage} </span>`
}


// Charge une page de boss et garde l'ordre retourne par l'API.
// Chaque clic remplace la liste par les 20 suivants.

// Charge une page; si "name" est fourni, l'API filtre par nom de boss.
function loadPage({ name } = {}) {
  // 1) Feedback visuel immédiat : indique que la requête est en cours.
  app.innerHTML = `<tr><td colspan="4">Chargement...</td></tr>`;

  // 2) Prépare les paramètres obligatoires de pagination.
  const params = new URLSearchParams({
    page,              // index de page (0 = première)
    limit: PAGE_SIZE,  // nombre d'éléments par page
  });

  // 3) Ajoute un filtre optionnel si l'utilisateur a saisi un terme.
  if (name) {
    params.set("name", name);
  }

  // 4) Construit l'URL finale avec tous les paramètres.
  const apiUrl = `${API_BASE_URL}?${params.toString()}`;

  // 5) Appelle l'API pour récupérer la page demandée.
  fetch(apiUrl)
    .then((response) => {
      // 6) Vérifie que la réponse HTTP est OK.
      if (!response.ok) {
        throw new Error("Impossible de charger la liste des boss.");
      }
      // 7) Transforme la réponse en JSON.
      return response.json();
    })
    .then((data) => {
      // 8) Valide le format attendu (un tableau data).
      //    et que "data" est un tableau (liste de boss). Sinon, on stoppe.
      if (!data.data || !Array.isArray(data.data)) {
        throw new Error("Format de reponse inattendu.");
      }
      // 9) Mémorise le total pour activer/désactiver la pagination.
      total = data.total ?? total;
      // 10) Mémorise la page courante pour un filtre local si besoin.
      lastPageData = Array.isArray(data.data) ? data.data : [];
      // 11) Affiche la liste dans le tableau.
      let NumeroPageActuelle = page + 1
      const NombreTotalPage = Math.ceil(total / PAGE_SIZE);
      renderBossList(lastPageData);
      // 12) Met à jour l'état des boutons précédent/suivant.
      updateNextButton();
      updatePreviousButton();
      updatePage(NumeroPageActuelle, NombreTotalPage)
    })
    .catch((error) => {
      // 12) Affiche une erreur propre si la requête échoue.
      renderError(error.message);
    });
}

if (previousButton) {
  previousButton.addEventListener("click", () => {
    if (page <= 0) return;
    page -= 1;
    // Conserve le filtre courant pendant la pagination.
    loadPage({ name: lastQuery });
  });
}

if (nextButton) {
  nextButton.addEventListener("click", () => {
    if (total !== null && (page + 1) * PAGE_SIZE >= total) return;
    page += 1;
    // Conserve le filtre courant pendant la pagination.
    loadPage({ name: lastQuery });
  });
}
  
// Soumission du formulaire de recherche.
if (searchForm && searchInput) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const term = searchInput.value.trim();

    // On repart de la premiere page pour la nouvelle recherche.
    page = 0;
    lastQuery = term;

    // Recherche côté serveur via le paramètre "name".
    loadPage({ name: term || undefined });
  });
}

loadPage();
