// Stormblood (niv. 70) : armes d'Eurêka, de l'arme vieillie à l'arme Physeos.
// Source : ffxiv.consolegameswiki.com (Eurekan Weapons). Pas de quête par arme : tout se fait chez Gerolt, dans Eurêka.
// Les stades intermédiaires (+1, +2…) sont regroupés : les quantités sont les totaux jusqu'à l'arme du stade.
(function () {
  const { JOBS, RELIQUES } = window.RELIQUE;
  // Pistosabreur et danseur sont arrivés avec Shadowbringers (et les jobs suivants après).
  const SANS = ['GNB', 'DNC', 'RPR', 'SGE', 'VPR', 'PCT'];
  const compteur = (cle, qte, sources, pas = [1, 10, 100]) => ({ type: 'compteur', cle, qte, pas, sources });

  const phases = [
    { num: 0, titre: 'phasePrerequis', quetes: [{ id: 'sbMsq', texte: 'sbMsq' }, { id: 'sbEureka' }] },
    { num: 1, ilvl: 290, quetes: [], arme: { texte: 'sbVieillie' } },
    {
      num: 2, ilvl: 355, quetes: [],
      arme: { pnj: 'geroltAnemos', texte: 'sbAnemos', taches: [
        compteur('proteen', 1300, [{ cle: 'srcNmEchange', mission: 'anemos', objet: 'cristalAnemos' }, { cle: 'srcMonstres', mission: 'anemos' }]),
        compteur('plume', 3, [{ cle: 'srcFateNomme', fate: 'pazuzu', n: 3 }, { cle: 'srcAchatObjet', pnj: 'oiseleur', prix: 300, objet: 'proteen' }], [1]),
      ] },
    },
    {
      num: 3, ilvl: 370, quetes: [],
      arme: { pnj: 'geroltPagos', texte: 'sbTotal', taches: [
        compteur('proteenGivre', 31, [{ cle: 'srcForge', mission: 'pagos' }], [1, 5]),
        compteur('cristalPagos', 500, [{ cle: 'srcNm', mission: 'pagos' }]),
        compteur('glaceLouhi', 5, [{ cle: 'srcFateNomme', fate: 'louhi', n: 2 }, { cle: 'srcAchatObjet', pnj: 'oiseleur', prix: 50, objet: 'cristalPagos' }], [1]),
      ] },
    },
    {
      num: 4, ilvl: 385, quetes: [],
      arme: { pnj: 'geroltPyros', texte: 'sbTotal', taches: [
        compteur('cristalPyros', 650, [{ cle: 'srcNm', mission: 'pyros' }]),
        compteur('flamme', 5, [{ cle: 'srcFateNomme', fate: 'penthesilee', n: 3 }, { cle: 'srcAchatObjet', pnj: 'oiseleur', prix: 50, objet: 'cristalPyros' }], [1]),
        { type: 'case', id: 'sb4', cle: 'logos' },
      ] },
    },
    {
      num: 5, ilvl: 405, quetes: [],
      arme: { pnj: 'geroltHydatos', texte: 'sbTotal', taches: [
        compteur('cristalHydatos', 350, [{ cle: 'srcNm', mission: 'hydatos' }, { cle: 'srcSoutienBa', mission: 'hydatos' }]),
        compteur('ecaille', 5, [{ cle: 'srcFateNomme', fate: 'provenance', n: 3 }], [1]),
      ] },
    },
    {
      num: 6, ilvl: 405, quetes: [],
      arme: { pnj: 'geroltHydatos', texte: 'sbPhyseos', taches: [
        compteur('fragmentEureka', 100, [{ cle: 'srcArsenal', mission: 'hydatos', n: 28 }], [1, 10]),
      ] },
    },
  ];

  RELIQUES.sb = {
    cle: 'sb',
    niveau: 70,
    jobs: JOBS.map((j) => j.code).filter((c) => !SANS.includes(c)),
    phases,
    // Eurêka : zones de farm, l'overlay reste affiché.
    missionsTerrain: ['anemos', 'pagos', 'pyros', 'hydatos'],
  };
})();
