// Heavensward (niv. 60) : armes Anima, de l'arme animée à l'arme lux.
// Source : ffxiv.consolegameswiki.com (Anima Weapons), à jour : objets non identifiés divisés par deux (3.38),
// objets d'artisanat achetables en sceaux de compagnie, sable de cristal par les seuls échanges encore rentables.
(function () {
  const { JOBS, RELIQUES } = window.RELIQUE;
  // Seuls les jobs de Heavensward et d'avant ont une arme Anima.
  const AVEC = ['PLD', 'WAR', 'DRK', 'DRG', 'MNK', 'NIN', 'BRD', 'MCH', 'BLM', 'SMN', 'WHM', 'SCH', 'AST'];
  const CRAFT_GC = (cle) => ({ cle, qte: 4, detail: { cle: 'srcCraftGc', prix: 5000 } });
  const NON_IDENTIFIE = (cle) => ({ cle, qte: 10, detail: { cle: 'srcGordias', mission: 'a1', pnj: 'auriana', prix: 150, monnaie: 'poetique' } });

  const phases = [
    { num: 0, titre: 'phasePrerequis', quetes: [{ id: 'hwMsq', texte: 'hwMsq' }] },
    {
      num: 1, ilvl: 170, quetes: [{ id: 'hwProposition' }],
      arme: { quete: 'hwAme', texte: 'hwAnimee', taches: [
        { type: 'compteurs', titre: 'titreLux', elements: [
          { cle: 'luxVent', qte: 1, detail: { cle: 'srcAleaZone', lieu: 'merNuages' } },
          { cle: 'luxFeu', qte: 1, detail: { cle: 'srcAleaZone', lieu: 'azysLla' } },
          { cle: 'luxFoudre', qte: 1, detail: { cle: 'srcAleaZone', lieu: 'brumes' } },
          { cle: 'luxGlace', qte: 1, detail: { cle: 'srcAleaZone', lieu: 'coerthasOuest' } },
          { cle: 'luxTerre', qte: 1, detail: { cle: 'srcAleaZone', lieu: 'avantPays' } },
          { cle: 'luxEau', qte: 1, detail: { cle: 'srcAleaZone', lieu: 'arrierePays' } },
        ] },
      ], conseils: [{ cle: 'hwZeta' }] },
    },
    {
      num: 2, ilvl: 200, quetes: [],
      arme: { quete: 'hwEndurci', texte: 'hwEveillee', taches: [
        { type: 'missions', id: 'hw2', groupes: [['snowcloak', 'sastashaH', 'qarnH', 'keeper', 'wandererH', 'amdaporH', 'dusk', 'sohmAl', 'aery', 'vault']] },
      ] },
    },
    {
      num: 3, ilvl: 210, quetes: [],
      arme: { quete: 'hwPropre', texte: 'hwAnima', taches: [
        { type: 'compteurs', titre: 'titreNonIdentifies', elements: ['os', 'coquille', 'minerai', 'graines'].map(NON_IDENTIFIE) },
        { type: 'compteurs', titre: 'titreArtisanat', elements: ['francisque', 'miroir', 'fleche', 'galette'].map(CRAFT_GC) },
      ] },
    },
    {
      num: 4, ilvl: 230, quetes: [],
      arme: { quete: 'hwVoix', taches: [
        { type: 'objet', cle: 'huileEther', qte: 5, source: { cle: 'srcAchat', pnj: 'auriana', prix: 350, monnaie: 'poetique' } },
      ] },
    },
    {
      num: 5, ilvl: 240, quetes: [],
      arme: { quete: 'hwReve', texte: 'hwReconditionnee', taches: [
        { type: 'compteur', cle: 'sable', qte: 60, pas: [2, 10], sources: [
          { cle: 'srcEchange', pnj: 'ulan', objet: 'avoirArtisan', n: 5 }, { cle: 'srcEchange', pnj: 'ulan', objet: 'avoirRecolteur', n: 5 },
          { cle: 'srcEchangeEncre', pnj: 'ulan', prix: 225, monnaie: 'poetique' },
        ] },
        { type: 'compteur', cle: 'umbrite', qte: 60, pas: [1, 10], sources: [{ cle: 'srcAchat', pnj: 'auriana', prix: 75, monnaie: 'poetique' }] },
      ] },
    },
    {
      num: 6, ilvl: 260, quetes: [],
      arme: { quete: 'hwAvenir', texte: 'hwAffutee', taches: [
        { type: 'compteur', cle: 'grappe', qte: 50, pas: [1, 18], sources: [
          { cle: 'srcQueteJour', quete: 'hwEtoffe', roulette: 'hautNiveau', n: 1 },
          { cle: 'srcQueteSemaine', quete: 'hwInspiration', roulette: 'gainNiveaux', n: 18 },
          { cle: 'srcAchat', pnj: 'auriana', prix: 40, monnaie: 'poetique' },
        ] },
      ] },
    },
    {
      num: 7, ilvl: 270, quetes: [],
      arme: { quete: 'hwRenaissance', texte: 'hwComplete', taches: [
        { type: 'missions', id: 'hw7', groupes: [['amdaporCiteH', 'gubalH', 'sohmAlH']] },
        { type: 'case', id: 'hw7', cle: 'densite' },
        { type: 'compteur', cle: 'pneumite', qte: 15, pas: [1, 5], sources: [
          { cle: 'srcAchatGc', prix: 4000 }, { cle: 'srcAchat', pnj: 'auriana', prix: 100, monnaie: 'poetique' },
        ] },
      ], conseils: [{ cle: 'hwA9s', mission: 'a9s' }] },
    },
    {
      num: 8, ilvl: 275, quetes: [{ id: 'hwCorps' }, { id: 'hwSagesse' }],
      arme: { quete: 'hwAmis', texte: 'hwLux', taches: [
        { type: 'missions', id: 'hw8', groupes: [
          ['emberH', 'eyeH', 'navelH'], ['thornH', 'whorlH', 'strikingH', 'akhAfahH'], ['thokH', 'limitlessH'], ['s1t7', 'p1t6', 'z1t9'],
        ] },
        { type: 'objet', cle: 'encreArchaique', qte: 1, source: { cle: 'srcAchat', pnj: 'auriana', prix: 500, monnaie: 'poetique' } },
      ] },
    },
  ];

  RELIQUES.hw = {
    cle: 'hw',
    niveau: 60,
    jobs: JOBS.map((j) => j.code).filter((c) => AVEC.includes(c)),
    phases,
    missionsTerrain: [],
  };
})();
