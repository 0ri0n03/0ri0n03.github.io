// Base de l'API Elden Ring pour récupérer un boss par ID (boss.html?boss=<id>).
const API_BASE_URL = "https://eldenring.fanapis.com/api/bosses";

// Cibles dans le DOM.
const bossContainer = document.getElementById("boss");
const bossMedia = document.getElementById("boss-media");
const infoList = document.getElementById("infos");
const bossName = document.getElementById("nom");

// Affiche un message d'erreur et nettoie la liste.
function showError(message) {
  infoList.innerHTML = `<tr><td colspan="2">Erreur : ${message}</td></tr>`;
  if (bossMedia) bossMedia.textContent = "";
  if (bossName) bossName.textContent = "";
}

// Construit l'affichage du boss (image + liste d'infos).
function renderBoss(boss) {
  // Reset : on vide le tbody; on garde le conteneur principal et le media.
  infoList.innerHTML = "";
  if (bossMedia) bossMedia.innerHTML = "";

  // Titre avec le nom du boss.
  if (bossName) {
    bossName.textContent = boss.name || "Boss inconnu";
  }

  // Image du boss (ou placeholder texte).
  if (boss.image && bossMedia) {
    const img = document.createElement("img");
    img.src = boss.image;
    img.alt = boss.name || "Boss";
    img.loading = "lazy";
    bossMedia.appendChild(img);
  } else if (bossMedia) {
    bossMedia.textContent = "Image indisponible";
  }

  // Paires [label, valeur] à afficher sous forme de <li>.
  // Données descriptives principales.
  const entries = [
    ["Région", boss.region],
    ["Location", boss.location],
    ["Description", boss.description],
    ["Drops", Array.isArray(boss.drops) ? boss.drops.join(", ") : boss.drops],
    ["PV", boss.healthPoints],
  ];

  // Ajoute une ligne par information non vide.
  entries.forEach(([label, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    const row = document.createElement("tr");
    const cat = document.createElement("td");
    const val = document.createElement("td");
    cat.textContent = label;
    val.textContent = value;
    row.appendChild(cat);
    row.appendChild(val);
    infoList.appendChild(row);
  });
}

// Récupère l'ID dans l'URL, appelle l'API, affiche ou signale l'erreur.
function loadBoss() {
  const url = new URL(window.location.href);
  const bossId = url.searchParams.get("boss");
  if (!bossId) {
    showError("ID du boss manquant (paramètre ?boss=...).");
    return;
  }

  // Etat de chargement.
  if (bossMedia) bossMedia.textContent = "Chargement...";
  infoList.innerHTML = "<tr><td colspan=\"2\">Chargement...</td></tr>";

  // Requête détaillée pour ce boss.
  fetch(`${API_BASE_URL}/${bossId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Boss introuvable");
      }
      return response.json();
    })
    .then((data) => {
      if (!data.data) {
        throw new Error("Réponse inattendue");
      }
      renderBoss(data.data);
    })
    .catch((error) => {
      showError(error.message);
    });
}

// Lancement au chargement de la page.
loadBoss();
