// Liste des lots avec leurs probabilités, limites et compteurs actuels
const lots = [
    { name: "50 écus", probability: 0.5, max_count: 50, current_count: 0, image: "https://i.imgur.com/l7G6rBX.png" },
    { name: "5 PR", probability: 0.2, max_count: 20, current_count: 0, image: "https://i.imgur.com/Z1pB01E.png" },
    { name: "Fragment d'XP", probability: 0.12, max_count: 12, current_count: 0, image: "https://i.imgur.com/CJsqMRy.png" },
    { name: "Fragment de matériau", probability: 0.05, max_count: 5, current_count: 0, image: "https://i.imgur.com/hluq1T3.png" },
    { name: "Familier", probability: 0.05, max_count: 1, current_count: 0, image: "https://i.imgur.com/lVzkm3a.png" },
    { name: "Clé spéciale", probability: 0.01, max_count: 1, current_count: 0, image: "https://i.imgur.com/JbR1ggf.png" },
    { name: "Lanterne des trésors", probability: 0.01, max_count: 1, current_count: 0, image: "https://i.imgur.com/XMmxAgB.png" },
    { name: "Plume de voyage", probability: 0.01, max_count: 1, current_count: 0, image: "https://i.imgur.com/qTW8Uxi.png" }
  ];
  
  // Fonction pour démarrer le tirage
  function startDrawing() {
    const playerName = document.getElementById('playerName').value;
  
    if (!playerName) {
      alert('Veuillez entrer un pseudo.');
      return;
    }
  
    // Tirer un lot basé sur la probabilité
    const drawnLot = drawLot();
  
    if (!drawnLot) {
      alert('Tous les lots ont été gagnés !');
      return;
    }
  
    // Enregistrer le tirage et l'état dans localStorage
    saveToLocalStorage(playerName, drawnLot);
  
    // Afficher le lot gagné avec une animation spécifique
    showResult(drawnLot);
  
    // Mettre à jour le compteur des lots gagnés
    updateLotCount();
  }
  
  // Fonction pour tirer un lot aléatoire basé sur les probabilités
  function drawLot() {
    // Récupérer les données des lots depuis localStorage
    const storedData = JSON.parse(localStorage.getItem('lotData')) || {};
  
    // Filtrer les lots disponibles : ne garder que ceux dont le current_count < max_count
    const availableLots = lots.filter(lot => {
      const lotCount = storedData[lot.name] ? storedData[lot.name] : 0;
      return lotCount < lot.max_count;
    });
  
    if (availableLots.length === 0) {
      return null; // Si tous les lots ont atteint leur limite
    }
  
    // Calculer un tirage basé sur la probabilité
    const randomValue = Math.random();
    let cumulativeProbability = 0;
    let chosenLot = null;
  
    for (let lot of availableLots) {
      cumulativeProbability += lot.probability;
      if (randomValue <= cumulativeProbability) {
        chosenLot = lot;
        break;
      }
    }
  
    if (chosenLot) {
      // Incrémenter le compteur du lot dans localStorage
      const lotCount = storedData[chosenLot.name] ? storedData[chosenLot.name] : 0;
      storedData[chosenLot.name] = lotCount + 1;
      localStorage.setItem('lotData', JSON.stringify(storedData));
    }
  
    return chosenLot;
  }
  
  // Fonction pour afficher le résultat du tirage
  function showResult(lot) {
    const resultDiv = document.getElementById('lotResult');
    resultDiv.innerHTML = `
      <img src="${lot.image}" alt="${lot.name}" />
      <p><strong>${lot.name}</strong></p>
    `;
    resultDiv.classList.add('show');
  
    // Ajoute une animation spécifique en fonction de la rareté du lot
    if (lot.probability === 0.5) {
      resultDiv.style.backgroundColor = "#969696"; // Gris pour les lots N
    } else if (lot.probability === 0.2) {
      resultDiv.style.backgroundColor = "#339966"; // Vert pour les lots R
    } else if (lot.probability === 0.12) {
      resultDiv.style.backgroundColor = "#339966";
    } else if (lot.probability === 0.05) {
      resultDiv.style.backgroundColor = "#D4AF37"; // Doré pour les lots SR
    } else {
      resultDiv.style.backgroundColor = "#382B88"; // Violet pour les lots SSR
    }
  }
  
  // Fonction pour sauvegarder les données dans localStorage
  function saveToLocalStorage(playerName, drawnLot) {
    let playerData = JSON.parse(localStorage.getItem(playerName)) || { wonLots: [] };
  
    // Ajouter le lot gagné à la liste des lots gagnés
    playerData.wonLots.push(drawnLot.name);
  
    // Sauvegarder les données dans localStorage
    localStorage.setItem(playerName, JSON.stringify(playerData));
  }
  
  // Fonction pour mettre à jour les données des lots
  function updateLotCount() {
    const playerName = document.getElementById('playerName').value;
    const playerData = JSON.parse(localStorage.getItem(playerName)) || { wonLots: [] };
  
    // Affichage des lots gagnés
    const wonLotsList = document.getElementById('wonLots');
    wonLotsList.innerHTML = '';
    if (playerData.wonLots.length > 0) {
      playerData.wonLots.forEach(lot => {
        const li = document.createElement('li');
        li.textContent = lot;
        wonLotsList.appendChild(li);
      });
    }
  
    // Mise à jour du décompte des lots restants
    const lotDetails = document.getElementById('lotDetails');
    lotDetails.innerHTML = '';
    
    // Récupérer les compteurs depuis localStorage
    const storedData = JSON.parse(localStorage.getItem('lotData')) || {};
  
    lots.forEach(lot => {
      const currentCount = storedData[lot.name] ? storedData[lot.name] : 0;
      const li = document.createElement('li');
      li.textContent = `${lot.name} - ${currentCount}/${lot.max_count}`;
      lotDetails.appendChild(li);
    });
  }
  
  // Initialisation des lots dans localStorage au premier démarrage
  document.addEventListener("DOMContentLoaded", () => {
    const playerName = document.getElementById('playerName').value;
    if (playerName) {
      updateLotCount(); // Pour mettre à jour le décompte dès le départ
    }
  });
  
