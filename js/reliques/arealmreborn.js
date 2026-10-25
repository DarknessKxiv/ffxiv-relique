// A Realm Reborn (niv. 50) : armes du Zodiaque, de l'arme de base à l'arme zêta.
// Source : ffxiv.consolegameswiki.com (Zodiac Weapons), à jour : livres, cartes et mahatma s'achètent en
// mémoquartz poétiques. Après la 1re arme, presque tout se fait chez Jalzahn, sans quête.
(function () {
  const { RELIQUES } = window.RELIQUE;
  const ATMAS = [
    ['atmaLion', 'noscea_ext'], ['atmaVerseau', 'noscea_haute'], ['atmaBelier', 'noscea_centre'], ['atmaCrabe', 'noscea_ouest'],
    ['atmaPoissons', 'noscea_basse'], ['atmaTaureau', 'thanalan_est'], ['atmaBalance', 'thanalan_centre'], ['atmaGemeaux', 'thanalan_ouest'],
    ['atmaScorpion', 'thanalan_sud'], ['atmaSagittaire', 'sombrelinceul_nord'], ['atmaCapricorne', 'sombrelinceul_est'], ['atmaVierge', 'sombrelinceul_centre'],
  ];
  const DUTIES_LUMIERE = { cle: 'arrLumiere', missions: ['bahamutT4', 'emberEx', 'thornEx', 'aurum', 'totoRak'] };

  const phases = [
    { num: 0, titre: 'phasePrerequis', quetes: [{ id: 'arrForgeron', texte: 'arrForgeron' }] },
    {
      num: 1, ilvl: 80, quetes: [],
      // Une version de « A Relic Reborn » par job ({job} est remplacé par le job suivi).
      arme: { quete: 'arrRelique{job}', texte: 'arrBase', taches: [
        { type: 'objet', cle: 'huileTrempe', qte: 1, source: { cle: 'srcAchat', pnj: 'auriana', prix: 15, monnaie: 'poetique' } },
      ] },
    },
    {
      num: 2, ilvl: 90, quetes: [],
      arme: { pnj: 'geroltArr', texte: 'arrZenith', taches: [
        { type: 'objet', cle: 'brume', qte: 3, source: { cle: 'srcAchat', pnj: 'auriana', prix: 20, monnaie: 'poetique' } },
      ] },
    },
    {
      num: 3, ilvl: 100, quetes: [{ id: 'arrArmes' }],
      arme: { pnj: 'jalzahn', taches: [
        { type: 'compteurs', titre: 'titreAtmas', elements: ATMAS.map(([cle, lieu]) => ({ cle, qte: 1, detail: { cle: 'srcAleaZone', lieu } })) },
      ], conseils: [{ cle: 'arrAtma' }] },
    },
    {
      num: 4, ilvl: 100, quetes: [{ id: 'arrBraves' }],
      arme: { pnj: 'jalzahn', texte: 'arrAnimus', taches: [{ type: 'compteJob', id: 'arr4', cle: 'livres', qte: 9, pas: [1] }],
        conseils: [{ cle: 'arrLivres', pnj: 'gjusana', prix: 100, monnaie: 'poetique' }] },
    },
    {
      num: 5, ilvl: 110, quetes: [{ id: 'arrRayonnement' }, { id: 'arrEtoile' }, { id: 'arrTresors' }, { id: 'arrDechets' }],
      arme: { pnj: 'jalzahn', texte: 'arrNovus', taches: [
        { type: 'objet', cle: 'encreSup', qte: 3, source: { cle: 'srcAchat', pnj: 'auriana', prix: 25, monnaie: 'poetique' } },
        { type: 'compteur', cle: 'alexandrite', qte: 75, pas: [5, 15], sources: [
          { cle: 'srcCarteJour', quete: 'arrMorbide', roulette: 'hautNiveau', n: 5 },
          { cle: 'srcCarteAchat', pnj: 'auriana', objet: 'carte', prix: 75, monnaie: 'poetique', n: 5 },
        ] },
        { type: 'compteJob', id: 'arr5', cle: 'materias', qte: 75, pas: [1, 5] },
      ] },
    },
    {
      num: 6, ilvl: 115, quetes: [{ id: 'arrLustre' }],
      arme: { pnj: 'jalzahn', taches: [{ type: 'case', id: 'arr6', cle: 'lumiere' }], conseils: [DUTIES_LUMIERE] },
    },
    {
      num: 7, ilvl: 125, quetes: [{ id: 'arrZodiaque' }],
      arme: { pnj: 'jalzahn', texte: 'arrBravesArme', taches: [
        { type: 'case', id: 'arr7', cle: 'arrMalice', quete: true }, { type: 'case', id: 'arr7', cle: 'arrAmour', quete: true },
        { type: 'case', id: 'arr7', cle: 'arrPonze', quete: true }, { type: 'case', id: 'arr7', cle: 'arrMere', quete: true },
        { type: 'objet', cle: 'noyau', qte: 4, source: { cle: 'srcAchatGc', prix: 20000 } },
        { type: 'objet', cle: 'eauSacree', qte: 4, source: { cle: 'srcAchat', pnj: 'auriana', prix: 200, monnaie: 'poetique' } },
      ] },
    },
    {
      num: 8, ilvl: 135, quetes: [{ id: 'arrReveil' }],
      arme: { pnj: 'jalzahn', taches: [{ type: 'compteJob', id: 'arr8', cle: 'mahatmas', qte: 12, pas: [1] }],
        conseils: [{ cle: 'arrMahatma', pnj: 'remon', prix: 50, monnaie: 'poetique' }, DUTIES_LUMIERE] },
    },
  ];

  RELIQUES.arr = {
    cle: 'arr',
    niveau: 50,
    jobs: ['PLD', 'WAR', 'DRG', 'MNK', 'NIN', 'BRD', 'BLM', 'SMN', 'WHM', 'SCH'],
    phases,
    missionsTerrain: [],
  };
})();
