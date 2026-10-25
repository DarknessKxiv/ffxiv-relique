// Structure commune du suivi : jobs et PNJ. Le contenu de chaque relique est dans js/reliques/.
// Aucun texte ici : les noms viennent de noms-jeu.js (données officielles) et les phrases de textes.js.
(function () {
  const JOBS = [
    { code: 'PLD', id: 19, role: 'tank' }, { code: 'WAR', id: 21, role: 'tank' },
    { code: 'DRK', id: 32, role: 'tank' }, { code: 'GNB', id: 37, role: 'tank' },
    { code: 'WHM', id: 24, role: 'soin' }, { code: 'SCH', id: 28, role: 'soin' },
    { code: 'AST', id: 33, role: 'soin' }, { code: 'SGE', id: 40, role: 'soin' },
    { code: 'MNK', id: 20, role: 'dps' }, { code: 'DRG', id: 22, role: 'dps' },
    { code: 'NIN', id: 30, role: 'dps' }, { code: 'SAM', id: 34, role: 'dps' },
    { code: 'RPR', id: 39, role: 'dps' }, { code: 'VPR', id: 41, role: 'dps' },
    { code: 'BRD', id: 23, role: 'dps' }, { code: 'MCH', id: 31, role: 'dps' },
    { code: 'DNC', id: 38, role: 'dps' }, { code: 'BLM', id: 25, role: 'dps' },
    { code: 'SMN', id: 27, role: 'dps' }, { code: 'RDM', id: 35, role: 'dps' },
    { code: 'PCT', id: 42, role: 'dps' },
  ];

  // Lieu (clé de noms-jeu.js) et coordonnées de chaque PNJ, toutes reliques confondues.
  const PNJ = {
    // Dawntrail
    messager: { lieu: 'tuliyollal', x: 17.1, y: 11.8 },
    ketenramm: { lieu: 'lunuleSud', x: 7.0, y: 6.9 },
    archive: { lieu: 'lunuleSud', x: 6.1, y: 6.4 },
    jeffroy: { lieu: 'lunuleSud', x: 4.6, y: 6.6 },
    lydirceil: { lieu: 'villeFantome', x: 6.6, y: 7.1 },
    gerolt: { lieu: 'villeFantome', x: 6.7, y: 7.1 },
    ermina: { lieu: 'villeFantome', x: 6.9, y: 7.3 },
    dodokkuli: { lieu: 'villeFantome', x: 6.7, y: 7.1 },
    archeologue: { lieu: 'villeFantome', x: 5.0, y: 7.3 },
    brigid: { lieu: 'villeFantome', x: 6.4, y: 7.0 },
    metallurgiste: { lieu: 'villeFantome', x: 6.9, y: 7.1 },
    goplu: { lieu: 'tuliyollal', x: 13.1, y: 12.7 },
    rral: { lieu: 'yakTel', x: 13.8, y: 12.7 },
    // Endwalker (positions calculées depuis les données du jeu, feuille Level)
    domestiqueManderville: { lieu: 'radzAtHan', x: 11.8, y: 11.2 },
    jubrunnah: { lieu: 'radzAtHan', x: 12.2, y: 11.0 },
    artisanManderville: { lieu: 'radzAtHan', x: 12.1, y: 7.2 },
    alchimisteManderville: { lieu: 'radzAtHan', x: 12.1, y: 7.2 },
    geroltEw: { lieu: 'radzAtHan', x: 12.0, y: 7.1 },
    // Reliques plus anciennes. `nom` : PNJ du même nom ailleurs (Gerolt change de place à chaque relique).
    // Sans lieu : PNJ présent à plusieurs endroits, seul son nom s'affiche.
    auriana: { lieu: 'morDhona', x: 22.7, y: 6.7 },
    syndony: { lieu: 'morDhona', x: 22.7, y: 5.9 },
    cristiana: { lieu: 'morDhona', x: 21.4, y: 5.5 },
    blamprest: { lieu: 'idyllee', x: 8.0, y: 6.1 },
    sabina: { lieu: 'idyllee', x: 5.7, y: 5.4 },
    hubairtin: { lieu: 'thanalan_centre', x: 23.6, y: 13.8 },
    ulan: { lieu: 'idyllee', x: 6.4, y: 4.7 },
    gjusana: { lieu: 'morDhona', x: 22.9, y: 7.4 },
    remon: { lieu: 'noscea_ouest', x: 34.3, y: 31.7 },
    jalzahn: { lieu: 'sombrelinceul_nord', x: 29.6, y: 19.7 },
    geroltArr: { nom: 'gerolt', lieu: 'sombrelinceul_nord', x: 30.3, y: 20.3 },
    geroltAnemos: { nom: 'gerolt', lieu: 'eurekaAnemos', x: 18.0, y: 32.3 },
    geroltPagos: { nom: 'gerolt', lieu: 'eurekaPagos', x: 4.3, y: 25.1 },
    geroltPyros: { nom: 'gerolt', lieu: 'eurekaPyros', x: 15.3, y: 23.6 },
    geroltHydatos: { nom: 'gerolt', lieu: 'eurekaHydatos', x: 21.5, y: 13.7 },
    oiseleur: {},
    receleur: {},
  };

  // Chaque fichier de js/reliques/ ajoute sa relique ici (clé : dt, ew…).
  window.RELIQUE = { JOBS, PNJ, RELIQUES: {} };
})();
