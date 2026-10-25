// Shadowbringers (niv. 80) : armes de la Résistance, jusqu'aux armes de Gunnhildr.
// Source : ffxiv.consolegameswiki.com (Resistance Weapons), sources de farm d'abord, achats ensuite.
// Chaque phase : quêtes uniques (une seule fois), puis `arme` : ce qu'il faut pour chaque arme (quête répétable).
(function () {
  const { JOBS, RELIQUES } = window.RELIQUE;
  // Faucheur, sage, vipère et pictomancien sont arrivés après Shadowbringers.
  const SANS = ['RPR', 'SGE', 'VPR', 'PCT'];
  const compteur = (cle, qte, sources, pas = [1, 5]) => ({ type: 'compteur', cle, qte, pas, sources });

  const phases = [
    { num: 0, titre: 'phasePrerequis', quetes: [{ id: 'shbMsq', texte: 'shbMsq' }, { id: 'shbCite' }] },
    {
      num: 1, ilvl: 485,
      quetes: [{ id: 'shbReine' }, { id: 'shbPasse' }, { id: 'shbIncident' }, { id: 'shbForge', premiereArme: true, texte: 'premiereArme' }],
      arme: { quete: 'shbFutile', taches: [
        { type: 'objet', cle: 'ecailles', qte: 4, source: { cle: 'srcAchat', pnj: 'auriana', prix: 250, monnaie: 'poetique' } },
      ] },
    },
    {
      num: 2, ilvl: 500,
      quetes: [{ id: 'shbVoeux', texte: 'shbVoeux' }, { id: 'shbAigles' }, { id: 'shbSobre' }],
      arme: { quete: 'shbMemoire', taches: [
        compteur('memTorture', 20, [{ cle: 'srcAleaOr', lieux: ['merNuages', 'coerthasOuest'] }, { cle: 'srcZoneHasard', mission: 'bozja' }]),
        compteur('memChagrin', 20, [{ cle: 'srcAleaOr', lieux: ['avantPays', 'brumes'] }, { cle: 'srcZoneHasard', mission: 'bozja' }]),
        compteur('memAngoisse', 20, [{ cle: 'srcAleaOr', lieux: ['arrierePays', 'azysLla'] }, { cle: 'srcZoneHasard', mission: 'bozja' }]),
      ], conseils: [{ cle: 'shbRang' }] },
    },
    {
      num: 3, ilvl: 500, quetes: [],
      arme: { quete: 'shbVolonte', taches: [
        compteur('memAmer', 6, [
          { cle: 'srcDonjonsHw', mission: 'antitour', n: 1 }, { cle: 'srcRouletteJour', roulette: 'gainNiveaux', n: 1 },
          { cle: 'srcCeHasard', mission: 'bozja' },
        ], [1]),
      ] },
    },
    {
      num: 4, ilvl: 510,
      quetes: [{ id: 'shbSigne', texte: 'shbCastrum' }, { id: 'shbDigne' }, { id: 'shbImage' }],
      arme: { quete: 'shbArmes', taches: [
        compteur('memOdieux', 15, [
          { cle: 'srcInstance', lieu: 'castrum', n: 5 }, { cle: 'srcMissions', missions: ['labyrinthe', 'syrcus', 'tenebres'], n: 1 },
          { cle: 'srcCeHasard', mission: 'bozja' },
        ]),
      ] },
    },
    {
      num: 5, ilvl: 515,
      quetes: [{ id: 'shbSouvient', texte: 'uneFois', taches: [
        compteur('memHantise', 18, [{ cle: 'srcMissions', missions: ['arche', 'mhach', 'dunScaith'], n: 3 }, { cle: 'srcAleaHasard', lieux: ['marches', 'pics', 'lacs'], n: 60 }]),
        compteur('memVexation', 18, [{ cle: 'srcMissions', missions: ['rabanastre', 'ridorana', 'orbonne'], n: 3 }, { cle: 'srcAleaHasard', lieux: ['merRubis', 'yanxia', 'azim'], n: 60 }]),
      ] }],
      arme: { quete: 'shbVoie', taches: [
        compteur('artefact', 15, [{ cle: 'srcMission', mission: 'delubrum', n: 3 }, { cle: 'srcMissionHasard', mission: 'palais' }]),
      ], conseils: [{ cle: 'shbDelubrum', mission: 'delubrum' }] },
    },
    {
      num: 6, ilvl: 535,
      quetes: [
        { id: 'shbTerrain' }, { id: 'shbReves' },
        { id: 'shbPieces', texte: 'uneFois', taches: [
          compteur('essieu', 30, [{ cle: 'srcEscarmouche', mission: 'zadnor', zone: 1, n: 1 }, { cle: 'srcRaid', mission: 'a1', n: 1 }]),
          compteur('ressort', 30, [{ cle: 'srcCeZone', mission: 'zadnor', zone: 1, n: 2 }, { cle: 'srcRaid', mission: 'a4', n: 1 }]),
        ] },
        { id: 'shbHistoire', texte: 'uneFois', taches: [
          compteur('livreRoyaume', 30, [{ cle: 'srcEscarmouche', mission: 'zadnor', zone: 2, n: 1 }, { cle: 'srcRaid', mission: 'o1', n: 1 }]),
          compteur('livreFaille', 30, [{ cle: 'srcCeZone', mission: 'zadnor', zone: 2, n: 2 }, { cle: 'srcRaid', mission: 'o3', n: 1 }]),
        ] },
        { id: 'shbSouvenir', texte: 'uneFois', taches: [
          compteur('memSombre', 30, [{ cle: 'srcEscarmouche', mission: 'zadnor', zone: 3, n: 1 }, { cle: 'srcRaid', mission: 'e1', n: 1 }]),
          compteur('memCriard', 30, [{ cle: 'srcCeZone', mission: 'zadnor', zone: 3, n: 2 }, { cle: 'srcRaid', mission: 'e3', n: 1 }]),
        ] },
        { id: 'shbMarche' },
      ],
      arme: { quete: 'shbIrresistible', taches: [
        compteur('emotion', 15, [
          { cle: 'srcInstance', lieu: 'dalriada', n: 3 }, { cle: 'srcMission', mission: 'delubrum', n: 2 },
          { cle: 'srcDonjonsSb', mission: 'hellsLid', n: 1 }, { cle: 'srcMissionHasard', mission: 'empyree' },
        ]),
      ] },
    },
  ];

  RELIQUES.shb = {
    cle: 'shb',
    niveau: 80,
    jobs: JOBS.map((j) => j.code).filter((c) => !SANS.includes(c)),
    phases,
    // Le front de Bozja et Zadnor sont des zones de farm : l'overlay reste affiché.
    missionsTerrain: ['bozja', 'zadnor'],
  };
})();
