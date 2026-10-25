// Endwalker (niv. 90) : armes Manderville, de Manderville à Mandervillous.
// Source : ffxiv.consolegameswiki.com (Manderville Weapons). Chaque stade : une quête d'Hildibrand, puis
// 3 objets achetés 500 mémoquartz poétiques pièce chez Jubrunnah et remis avec l'arme précédente.
(function () {
  const { JOBS, RELIQUES } = window.RELIQUE;
  // Vipère et pictomancien sont arrivés avec Dawntrail : pas d'arme Manderville.
  const SANS = ['VPR', 'PCT'];

  // Par stade : la quête d'histoire qui le débloque, puis la quête de la première arme (`echange`).
  // `repetable` : la quête répétable qui sert ensuite pour les autres jobs.
  const phases = [
    {
      num: 0, titre: 'phasePrerequis',
      quetes: [
        { id: 'ewMsq', texte: 'ewMsq' },
        { id: 'ewHildiFin', texte: 'ewHildibrand' },
      ],
    },
    {
      num: 1, ilvl: 615, arcanite: 'meteorite', repetable: 'ewEncore',
      quetes: [{ id: 'ewFaire', echange: true, debut: 'domestiqueManderville', rendu: 'geroltEw' }],
    },
    {
      num: 2, ilvl: 630, arcanite: 'chondrite', repetable: 'ewEblouissante',
      quetes: [
        { id: 'ewGeneration', texte: 'ewHildiStade' },
        { id: 'ewInstinct', echange: true, debut: 'geroltEw', rendu: 'geroltEw' },
      ],
    },
    {
      num: 3, ilvl: 645, arcanite: 'achondrite', repetable: 'ewMajestueuse',
      quetes: [
        { id: 'ewVisiteur', texte: 'ewHildiStade' },
        { id: 'ewForgerons', echange: true, debut: 'geroltEw', rendu: 'geroltEw' },
      ],
    },
    {
      num: 4, ilvl: 665, arcanite: 'cristallite', repetable: 'ewManderveilleuse',
      quetes: [
        { id: 'ewCadeau', texte: 'ewHildiStade' },
        { id: 'ewDanse', echange: true, debut: 'geroltEw', rendu: 'geroltEw' },
      ],
    },
  ];

  RELIQUES.ew = {
    cle: 'ew',
    niveau: 90,
    jobs: JOBS.map((j) => j.code).filter((c) => !SANS.includes(c)),
    monnaie: 'poetique',
    vendeur: 'jubrunnah',
    echangeur: 'artisanManderville',
    phases,
    missionsTerrain: [],
    fin: { pnj: 'alchimisteManderville', objet: 'cristallite' },
  };
})();
