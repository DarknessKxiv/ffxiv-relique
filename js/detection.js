// Lecture des lignes du journal ACT (évènement LogLine d'OverlayPlugin) et traduction en actions de suivi.
// Les trois langues du client (français, anglais, allemand) sont reconnues en même temps : les motifs viennent
// des modèles officiels du jeu (feuille LogMessage) et les noms de noms-jeu.js. Exemples réels (client FR) :
//   00|…|083E||Vous obtenez 60 mémoquartz allagois mathématiques.|
//   00|…|0839||La mission “La Nécropole intemporelle” commence.|   puis   33|…|80034E88|40000003|…  (victoire)
(function () {
  const NJ = window.NOMS_JEU;
  const { JOBS, RELIQUES } = window.RELIQUE;
  const MISSIONS_TERRAIN = Object.values(RELIQUES).flatMap((r) => r.missionsTerrain || []);
  const LANGUES = Object.keys(NJ);

  const norm = (s) => String(s || '').normalize('NFC')
    .replace(/[­-]/g, '')
    .replace(/[’`]/g, "'")
    .replace(/[\s  ]+/g, ' ')
    .trim()
    .toLowerCase();

  // Canaux du chat retenus (7 bits bas du code) : système, butin, progression, jets de butin, artisanat, récolte.
  // Les canaux de discussion des joueurs sont ignorés, personne ne peut fausser le suivi en écrivant dans le chat.
  const CANAUX = new Set([0x39, 0x3E, 0x40, 0x41, 0x42, 0x43]);
  const VICTOIRE = '40000003';

  // Modèles officiels (LogMessage) par langue, sur le texte normalisé (minuscules).
  const MOTIFS = {
    fr: {
      gain: /^vous (?:obtenez|achetez|avez acheté|échangez|fabriquez|recevez|avez reçu)\s/,
      debut: /^la mission “(.+)” commence\.?$/,
      fin: /^la mission “(.+)” prend fin\.?$/,
      bonus: /fonction de mission aléatoire/,
      queteFaite: /^vous avez accompli la quête “(.+)”/,
      queteAcceptee: /^vous acceptez la quête “(.+)”/,
      phrase: /^vous\s/,
    },
    en: {
      gain: /^you (?:obtain|receive|acquire|claim|purchase|exchange|synthesize)\s/,
      debut: /^(.+) has begun\.$/,
      fin: /^(.+) has ended\.$/,
      bonus: /for using the duty roulette/,
      queteFaite: /^“(.+)” complete!?$/,
      queteAcceptee: /^“(.+)” accepted\.?$/,
      phrase: /^you\s/,
    },
    de: {
      gain: /^du (?:hast .+ (?:erhalten|gekauft|erworben|hergestellt)[.!]*$|erhältst\s)/,
      debut: /^„(.+)“ hat begonnen\.$/,
      fin: /^„(.+)“ wurde beendet\.$/,
      bonus: /routine-bonus/,
      queteFaite: /^auftrag „(.+)“ abgeschlossen/,
      queteAcceptee: /^auftrag „(.+)“ angenommen/,
      phrase: /^du\s/,
    },
  };

  // Motif d'un nom du jeu, en mot entier. Marques allemandes : [a] = terminaison d'adjectif, [p] = rien.
  const echapperRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  function motif(nom) {
    const corps = norm(nom).split(/(\[a\]|\[p\])/).map((p) => (p === '[a]' ? '\\p{L}{0,3}' : p === '[p]' ? '' : echapperRe(p))).join('');
    return new RegExp(`(?<!\\p{L})${corps.replace(/ {2,}/g, ' ')}(?!\\p{L})`, 'u');
  }
  // Toutes les formes (pluriel, singulier, nom) de toutes les langues, les plus longues d'abord :
  // « 20 morceaux de pâte de cristal » doit être reconnu en entier pour lire la quantité juste avant.
  const variantes = (listeFormes) => [...new Set(listeFormes.flatMap((f) => [f.pl, f.sg, f.nom]).filter(Boolean))]
    .sort((a, b) => b.length - a.length).map(motif);

  const OBJETS = Object.keys(NJ.fr.objets)
    .filter((cle) => !['memoquartz', 'poetique', 'gemme', 'couteau'].includes(cle))
    .map((cle) => ({ cle, motifs: variantes(LANGUES.map((l) => NJ[l].objets[cle])) }));
  // Armes de toutes les reliques : chacune sait à quelle relique, quel job et quel stade elle correspond.
  const ARMES = Object.keys(RELIQUES).flatMap((relique) => JOBS.filter((j) => NJ.fr.armes[relique]?.[j.code])
    .flatMap((j) => NJ.fr.armes[relique][j.code].map((_, i) => ({
      relique, job: j.code, stade: i + 1, motifs: variantes(LANGUES.flatMap((l) => NJ[l].armes[relique][j.code][i])),
    }))));
  const OBJETS_CLES = { magiSpherier: 'orbes', lunette: 'pate', cristalSavoir: 'mementos' };
  const CLES = Object.entries(OBJETS_CLES).map(([cle, quete]) => ({ quete, motifs: variantes(LANGUES.map((l) => NJ[l].objetsCles[cle])) }));
  const REPLIQUES = LANGUES.map((l) => NJ[l].replique).filter(Boolean);
  // Objets dont le nom contient celui d'une arme ou d'un objet suivi (« Forgotten Fragment of Tenacity »,
  // « Unfinished Bravura »…) : retirés du message avant la recherche, sinon ils passeraient pour eux.
  const HOMONYMES = Object.fromEntries(LANGUES.map((l) => [l, variantes(NJ[l].homonymes || []).map((m) => new RegExp(m.source, 'gu'))]));
  const indexer = (fn) => Object.fromEntries(LANGUES.flatMap((l) => Object.entries(fn(l)).map(([cle, nom]) => [norm(nom), cle])));
  const QUETES = indexer((l) => NJ[l].quetes);
  const MISSIONS = indexer((l) => NJ[l].missions);
  const JOB_PAR_ID = Object.fromEntries(JOBS.map((j) => [String(j.id), j.code]));
  // Missions suivies : cristal de savoir (Dawntrail) et missions à faire avec un job pour une arme (reliques plus anciennes).
  const MISSIONS_SUIVIES = new Set(Object.values(RELIQUES).flatMap((r) => [
    ...(r.memoires?.missions.flatMap((c) => c.cles) || []),
    ...r.phases.flatMap((p) => (p.arme?.taches || []).filter((t) => t.type === 'missions').flatMap((t) => t.groupes.flat())),
  ]));

  let missionEnCours = null;   // nom (normalisé) de la mission commencée
  let derniereLangue = null;

  // Premier motif reconnu dans le texte, avec la quantité écrite juste avant (1 par défaut : « un », « a », « einen »…).
  function trouver(texte, motifs) {
    for (const m of motifs) {
      const r = m.exec(texte);
      if (!r) continue;
      const nombre = texte.slice(0, r.index).match(/(\d{1,3}(?:[ .,]\d{3})+|\d+)\s*$/);
      return { qte: nombre ? parseInt(nombre[1].replace(/\D/g, ''), 10) : 1, longueur: r[0].length };
    }
    return null;
  }

  function victoire() {
    if (!missionEnCours) return [];
    const cle = MISSIONS[missionEnCours];
    missionEnCours = null;  // une seule validation par mission
    return cle && MISSIONS_SUIVIES.has(cle) ? [{ type: 'mission', cle }] : [];
  }

  function langueVue(langue) {
    if (langue === derniereLangue) return [];
    derniereLangue = langue;
    return [{ type: 'langue', langue }];
  }

  function analyserTexte(brut) {
    const texte = norm(brut);
    for (const langue of LANGUES) {
      const m = MOTIFS[langue];
      const vue = () => langueVue(langue);

      const debut = texte.match(m.debut), fin = texte.match(m.fin);
      if (debut || fin) {
        const cle = MISSIONS[norm((debut || fin)[1])];
        missionEnCours = debut ? norm(debut[1]) : null;
        // Les opérations de terrain de Lunule ne comptent pas : c'est là qu'on farme la relique.
        return [...vue(), { type: 'instance', dedans: !!debut && !MISSIONS_TERRAIN.includes(cle) }];
      }
      // Le bonus de roulette n'arrive qu'en cas de réussite (juste avant la ligne de victoire).
      if (m.bonus.test(texte)) return [...vue(), ...victoire()];

      const finie = texte.match(m.queteFaite), acceptee = texte.match(m.queteAcceptee);
      if (finie || acceptee) {
        const cle = QUETES[norm((finie || acceptee)[1])];
        return cle ? [...vue(), { type: 'quete', cle, statut: finie ? 'fait' : 'encours' }] : vue();
      }

      if (m.gain.test(texte)) {
        if (REPLIQUES.some((r) => texte.includes(r))) return vue();
        const net = HOMONYMES[langue].reduce((s, h) => s.replace(h, ' '), texte);
        // Lors d'un échange, l'ancienne et la nouvelle arme peuvent être citées, et « Manderville Axe » est contenu
        // dans « Amazing Manderville Axe » : on garde le stade le plus haut.
        const armes = ARMES.filter((a) => trouver(net, a.motifs)).sort((a, b) => b.stade - a.stade);
        if (armes.length) return [...vue(), { type: 'arme', relique: armes[0].relique, job: armes[0].job, stade: armes[0].stade }];
        let meilleur = null;
        for (const o of OBJETS) {
          const r = trouver(net, o.motifs);
          if (r && (!meilleur || r.longueur > meilleur.longueur)) meilleur = { ...r, cle: o.cle };
        }
        if (meilleur) return [...vue(), { type: 'objet', cle: meilleur.cle, qte: meilleur.qte }];
        const cle = CLES.find((c) => trouver(net, c.motifs));
        return cle ? [...vue(), { type: 'quete', cle: cle.quete, statut: 'encours' }] : vue();
      }

      if (m.phrase.test(texte)) return vue();
    }
    return [];
  }

  // `ligne` : le tableau `line` de l'évènement LogLine (champs séparés par « | »).
  function analyser(ligne) {
    switch (ligne[0]) {
      // Changement de zone : on sort forcément de la mission précédente (« commence » arrive juste après l'entrée).
      case '01': return [{ type: 'instance', dedans: false }];
      case '02': return ligne[3] ? [{ type: 'perso', nom: ligne[3] }] : [];
      case '12': return JOB_PAR_ID[ligne[2]] ? [{ type: 'job', job: JOB_PAR_ID[ligne[2]] }] : [];
      case '33': return ligne[3] === VICTOIRE ? victoire() : [];
      case '00': return CANAUX.has(parseInt(ligne[2], 16) & 0x7F) ? analyserTexte(ligne[4] || '') : [];
      default: return [];
    }
  }

  window.Detection = { analyser, norm };
})();
