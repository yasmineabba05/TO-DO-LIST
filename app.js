
var taches = [];
var filtreCourant = 'toutes';

var tachesDefaut = [
  { id: 1, texte: "Réviser le cours de maths", categorie: "cours", faite: false },
  { id: 2, texte: "Faire les exercices de physique", categorie: "cours", faite: false },
  { id: 3, texte: "Lire 20 pages du livre recommandé", categorie: "general", faite: false },
  { id: 4, texte: "Préparer le exposé de demain", categorie: "urgent", faite: false },
  { id: 5, texte: "Aller à la bibliothèque", categorie: "general", faite: false },
  { id: 6, texte: "Rendre le devoir de français", categorie: "urgent", faite: false },
  { id: 7, texte: "Appeler un camarade pour le groupe d'étude", categorie: "general", faite: false },
  { id: 8, texte: "Préparer le sac pour demain", categorie: "general", faite: false },
  { id: 9, texte: "Faire du sport 30 minutes", categorie: "general", faite: false },
  { id: 10, texte: "Revoir les notes du cours d'histoire", categorie: "cours", faite: false },
  { id: 11, texte: "Boire suffisamment d'eau aujourd'hui 💧", categorie: "general", faite: false },
  { id: 12, texte: "Dormir avant minuit !", categorie: "urgent", faite: false }
];

function init() {
  var sauvegarde = localStorage.getItem('taches_etudiant');
  if (sauvegarde) {
    taches = JSON.parse(sauvegarde);
  } else {
    taches = tachesDefaut;
    sauvegarder();
  }

  afficherTaches();
}

function ajouterTache() {
  var input = document.getElementById('taskInput');
  var select = document.getElementById('categorySelect');

  var texte = input.value.trim(); 

  if (texte === '') {
    input.style.borderColor = '#e63946';
    setTimeout(function() {
      input.style.borderColor = '#e8ddd3';
    }, 800);
    return; 
  }

  var nouvelleTache = {
    id: Date.now(),         
    texte: texte,
    categorie: select.value,
    faite: false
  };

  taches.unshift(nouvelleTache);

  input.value = '';
  input.focus();

  sauvegarder();
  afficherTaches();
}

function basculerTache(id) {

  for (var i = 0; i < taches.length; i++) {
    if (taches[i].id === id) {
      taches[i].faite = !taches[i].faite; // ! inverse le booléen
      break;
    }
  }
  sauvegarder();
  afficherTaches();
}

function supprimerTache(id) {
  
  taches = taches.filter(function(t) {
    return t.id !== id;
  });
  sauvegarder();
  afficherTaches();
}

function supprimerFaites() {
  taches = taches.filter(function(t) {
    return t.faite === false;
  });
  sauvegarder();
  afficherTaches();
}

function filtrer(type, bouton) {
  filtreCourant = type;

  var boutons = document.querySelectorAll('.filter-btn');
  for (var i = 0; i < boutons.length; i++) {
    boutons[i].classList.remove('active');
  }
  bouton.classList.add('active');

  afficherTaches();
}

function afficherTaches() {
  var liste = document.getElementById('taskList');
  liste.innerHTML = ''; 

  var tachesFiltrees = [];

  for (var i = 0; i < taches.length; i++) {
    if (filtreCourant === 'toutes') {
      tachesFiltrees.push(taches[i]);
    } else if (filtreCourant === 'actives' && taches[i].faite === false) {
      tachesFiltrees.push(taches[i]);
    } else if (filtreCourant === 'faites' && taches[i].faite === true) {
      tachesFiltrees.push(taches[i]);
    }
  }

  if (tachesFiltrees.length === 0) {
    liste.innerHTML = '<div class="empty-state">Aucune tâche ici 🎉</div>';
  }

  for (var j = 0; j < tachesFiltrees.length; j++) {
    var t = tachesFiltrees[j];

    var li = document.createElement('li');
    li.className = 'task-item' + (t.faite ? ' done' : '');

   
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = t.faite;
    checkbox.onclick = (function(id) {
      return function() { basculerTache(id); };
    })(t.id);

   
    var span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = t.texte;

    
    var badge = document.createElement('span');
    badge.className = 'cat-badge cat-' + t.categorie;
    badge.textContent = getCategorieLabelCourt(t.categorie);

    
    var delBtn = document.createElement('button');
    delBtn.className = 'del-btn';
    delBtn.textContent = '✕';
    delBtn.title = 'Supprimer';
    delBtn.onclick = (function(id) {
      return function() { supprimerTache(id); };
    })(t.id);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(badge);
    li.appendChild(delBtn);
    liste.appendChild(li);
  }

  mettreAJourStats();
  mettreAJourProgression();
}

function getCategorieLabelCourt(cat) {
  if (cat === 'urgent')  return '🔥 Urgent';
  if (cat === 'projet')  return '💻 Projet';
  if (cat === 'cours')   return '📖 Cours';
  return '📌 Général';
}

function mettreAJourStats() {
  var total = taches.length;
  var faites = taches.filter(function(t) { return t.faite; }).length;
  var restantes = total - faites;

  document.getElementById('statsText').textContent =
    restantes + ' tâche(s) restante(s) sur ' + total;
}

function mettreAJourProgression() {
  var total = taches.length;
  var faites = taches.filter(function(t) { return t.faite; }).length;

  var pourcentage = total === 0 ? 0 : Math.round((faites / total) * 100);

  document.getElementById('progressBar').style.width = pourcentage + '%';
  document.getElementById('progressText').textContent = pourcentage + '% complété';
}

function sauvegarder() {
  localStorage.setItem('taches_etudiant', JSON.stringify(taches));
}

document.addEventListener('DOMContentLoaded', function() {
  init();

  document.getElementById('taskInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      ajouterTache();
    }
  });
});
