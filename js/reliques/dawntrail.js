// Dawntrail (niv. 100) : armes fantômes, de Penumbrae à Occultum.
// Sources : ffxiv.consolegameswiki.com (Phantom Weapons) et tutostation.fr.
(function () {
  const { JOBS, RELIQUES } = window.RELIQUE;

  // Artisans de chaque recette (codes de classe).
  const METAL = ['BSM', 'ARM', 'GSM'], TISSU = ['CRP', 'LTW', 'WVR'], CHIMIE = ['ALC', 'CUL'];
  const achat = (pnj, prix) => ({ cle: 'srcAchatGils', pnj, prix });
  const craft = (artisans, etoiles) => ({ cle: 'srcCraft', artisans, etoiles });

  // Une tâche porte une clé d'objet et une source ; les sources sont des modèles de textes.js avec leurs paramètres.
  const phases = [
    {
      num: 0,
      quetes: [
        { id: 'sentierAurore', texte: 'sentierAurore' },
        { id: 'derniereAventure', debut: 'messager', texte: 'derniereAventure' },
        { id: 'villeFantome', debut: 'ketenramm' },
        { id: 'familier', debut: 'archive', rendu: 'jeffroy' },
      ],
    },
    {
      num: 1, ilvl: 745, arcanite: 'lunulite',
      quetes: [
        { id: 'forgeron', debut: 'lydirceil', rendu: 'gerolt', texte: 'forgeron',
          taches: [{ type: 'compteurs', titre: 'titreDemiatma',
            lunule: { titre: 'lunuleDemiTitre', note: 'lunuleDemiNote', lieu: 'lunuleSud' },
            elements: [
              { cle: 'demiSaphir', qte: 3, detail: { cle: 'srcAleaZone', lieu: 'urqopacha' } },
              { cle: 'demiTurquoise', qte: 3, detail: { cle: 'srcAleaZone', lieu: 'kozamauka' } },
              { cle: 'demiEmeraude', qte: 3, detail: { cle: 'srcAleaZone', lieu: 'yakTel' } },
              { cle: 'demiCorail', qte: 3, detail: { cle: 'srcAleaZone', lieu: 'shaaloani' } },
              { cle: 'demiAmethyste', qte: 3, detail: { cle: 'srcAleaZone', lieu: 'hoirie' } },
              { cle: 'demiAmbre', qte: 3, detail: { cle: 'srcAleaZone', lieu: 'memoireVivante' } },
            ] }],
          conseils: [{ cle: 'gemmes', n: 600, gemme: 'gemme', phase: 2 }] },
        { id: 'arsenal', echange: true, debut: 'lydirceil' },
      ],
    },
    {
      num: 2, ilvl: 760, arcanite: 'ombralite',
      quetes: [
        { id: 'tablette', debut: 'lydirceil', rendu: 'gerolt', texte: 'tablette',
          taches: [
            { type: 'objet', cle: 'colle', qte: 1, source: achat('goplu', 300000) },
            { type: 'objet', cle: 'fer', qte: 1, source: { cle: 'srcAchatGemmes', pnj: 'rral', prix: 600, gemme: 'gemme' } },
            { type: 'objet', cle: 'matiereA', qte: 1, source: craft(METAL, '★★★') },
            { type: 'objet', cle: 'matiereB', qte: 1, source: craft(TISSU, '★★★') },
            { type: 'objet', cle: 'matiereG', qte: 1, source: craft(CHIMIE, '★★★') },
          ] },
        { id: 'orbes', debut: 'lydirceil', rendu: 'gerolt', texte: 'orbes',
          taches: [{ type: 'jauges', max: 10000, jauges: [
            { cle: 'vert', roulette: 'hautNiveau', bonus: 376, moyenne: 394 },
            { cle: 'bleu', roulette: 'alliance', bonus: 101, moyenne: 678 },
            { cle: 'rouge', roulette: 'defis', bonus: 614, moyenne: 162 },
            { cle: 'jaune', roulette: 'raidsNormaux', bonus: 614, moyenne: 159 },
          ] }],
          conseils: [{ cle: 'magiDuree' }, { cle: 'abandon' }] },
        { id: 'penombre', echange: true, debut: 'lydirceil' },
      ],
    },
    {
      num: 3, ilvl: 775, arcanite: 'alunite',
      quetes: [
        { id: 'recherche', debut: 'lydirceil', rendu: 'gerolt', texte: 'recherche',
          taches: [
            { type: 'objet', cle: 'argile', qte: 1, source: achat('goplu', 500000) },
            { type: 'objet', cle: 'alliageAspecte', qte: 1, source: craft(METAL, '★★★★') },
            { type: 'objet', cle: 'composantAspecte', qte: 1, source: craft(TISSU, '★★★★') },
            { type: 'objet', cle: 'resineAspectee', qte: 1, source: craft(CHIMIE, '★★★★') },
          ] },
        { id: 'pate', debut: 'lydirceil', rendu: 'gerolt', texte: 'pate',
          taches: [{ type: 'compteur', cle: 'pate', qte: 1200, pas: [1, 10, 100], sources: [
            { cle: 'srcRoulette', roulette: 'gainNiveaux', n: 20 },
            { cle: 'srcRoulette', roulette: 'niveauMax', n: 15 },
            { cle: 'srcRoulette', roulette: 'expert', n: 15 },
            { cle: 'srcCe', lieu: 'lunuleSud', n: 10 },
            { cle: 'srcPelerins', donjon: 'pelerins', n: 10 },
            { cle: 'srcDefisRaids', n: 10 },
            { cle: 'srcAleasDt', n: 3 },
          ] }],
          conseils: [{ cle: 'abandon' }, { cle: 'pateJob' }] },
        { id: 'puissance', echange: true, debut: 'lydirceil' },
      ],
    },
    {
      num: 4, ilvl: 790, arcanite: 'ecliptite',
      quetes: [
        { id: 'mirage', debut: 'lydirceil', rendu: 'gerolt', texte: 'mirage',
          taches: [
            { type: 'objet', cle: 'pierre', qte: 1, source: achat('goplu', 500000) },
            { type: 'objet', cle: 'alliageAtypique', qte: 1, source: craft(METAL, '★★★★') },
            { type: 'objet', cle: 'ficelle', qte: 1, source: craft(TISSU, '★★★★') },
            { type: 'objet', cle: 'huile', qte: 1, source: craft(CHIMIE, '★★★★') },
          ] },
        { id: 'dissipateurs', debut: 'lydirceil', rendu: 'gerolt', texte: 'dissipateurs',
          taches: [{ type: 'compteurs', titre: 'titreDissip', pas: [1, 5, 13],
            lunule: { titre: 'lunuleDissipTitre', note: 'lunuleDissipNote', lieu: 'lunuleNord' },
            elements: [
              { cle: 'dissipAlpha', qte: 100, detail: { cle: 'srcParRun', roulette: 'hautNiveau', n: 13 } },
              { cle: 'dissipBeta', qte: 100, detail: { cle: 'srcParRun', roulette: 'defis', n: 5 } },
              { cle: 'dissipGamma', qte: 100, detail: { cle: 'srcParRun', roulette: 'raidsNormaux', n: 5 } },
            ] }],
          conseils: [{ cle: 'dissipLunule', lieu: 'lunuleNord' }] },
        { id: 'purete', echange: true, debut: 'lydirceil' },
      ],
    },
    {
      num: 5, ilvl: 795, arcanite: null,
      quetes: [
        { id: 'mementos', debut: 'lydirceil', rendu: 'gerolt', texte: 'mementos', premiereArme: true,
          taches: [{ type: 'memoires' }],
          conseils: [{ cle: 'mementosMobs' }, { cle: 'mementosNormal' }] },
      ],
      bonus: { id: 'finale', texte: 'finale' },
    },
  ];

  // Objectifs du cristal de savoir (Occultum) : régions de terrain, puis missions (clés de noms-jeu.js).
  const memoires = {
    terrain: [
      { region: 'yokTural', zones: [
        { cle: 'urqo', lieu: 'urqopacha', monstres: ['ratel', 'megapita', 'grosseMachoire', 'graveur'] },
        { cle: 'koza', lieu: 'kozamauka', monstres: ['uolon', 'ocelot', 'poliste', 'apollyon'] },
        { cle: 'yak', lieu: 'yakTel', monstres: ['vawtsaral', 'tohsoq', 'sylveplume', 'sangfeuille'] },
      ] },
      { region: 'xakTural', zones: [
        { cle: 'shaa', lieu: 'shaaloani', monstres: ['crabe', 'ceratoraptor', 'rroneek', 'pampa'] },
        { cle: 'hoirie', lieu: 'hoirie', monstres: ['cauahealoa', 'katobleps', 'gomphotherium', 'dosLaineux'] },
      ] },
      { region: 'mondeInephemere', zones: [
        { cle: 'memoire', lieu: 'memoireVivante', monstres: ['aerochat', 'scorpion', 'if', 'ame'] },
      ] },
    ],
    missions: [
      { titre: 'memDonjons9x', cles: ['ihuykatumu', 'worqorZormor', 'cenote', 'avantGarde', 'origenese'] },
      { titre: 'memDonjons100', cles: ['alexandrie', 'pampas', 'parcErrants', 'yuweyawata', 'gardienne', 'meso', 'sillage', 'clyteum'] },
      { titre: 'memDefis', cles: ['worqorLarDor', 'pinacle', 'interphos', 'sanctuaireSerment', 'necropole', 'convoi', 'anticreation'] },
      { titre: 'memAlliance', cles: ['jeuno', 'sandoria', 'windurst'] },
      { titre: 'memRaids', cles: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12'] },
    ],
  };

  RELIQUES.dt = {
    cle: 'dt',
    niveau: 100,
    jobs: JOBS.map((j) => j.code),
    monnaie: 'memoquartz',
    vendeur: 'ermina',
    echangeur: 'dodokkuli',
    phases,
    memoires,
    // Toutes les cases du cristal, pour le décompte.
    casesMemoires: [
      ...memoires.terrain.flatMap((g) => g.zones.flatMap((z) => [`z:${z.cle}:alea`, ...z.monstres.map((_, i) => `z:${z.cle}:m${i}`)])),
      ...memoires.missions.flatMap((c) => c.cles.map((k) => `m:${k}`)),
    ],
    // Missions des opérations de terrain : l'overlay reste affiché pendant celles-ci.
    missionsTerrain: ['lunuleSud', 'lunuleNord'],
    fin: { pnj: 'brigid', objet: 'ecliptite' },
    repliques: 'metallurgiste',
  };
})();
