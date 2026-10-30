// Overlay de suivi des reliques : état, affichage, sauvegarde et branchement sur ACT.
(function () {
  const { JOBS, PNJ, RELIQUES } = window.RELIQUE;
  const NJ = window.NOMS_JEU, TX = window.TEXTES;
  const LANGUES = Object.keys(TX);
  const CLE_STOCKAGE = 'reliqueFantome.v1';
  const SANS_PERSO = 'Personnage';  // clés internes des personnages, affichées traduites
  const PERSO_DEMO = 'Démo';
  const VERSION = '1.3.3';
  const MODE_TEST = /[?&]test\b/.test(location.search);
  const MODE_DEMO = /[?&]demo\b/.test(location.search);
  let apercu = false;  // fenêtre d'aperçu d'OverlayPlugin : même progression d'exemple que ?demo
  const enDemo = () => MODE_DEMO || apercu;
  const LANGUE_URL = (location.search.match(/[?&]lang=(\w+)/) || [])[1];
  const LANGUE_NAVIGATEUR = String(navigator.language || '').slice(0, 2).toLowerCase();

  const nouvelEtat = () => ({
    quetes: {}, objets: {}, jauges: {}, memoires: {}, armes: {},
    roulettes: { jour: '', faites: {} }, journal: [], accueilVu: false,
  });
  let racine = {
    version: 1, maj: 0, persoActif: SANS_PERSO, persos: {}, langueJeu: null,
    reglages: { relique: 'dt', compact: false, reduit: false, cacherEnMission: true, echelle: 1, opacite: 0.88, onglet: 'suivi', job: 'auto', langue: 'auto', ouverts: {} },
  };
  let jobJeu = null;        // job joué en ce moment (détecté via ACT)
  let langueAct = null;     // langue réglée dans le plugin FFXIV d'ACT, si OverlayPlugin la donne
  let connecte = false;     // OverlayPlugin présent
  let majLocale = 0;        // date de la copie du navigateur lue au démarrage
  let persosLocaux = new Set();  // personnages de cette copie
  let lueDansAct = false;   // tant que la copie d'ACT n'est pas lue, rien n'y est écrit
  let enMission = false;    // dans un donjon, défi ou raid (hors Lunule)
  let notification = null;  // { k, p, fin }
  let confirmerRaz = false;
  let L = 'en';             // langue de l'affichage en cours
  const app = document.getElementById('app');

  // ---------- Langue ----------
  // Langue « auto » : celle du jeu reconnue dans le chat, sinon celle d'ACT, sinon celle du navigateur.
  const langueAuto = () => [racine.langueJeu, langueAct, LANGUE_NAVIGATEUR].find((l) => TX[l]) || 'en';
  const langueActive = () => (TX[racine.reglages.langue] ? racine.reglages.langue : langueAuto());
  const T = () => TX[L];
  const N = () => NJ[L];

  // Texte de textes.js (chemin « q.forgeron », « j.objet »…) avec ses {paramètres}, déjà échappés.
  function t(chemin, params = {}) {
    const lire = (langue) => chemin.split('.').reduce((o, k) => (o == null ? o : o[k]), TX[langue]);
    const brut = lire(L) ?? lire('en') ?? chemin;
    return String(brut).replace(/\{(\w+)\}/g, (tout, k) => (k in params ? params[k] : tout));
  }

  // ---------- Données dérivées ----------
  const etat = () => (racine.persos[racine.persoActif] ||= nouvelEtat());
  const echapper = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const majuscule = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');
  const nombre = (n) => Number(n || 0).toLocaleString(T().locale);
  const coords = (p) => `X ${p.x.toFixed(1)} Y ${p.y.toFixed(1)}`;
  const liste = (noms) => (noms.length < 2 ? noms.join('') : `${noms.slice(0, -1).join(', ')} ${T().ou} ${noms[noms.length - 1]}`);
  // Formes allemandes : [p] ne s'écrit pas, [a] prend la terminaison du pluriel sans article.
  const pluriel = (f) => (f.pl || f.nom).replace(/\[p\]/g, '').replace(/\[a\]/g, 'e');
  const nomObjet = (cle) => N().objets[cle]?.nom || cle;
  // Nom d'objet-clef au fil d'une phrase : forme courante (minuscules) en FR/EN, nom tel quel en DE (entre guillemets).
  const nomCourant = (cle) => { const f = N().objetsCles[cle]; return L === 'de' || !f.sg ? f.nom : f.sg.replace(/\[p\]/g, ''); };
  const nomPnj = (cle) => N().pnj[PNJ[cle]?.nom || cle];
  // Zone et coordonnées d'un PNJ, déjà échappées : « Ville fantôme X 6.7 Y 7.1 ».
  const situer = (cle) => `${echapper(N().lieux[PNJ[cle].lieu])} <span class="coords">${coords(PNJ[cle])}</span>`;
  const ou = (cle) => (PNJ[cle]?.lieu ? `${nomPnj(cle)} — ${N().lieux[PNJ[cle].lieu]} (${coords(PNJ[cle])})` : nomPnj(cle));
  // PNJ de départ d'une quête, tiré des données du jeu, quand etapes.js ne le précise pas.
  const ouDepart = (id) => { const d = N().departs?.[id]; return d ? `${majuscule(d.pnj)} — ${d.lieu} (${coords(d)})` : ''; };
  const roulette = (cle) => N().roulettes[cle];
  const rouletteCourte = (cle) => majuscule(roulette(cle).replace(/^[^:]+:\s*/, ''));
  const nomPerso = (cle) => (cle === SANS_PERSO ? t('persoDefaut') : cle === PERSO_DEMO ? t('persoDemo') : cle);
  const infoJob = (code) => JOBS.find((j) => j.code === code) || JOBS[1];
  // Noms de jobs : l'anglais met une majuscule à chaque mot (« Dark Knight »), le français seulement au premier.
  const nomJob = (code) => (L === 'en' ? N().classes[code].nom.replace(/\b\p{L}/gu, (c) => c.toUpperCase()) : majuscule(N().classes[code].nom));
  const abrJob = (code) => N().classes[code].abr;
  const jobAffiche = () => (racine.reglages.job === 'auto' ? jobJeu || 'WAR' : racine.reglages.job);

  // Relique suivie (Dawntrail, Endwalker…) : chacune a ses phases, ses stades et ses jobs.
  const rel = () => RELIQUES[racine.reglages.relique] || RELIQUES.dt;
  const phases = () => rel().phases;
  const nbStades = () => rel().phases.length - 1;
  const stades = () => T().stades[rel().cle];
  const ilvl = (stade) => rel().phases[stade]?.ilvl;
  const jobsRelique = () => JOBS.filter((j) => rel().jobs.includes(j.code));
  const armesDe = (relique) => (etat().armes[relique] ||= {});
  const stadeJob = (code, relique = rel().cle) => armesDe(relique)[code] || 0;
  const stadeMax = (relique = rel().cle) => Math.max(0, ...RELIQUES[relique].jobs.map((j) => stadeJob(j, relique)));
  const phaseDe = (id) => phases().find((p) => p.quetes.some((q) => q.id === id) || p.bonus?.id === id);
  const nomQuete = (id) => N().quetes[id];

  function nomArme(code, stade, relique = rel().cle) {
    if (stade < 1) return t('pasArme');
    const formes = N().armes[relique][code]?.[stade - 1];
    if (!formes) return '—';
    // Paladin : arme + bouclier. L'ordre est le même dans toutes les langues ; l'anglais dit lequel est le bouclier.
    const i = Math.max(0, NJ.en.armes[relique][code][stade - 1].findIndex((f) => !/shield/i.test(f.nom)));
    return majuscule(formes[i].nom) + (formes.length > 1 ? ` ${t('bouclier')}` : '');
  }

  // Une quête est faite si elle est cochée, ou si un job possède déjà l'arme de cette phase (ou d'une suivante).
  const queteDeduite = (phase, id) => phase.bonus?.id !== id && stadeMax() >= Math.max(1, phase.num);
  const queteFaite = (phase, id) => !!etat().quetes[id] || queteDeduite(phase, id);

  function prochaineEtape(code) {
    const s = stadeJob(code), ph = phases();
    if (s >= nbStades()) return { fini: true };
    const acces = ph[0].quetes.find((q) => !queteFaite(ph[0], q.id));
    if (acces) return { phase: ph[0], quete: acces };
    const phase = ph[s + 1];
    const quete = phase.quetes.find((q) => !queteFaite(phase, q.id));
    return quete ? { phase, quete } : { phase, echange: true };
  }

  // Mémoquartz encore à dépenser pour finir la relique de ce job.
  const memoquartzRestants = (code) => phases().filter((p) => p.arcanite && p.num > stadeJob(code)).length * 1500;

  // Cases et compteurs propres à une arme (missions à faire avec ce job, livres…) : clé par relique, tâche et job.
  const cleJob = (relique, id, job, cle) => `${relique}:${id}:${job}:${cle}`;
  const caseJob = (id, cle) => cleJob(rel().cle, id, jobAffiche(), cle);
  // Cases de l'arme en cours du job joué, toutes reliques confondues, qui répondent à `test` (mission réussie, quête finie…).
  const casesEnCours = (job, test) => Object.values(RELIQUES).filter((r) => r.jobs.includes(job)).flatMap((r) => {
    const ph = r.phases[stadeJob(job, r.cle) + 1];
    return (ph?.arme?.taches || []).flatMap((tch) => (tch.type === 'missions' ? tch.groupes.flat() : tch.type === 'case' ? [tch.cle] : [])
      .filter((c) => test(tch, c)).map((c) => cleJob(r.cle, tch.id, job, c)));
  });

  function avancement(tache) {
    const e = etat();
    const borne = (v, max) => Math.min(v || 0, max);
    switch (tache.type) {
      case 'missions': { const c = tache.groupes.flat(); return [c.filter((m) => e.memoires[caseJob(tache.id, m)]).length, c.length]; }
      case 'case': return [e.memoires[caseJob(tache.id, tache.cle)] ? 1 : 0, 1];
      case 'compteJob': return [borne(e.jauges[caseJob(tache.id, tache.cle)], tache.qte), tache.qte];
      case 'objet': return [borne(e.objets[tache.cle], tache.qte), tache.qte];
      case 'compteur': return [borne(e.objets[tache.cle], tache.qte), tache.qte];
      case 'compteurs': return tache.elements.reduce(([f, tot], el) => [f + borne(e.objets[el.cle], el.qte), tot + el.qte], [0, 0]);
      case 'jauges': return tache.jauges.reduce(([f, tot], j) => [f + borne(e.jauges[j.cle], tache.max), tot + tache.max], [0, 0]);
      case 'memoires': return [rel().casesMemoires.filter((k) => e.memoires[k]).length, rel().casesMemoires.length];
      default: return [0, 0];
    }
  }
  const tachesPretes = (q) => (q.taches || []).every((tache) => { const [f, tot] = avancement(tache); return f >= tot; });

  // Réinitialisation quotidienne des roulettes à 15 h UTC.
  const cleJour = () => new Date(Date.now() - 15 * 3600 * 1000).toISOString().slice(0, 10);
  function heureReset() {
    const d = new Date();
    d.setUTCHours(15, 0, 0, 0);
    if (d <= new Date()) d.setUTCDate(d.getUTCDate() + 1);
    return d.toLocaleTimeString(T().locale, { hour: '2-digit', minute: '2-digit' });
  }
  function verifierJour() {
    const r = etat().roulettes;
    if (r.jour !== cleJour()) { r.jour = cleJour(); r.faites = {}; }
  }

  // ---------- Paramètres des textes ----------
  // Paramètres décrits dans etapes.js (pnj, lieu, roulette…) → texte affichable et échappé.
  function parametres(desc = {}) {
    const p = { hv: echapper(t('hv')) };
    for (const [k, v] of Object.entries(desc)) {
      if (k === 'cle') continue;
      if (k === 'pnj') p.pnj = echapper(ou(v));
      else if (k === 'lieu') p.lieu = echapper(N().lieux[v]);
      else if (k === 'roulette') p.roulette = echapper(roulette(v));
      else if (k === 'donjon') p.donjon = echapper(N().missions[v]);
      else if (k === 'gemme') p.gemme = echapper(nomObjet(v));
      else if (k === 'artisans') p.artisans = echapper(liste(v.map((c) => N().classes[c].nom)));
      else if (k === 'phase') p.phase = echapper(stades()[v]);
      else if (k === 'lieux') p.lieux = echapper(liste(v.map((c) => N().lieux[c])));
      else if (k === 'missions') p.missions = echapper(liste(v.map((c) => N().missions[c])));
      else if (k === 'mission') p.mission = echapper(N().missions[v]);
      else if (k === 'fate') p.fate = t('cite', { nom: echapper(N().fates[v]) });
      else if (k === 'quete') p.quete = t('cite', { nom: echapper(nomQuete(v)) });
      else if (k === 'objet') p.objet = echapper(nomObjet(v));
      else if (k === 'monnaie') p.monnaie = echapper(pluriel(N().objets[v]));
      else if (k === 'zone') p.zone = v;
      else if (typeof v === 'number') p[k] = nombre(v);
      else p[k] = echapper(v);
    }
    return p;
  }
  const texteDe = (desc, prefixe) => t(prefixe ? `${prefixe}.${desc.cle}` : desc.cle, parametres(desc));

  // Paramètres communs aux textes des quêtes et des conseils.
  const parametresQuetes = () => ({
    gerolt: echapper(nomPnj('gerolt')),
    archeologue: echapper(ou('archeologue')),
    magi: echapper(nomCourant('magiSpherier')),
    lunette: echapper(nomCourant('lunette')),
    cristal: echapper(nomCourant('cristalSavoir')),
    lieu: echapper(N().lieux.lunule),
    sud: echapper(N().lieux.lunuleSud),
    max: nombre(10000),
    n: nombre(1200),
    emote: echapper(N().emotes.feliciter),
    couteau: echapper(nomObjet('couteau')),
    debut: t('cite', { nom: echapper(nomQuete('ewHildiDebut')) }),
    // Reliques plus anciennes
    bozja: echapper(N().missions.bozja),
    castrum: echapper(N().lieux.castrum),
    syndony: echapper(ou('syndony')),
    cristiana: echapper(ou('cristiana')),
    blamprest: echapper(ou('blamprest')),
    ulan: echapper(ou('ulan')),
    hubairtin: echapper(ou('hubairtin')),
    receleur: echapper(nomPnj('receleur')),
    assemblage: t('cite', { nom: echapper(nomQuete('hwAssemblage')) }),
    materia: t('cite', { nom: echapper(nomQuete('arrMateria')) }),
  });

  // Entrée du journal ou notification : { k, p } traduit au moment de l'affichage (ou ancien texte figé { t }).
  function texteEntree(e) {
    if (e.t) return echapper(e.t);
    const p = e.p || {}, r = {};
    if (p.qte != null) r.qte = nombre(p.qte);
    if (p.objet) r.objet = echapper(nomObjet(p.objet));
    if (p.job) r.arme = echapper(nomArme(p.job, p.stade, p.relique || 'dt'));
    if (p.quete) r.quete = echapper(nomQuete(p.quete));
    if (p.mission) r.mission = echapper(majuscule(N().missions[p.mission]));
    if (p.langue) r.langue = echapper(TX[p.langue].langue);
    if (p.texte) r.texte = echapper(p.texte);
    r.cristal = echapper(nomCourant('cristalSavoir'));
    return t(e.k, r);
  }

  // ---------- Petits composants ----------
  const pnj = (fleche, libelle, cle) => `<p class="pnj"><span class="fleche">${fleche}</span> ${libelle} <b>${echapper(majuscule(nomPnj(cle)))}</b> — ${echapper(N().lieux[PNJ[cle].lieu])} <span class="coords">${coords(PNJ[cle])}</span></p>`;
  const depart = (id) => { const d = N().departs?.[id]; return d ? `<p class="pnj"><span class="fleche">▶</span> ${t('debut')} <b>${echapper(majuscule(d.pnj))}</b> — ${echapper(d.lieu)} <span class="coords">${coords(d)}</span></p>` : ''; };
  const barre = (fait, total) => `<div class="barre"><i style="width:${total ? Math.min(100, (fait / total) * 100) : 0}%"></i></div>`;
  const boutonsPas = (act, cle, pas) => `<div class="boutons">${pas.slice().reverse().map((p) => `<button data-act="${act}" data-cle="${cle}" data-n="-${p}">−${p}</button>`).join('')}${pas.map((p) => `<button data-act="${act}" data-cle="${cle}" data-n="${p}">+${p}</button>`).join('')}</div>`;

  function pli(id, titre, compte, corps, ok) {
    const ouvert = !!racine.reglages.ouverts[id];
    return `<div class="pli${ouvert ? ' ouvert' : ''}${ok ? ' ok' : ''}">
      <button class="pli-tete" data-act="pli" data-id="${echapper(id)}"><span>${ouvert ? '▾' : '▸'} ${titre}</span>${compte ? `<b>${compte}</b>` : ''}</button>
      ${ouvert ? `<div class="pli-corps">${corps()}</div>` : ''}</div>`;
  }

  function compteur(cle, qte, pas, detail) {
    const n = etat().objets[cle] || 0;
    return `<div class="compteur${n >= qte ? ' ok' : ''}">
      <div class="compteur-tete"><span>${echapper(nomObjet(cle))}</span><b>${nombre(n)} / ${nombre(qte)}</b></div>
      ${barre(n, qte)}${detail ? `<div class="detail">${detail}</div>` : ''}
      <div class="ligne-saisie">${boutonsPas('ajout', cle, pas)}<input class="saisie" type="number" min="0" value="${n}" data-change="objet" data-cle="${cle}" title="${echapper(t('saisir'))}"></div>
    </div>`;
  }

  function mini(el) {
    const n = etat().objets[el.cle] || 0;
    return `<div class="mini${n >= el.qte ? ' ok' : ''}">
      <span class="mini-nom">${echapper(nomObjet(el.cle))}<small>${texteDe(el.detail)}</small></span>
      <span class="mini-val">${n}/${el.qte}</span>
      <button data-act="ajout" data-cle="${el.cle}" data-n="-1">−</button><button data-act="ajout" data-cle="${el.cle}" data-n="1">+</button>
    </div>`;
  }

  function objetUnique(tache) {
    const ok = (etat().objets[tache.cle] || 0) >= tache.qte;
    return `<div class="objet${ok ? ' ok' : ''}">
      <button class="case" data-act="basculerObjet" data-cle="${tache.cle}" data-qte="${tache.qte}">${ok ? '✔' : ''}</button>
      <div><b>${echapper(nomObjet(tache.cle))}</b><small>${texteDe(tache.source)}</small></div></div>`;
  }

  function jauges(tache) {
    const e = etat();
    const lignes = tache.jauges.map((j) => {
      const v = e.jauges[j.cle] || 0;
      return `<div class="compteur jauge j-${j.cle}${v >= tache.max ? ' ok' : ''}">
        <div class="compteur-tete"><span><i class="pastille"></i>${T().couleurs[j.cle]} · ${echapper(rouletteCourte(j.roulette))}</span><b>${nombre(v)} / ${nombre(tache.max)}</b></div>
        ${barre(v, tache.max)}
        <div class="ligne-saisie">${boutonsPas('jauge', j.cle, [100, 1000])}<input class="saisie" type="number" min="0" max="${tache.max}" value="${v}" data-change="jauge" data-cle="${j.cle}" title="${echapper(t('saisirJeu'))}"></div>
      </div>`;
    }).join('');
    const faites = e.roulettes.faites;
    const jour = tache.jauges.map((j) => `<button class="puce${faites[j.cle] ? ' ok' : ''}" data-act="roulette" data-cle="${j.cle}">${faites[j.cle] ? '✔' : '○'} ${echapper(rouletteCourte(j.roulette))} <small>+${j.bonus}</small></button>`).join('');
    return `<p class="aide">${t('aideMagi', { magi: echapper(nomCourant('magiSpherier')) })}</p>${lignes}
      <div class="roulettes"><div class="sous-titre">${t('bonusJour', { heure: heureReset() })}</div>${jour}</div>`;
  }

  function caseMemoire(cle, libelle, auto) {
    const ok = !!etat().memoires[cle];
    return `<button class="ligne-case${ok ? ' ok' : ''}" data-act="memoire" data-cle="${cle}"><span class="case">${ok ? '✔' : ''}</span><span class="ligne-texte">${libelle}</span>${auto ? `<small class="auto" title="${echapper(t('autoTitre'))}">${t('badgeAuto')}</small>` : ''}</button>`;
  }

  function memoires() {
    const e = etat();
    const [faits, total] = avancement({ type: 'memoires' });
    let h = `<div class="compteur-tete"><span>${echapper(majuscule(N().objetsCles.cristalSavoir.nom))}</span><b>${faits} / ${total}</b></div>${barre(faits, total)}`;
    const { terrain, missions } = rel().memoires;
    terrain.forEach((g, i) => {
      const cles = g.zones.flatMap((z) => [`z:${z.cle}:alea`, ...z.monstres.map((_, k) => `z:${z.cle}:m${k}`)]);
      const n = cles.filter((k) => e.memoires[k]).length;
      h += pli(`mem:t${i}`, t('memTerrain', { region: echapper(N().lieux[g.region]) }), `${n}/${cles.length}`, () => g.zones.map((z) => `<div class="zone"><div class="sous-titre">${echapper(N().lieux[z.lieu])}</div>
        ${caseMemoire(`z:${z.cle}:alea`, t('memAlea'))}
        ${z.monstres.map((m, k) => caseMemoire(`z:${z.cle}:m${k}`, t('memVaincre', { monstre: echapper(majuscule(N().monstres[m])) }))).join('')}</div>`).join(''), n === cles.length);
    });
    missions.forEach((c, i) => {
      const n = c.cles.filter((k) => e.memoires[`m:${k}`]).length;
      h += pli(`mem:m${i}`, t(c.titre), `${n}/${c.cles.length}`, () => c.cles.map((k) => caseMemoire(`m:${k}`, echapper(majuscule(N().missions[k])), true)).join(''), n === c.cles.length);
    });
    return h;
  }

  function sourcesLunule(elements, info) {
    return pli(`src:${info.titre}`, t(info.titre, { lieu: echapper(N().lieux[info.lieu]) }), '', () => `<p class="aide">${t(info.note)}</p>`
      + elements.map((el) => `<div class="sous-titre">${echapper(nomObjet(el.cle))}</div>
      <ul class="liste">${N().sourcesLunule[el.cle].map((s) => `<li>${echapper(s.nom)} <small>(${T().genres[s.genre]})</small></li>`).join('')}</ul>`).join(''));
  }

  // Compteur propre à l'arme du job suivi (livres terminés, mahatma éveillés…).
  function compteJob(tch) {
    const cle = caseJob(tch.id, tch.cle), n = etat().jauges[cle] || 0;
    return `<div class="compteur${n >= tch.qte ? ' ok' : ''}">
      <div class="compteur-tete"><span>${t(`x.${tch.cle}`)}</span><b>${n} / ${tch.qte}</b></div>
      ${barre(n, tch.qte)}<div class="ligne-saisie">${boutonsPas('jauge', cle, tch.pas)}</div></div>`;
  }

  // Missions à réussir avec le job suivi, par groupes à faire dans l'ordre s'il y en a plusieurs.
  function missionsJob(tch) {
    const plusieurs = tch.groupes.length > 1;
    return `<div class="sous-titre">${t(plusieurs ? 'missionsGroupes' : 'missionsJob')}</div>` + tch.groupes.map((g, i) => (plusieurs ? `<small class="groupe">${t('groupe', { n: i + 1 })}</small>` : '')
      + g.map((m) => caseMemoire(caseJob(tch.id, m), echapper(majuscule(N().missions[m])), true)).join('')).join('');
  }

  function tache(tch) {
    switch (tch.type) {
      case 'objet': return objetUnique(tch);
      case 'compteur': return compteur(tch.cle, tch.qte, tch.pas, tch.sources
        ? pli(`src:${tch.cle}`, t('ouObtenir'), '', () => `<ul class="liste">${tch.sources.map((s) => `<li>${majuscule(texteDe(s))}</li>`).join('')}</ul>`) : '');
      case 'compteJob': return compteJob(tch);
      case 'missions': return missionsJob(tch);
      case 'case': return caseMemoire(caseJob(tch.id, tch.cle), tch.quete ? t('cite', { nom: echapper(nomQuete(tch.cle)) }) : t(`x.${tch.cle}`), tch.quete);
      case 'compteurs': {
        const lignes = tch.elements.map((el) => (el.qte > 10 ? compteur(el.cle, el.qte, tch.pas || [1, 10], `<small>${texteDe(el.detail)}</small>`) : mini(el))).join('');
        return `<div class="sous-titre">${t(tch.titre)}</div><div class="grille-mini">${lignes}</div>${tch.lunule ? sourcesLunule(tch.elements, tch.lunule) : ''}`;
      }
      case 'jauges': return jauges(tch);
      case 'memoires': return memoires();
      default: return '';
    }
  }

  const conseils = (q) => (q.conseils || []).map((c) => `<p class="conseil">💡 ${t(`c.${c.cle}`, { ...parametresQuetes(), ...parametres(c) })}</p>`).join('');
  const texteQuete = (q) => (q.texte ? t(`q.${q.texte}`, parametresQuetes()) : '');

  // ---------- Carte « Prochaine étape » ----------
  const etiquette = (phase) => (phase.num
    ? t('phaseEtiquette', { n: phase.num, nom: stades()[phase.num], ilvl: t('ilvl', { n: phase.ilvl }) })
    : t(phase.titre || 'phaseAcces'));

  function carteQuete(code, phase, q) {
    if (q.echange) return carteEchange(code, phase, q);
    const pret = q.taches && tachesPretes(q);
    return `<section class="carte">
      <div class="etiquette">${etiquette(phase)}</div>
      <h2>${t('cite', { nom: echapper(nomQuete(q.id)) })}</h2>
      ${q.debut ? pnj('▶', t('debut'), q.debut) : depart(q.id)}
      ${q.texte ? `<p>${texteQuete(q)}</p>` : ''}
      ${(q.taches || []).map(tache).join('')}
      ${conseils(q)}
      ${q.rendu ? pnj('◀', pret ? `<span class="pret">${t('toutPret')}</span> ${t('rendreA')}` : t('rendreA'), q.rendu) : ''}
      <button class="valider" data-act="quete" data-id="${q.id}" data-val="1">${t(q.premiereArme ? 'queteTermineeArme' : 'queteTerminee')}</button>
    </section>`;
  }

  function carteEchange(code, phase, quete) {
    const r = rel();
    const precedente = echapper(nomArme(code, phase.num - 1));
    const cible = echapper(nomArme(code, phase.num));
    // Échange gratuit, sans objet à acheter (Occultum).
    if (!phase.arcanite) {
      return `<section class="carte">
        <div class="etiquette">${etiquette(phase)}</div>
        <h2>${t('echangerArme')}</h2>
        <p>${t('occultumAvec', { arme: precedente })}</p>
        ${pnj('▶', '', r.echangeur)}
        <p>${t('occultumGratuit', { arme: cible })}</p>
        <button class="valider" data-act="arme" data-job="${code}" data-stade="${phase.num}">${t('armeRecue')}</button>
      </section>`;
    }
    // Première arme du stade : on la reçoit par la quête ; ensuite, échange (ou quête répétable) chez l'échangeur.
    const n = etat().objets[phase.arcanite] || 0;
    const remise = (quete && quete.rendu) || r.echangeur;
    const commun = { pnj: echapper(majuscule(nomPnj(remise))), lieu: situer(remise), cible };
    return `<section class="carte">
      <div class="etiquette">${etiquette(phase)}</div>
      <h2>${quete ? t('cite', { nom: echapper(nomQuete(quete.id)) }) : t('armePhase', { nom: stades()[phase.num] })}</h2>
      ${quete && quete.debut ? pnj('▶', t('debut'), quete.debut) : ''}
      ${!quete && phase.repetable ? `<p>${t('repetable', { quete: t('cite', { nom: echapper(nomQuete(phase.repetable)) }), pnj: echapper(majuscule(ou(r.echangeur))) })}</p>` : ''}
      <ol class="etapes">
        <li>${t('acheterArcanite', { n: 3, arcanite: echapper(nomObjet(phase.arcanite)), vendeur: echapper(majuscule(nomPnj(r.vendeur))), lieu: situer(r.vendeur), memoquartz: echapper(pluriel(N().objets[r.monnaie])), total: nombre(1500) })}</li>
        <li>${phase.num > 1 ? t('echangerAvec', { ...commun, arme: precedente }) : t('echanger', commun)}</li>
      </ol>
      <div class="mini${n >= 3 ? ' ok' : ''}"><span class="mini-nom">${echapper(nomObjet(phase.arcanite))}</span><span class="mini-val">${n}/3</span>
        <button data-act="ajout" data-cle="${phase.arcanite}" data-n="-1">−</button><button data-act="ajout" data-cle="${phase.arcanite}" data-n="1">+</button></div>
      <button class="valider" data-act="arme" data-job="${code}" data-stade="${phase.num}">${t('armeRecue')}</button>
    </section>`;
  }

  // Reliques « par arme » (Shadowbringers et avant) : ce que demande l'arme du stade suivant pour ce job.
  function carteArme(code, phase) {
    const a = phase.arme, quete = a.quete && a.quete.replace('{job}', code);
    const pret = a.taches && tachesPretes(a);
    return `<section class="carte">
      <div class="etiquette">${etiquette(phase)}</div>
      <h2>${echapper(nomArme(code, phase.num))}</h2>
      ${quete ? `<p>${t('queteArme', { quete: t('cite', { nom: echapper(nomQuete(quete)) }) })}</p>${depart(quete)}` : ''}
      ${a.texte ? `<p>${t(`a.${a.texte}`, parametresQuetes())}</p>` : ''}
      ${(a.taches || []).map(tache).join('')}
      ${conseils(a)}
      ${phase.num > 1 ? `<p class="aide">${t('garderArme', { arme: echapper(nomArme(code, phase.num - 1)) })}</p>` : ''}
      ${a.pnj ? pnj('◀', pret ? `<span class="pret">${t('toutPret')}</span> ${t('ameliorer')}` : t('ameliorer'), a.pnj) : ''}
      <button class="valider" data-act="arme" data-job="${code}" data-stade="${phase.num}">${t('armeRecue')}</button>
    </section>`;
  }

  function carteFinie(code) {
    const r = rel(), max = nbStades();
    const suivants = jobsRelique().filter((j) => stadeJob(j.code) < max).sort((a, b) => stadeJob(b.code) - stadeJob(a.code)).slice(0, 5);
    return `<section class="carte fini">
      <div class="etiquette">${t('finiEtiquette')}</div>
      <h2>🎉 ${echapper(nomArme(code, max))}</h2>
      <p>${r.fin ? t('finiTexte', { ilvl: t('ilvl', { n: ilvl(max) }), pnj: echapper(ou(r.fin.pnj)), objet: echapper(nomObjet(r.fin.objet)) }) : `${t('ilvl', { n: ilvl(max) })}.`}
        ${r.repliques ? t('finiReplique', { metallurgiste: echapper(ou(r.repliques)) }) : ''}</p>
      ${suivants.length ? `<div class="sous-titre">${t('prochainsJobs')}</div>${suivants.map((j) => `<button class="puce" data-act="choisirJob" data-job="${j.code}">${echapper(nomJob(j.code))} · ${stades()[stadeJob(j.code)]}</button>`).join('')}` : ''}
    </section>`;
  }

  function carteProchaine(code) {
    if (!rel().jobs.includes(code)) return `<section class="carte"><p>${t('jobSansRelique', { job: echapper(nomJob(code)) })}</p></section>`;
    const e = prochaineEtape(code);
    if (e.fini) return carteFinie(code);
    if (e.echange) return e.phase.arme ? carteArme(code, e.phase) : carteEchange(code, e.phase, null);
    return carteQuete(code, e.phase, e.quete);
  }

  // ---------- Zones fixes ----------
  // Une ligne pour la barre réduite : la prochaine étape et son avancement.
  function resumeCourt(code) {
    const e = prochaineEtape(code);
    if (e.fini) return `${nomArme(code, nbStades())} ✔`;
    const nom = stades()[e.phase.num];
    const progres = (taches = []) => {
      const [fait, total] = taches.reduce(([f, tot], tch) => { const [a, b] = avancement(tch); return [f + a, tot + b]; }, [0, 0]);
      return total ? ` · ${nombre(fait)}/${nombre(total)}` : '';
    };
    if (e.echange && e.phase.arme) return `${nomArme(code, e.phase.num)}${progres(e.phase.arme.taches)}`;
    if (e.echange) {
      if (!e.phase.arcanite) return t('resumeOccultum', { nom, pnj: majuscule(nomPnj(rel().echangeur)) });
      return t('resumeArcanite', { nom, n: etat().objets[e.phase.arcanite] || 0, arcanite: nomObjet(e.phase.arcanite) });
    }
    return `${t('cite', { nom: nomQuete(e.quete.id) })}${progres(e.quete.taches)}`;
  }

  function entete(code) {
    const r = racine.reglages;
    const point = `<span class="act${connecte ? ' ok' : ''}" title="${echapper(t(connecte ? 'actOk' : 'actNon'))}">●</span>`;
    const reduire = `<button class="icone" data-act="reduire" title="${echapper(t(r.reduit ? 'deplier' : 'reduire'))}">${r.reduit ? '▾' : '▴'}</button>`;
    if (r.reduit) {
      const j = infoJob(code);
      return `<header class="entete"><span class="role ${j.role}">${echapper(abrJob(code))}</span><span class="resume-court">${echapper(resumeCourt(code))}</span>${point}${reduire}</header>`;
    }
    const auto = `${t('auto')}${jobJeu ? ` · ${nomJob(jobJeu)}` : ''}`;
    return `<header class="entete">
      <select class="titre-relique" data-change="relique" title="${echapper(t('choisirRelique'))}">
        ${Object.values(RELIQUES).map((x) => `<option value="${x.cle}"${rel().cle === x.cle ? ' selected' : ''} title="${t('ilvl', { n: x.phases[x.phases.length - 1].ilvl })}">◆ ${echapper(T().reliques[x.cle])}</option>`).join('')}
      </select>
      <select data-change="job" title="${echapper(t('jobSuivi'))}">
        <option value="auto"${r.job === 'auto' ? ' selected' : ''}>${echapper(auto)}</option>
        ${jobsRelique().map((j) => `<option value="${j.code}"${r.job === j.code ? ' selected' : ''}>${echapper(nomJob(j.code))}</option>`).join('')}
      </select>
      ${point}
      <button class="icone${r.compact ? '' : ' actif'}" data-act="compact" title="${echapper(t(r.compact ? 'afficherOnglets' : 'masquerOnglets'))}">☰</button>
      ${reduire}
    </header>`;
  }

  function resume(code) {
    const j = infoJob(code), s = stadeJob(code);
    const restants = memoquartzRestants(code);
    return `<section class="resume">
      <div class="ligne-job"><span class="role ${j.role}">${echapper(abrJob(code))}</span><b>${echapper(nomJob(code))}</b>${racine.persoActif !== SANS_PERSO ? `<small>${echapper(nomPerso(racine.persoActif))}</small>` : ''}</div>
      <div class="arme">
        <button data-act="stade" data-job="${code}" data-n="-1" title="${echapper(t('stadePrec'))}">‹</button>
        <span>${rel().jobs.includes(code) ? echapper(nomArme(code, s)) : '—'}${ilvl(s) ? ` <small>${t('ilvl', { n: ilvl(s) })}</small>` : ''}</span>
        <button data-act="stade" data-job="${code}" data-n="1" title="${echapper(t('stadeSuiv'))}">›</button>
      </div>
      <ol class="phases">${Array.from({ length: nbStades() }, (_, i) => i + 1).map((n) => `<li class="${n <= s ? 'fait' : n === s + 1 ? 'encours' : ''}" title="${stades()[n]} · ${t('ilvl', { n: ilvl(n) })}">${stades()[n]}</li>`).join('')}</ol>
      ${restants ? `<div class="cout">${t('memoquartzRestants', { n: nombre(restants) })}</div>` : ''}
    </section>`;
  }

  function accueil() {
    if (etat().accueilVu) return '';
    return `<section class="accueil">
      <span>${t('accueil')}</span>
      <small>${t('accueilVerif')}</small>
      <button data-act="accueilVu">${t('compris')}</button>
    </section>`;
  }

  function toast() {
    if (!notification || notification.fin < Date.now()) return '';
    return `<div class="toast">${texteEntree(notification)}</div>`;
  }

  // ---------- Onglets (mode détaillé) ----------
  function ongletSuivi(code) {
    const s = stadeJob(code), r = rel();
    const echangeur = echapper(majuscule(ou(r.echangeur)));
    return phases().map((phase) => {
      const quetes = phase.quetes.map((q) => {
        const fait = queteFaite(phase, q.id), deduite = !etat().quetes[q.id] && queteDeduite(phase, q.id);
        const sous = q.echange
          ? t('sousEchange', { arcanite: echapper(nomObjet(phase.arcanite)), total: nombre(1500), pnj: echangeur })
          : q.premiereArme ? t('sousOccultum', { dodokkuli: echangeur }) : '';
        return `<div class="quete${fait ? ' faite' : ''}">
          <button class="case" data-act="quete" data-id="${q.id}" title="${echapper(t(deduite ? 'deduiteTitre' : 'cocherTitre'))}">${fait ? '✔' : ''}</button>
          <div class="quete-corps"><b>${echapper(nomQuete(q.id))}</b>${deduite ? `<small class="auto">${t('deduite')}</small>` : ''}
            ${q.debut ? `<small>${t('debut')} ${echapper(majuscule(ou(q.debut)))}</small>` : N().departs?.[q.id] ? `<small>${t('debut')} ${echapper(ouDepart(q.id))}</small>` : ''}
            ${sous ? `<small>${sous}</small>` : ''}
            ${!fait && q.taches ? `<div class="taches">${q.taches.map(tache).join('')}</div>` : ''}
          </div></div>`;
      }).join('');
      const b = phase.bonus;
      const bonus = b ? `<div class="quete${etat().quetes[b.id] ? ' faite' : ''}">
          <button class="case" data-act="quete" data-id="${b.id}">${etat().quetes[b.id] ? '✔' : ''}</button>
          <div class="quete-corps"><b>${echapper(nomQuete(b.id))}</b><small>${texteQuete(b)}</small></div></div>` : '';
      // Reliques « par arme » : l'arme du stade pour ce job, avec ses tâches quand c'est la prochaine.
      const a = rel().jobs.includes(code) && phase.arme, armeFaite = s >= phase.num;
      const quete = a && a.quete && a.quete.replace('{job}', code);
      const arme = a ? `<div class="quete${armeFaite ? ' faite' : ''}">
          <button class="case" data-act="arme" data-job="${code}" data-stade="${phase.num}" title="${echapper(t('armeRecue'))}">${armeFaite ? '✔' : ''}</button>
          <div class="quete-corps"><b>${echapper(nomArme(code, phase.num))}</b>
            ${quete ? `<small>${t('queteArme', { quete: t('cite', { nom: echapper(nomQuete(quete)) }) })}</small>` : ''}
            ${!armeFaite && phase.num === s + 1 && a.taches ? `<div class="taches">${a.taches.map(tache).join('')}</div>` : ''}
          </div></div>` : '';
      const faites = phase.quetes.filter((q) => queteFaite(phase, q.id)).length + (a && armeFaite ? 1 : 0);
      const total = phase.quetes.length + (a ? 1 : 0);
      const titre = phase.num ? `${phase.num}. ${stades()[phase.num]} <small>${t('ilvl', { n: phase.ilvl })}</small>` : t(phase.titre || 'phaseAcces');
      const id = `ph:${r.cle}:${phase.num}`;
      if (racine.reglages.ouverts[id] === undefined && phase.num === s + 1) racine.reglages.ouverts[id] = true;
      const toutes = total > 0 && faites === total;
      return pli(id, titre, toutes ? '✔' : total ? `${faites}/${total}` : '', () => quetes + arme + bonus, toutes);
    }).join('') + (r.repliques ? `<p class="aide">${t('repliques', { metallurgiste: echapper(ou(r.repliques)) })}</p>` : '');
  }

  function ongletJobs(code) {
    return ['tank', 'soin', 'dps'].map((role) => `<div class="sous-titre">${T().roles[role]}</div>` + jobsRelique().filter((j) => j.role === role).map((j) => {
      const s = stadeJob(j.code);
      return `<div class="job${j.code === code ? ' actif' : ''}${s >= nbStades() ? ' ok' : ''}">
        <button class="job-nom" data-act="choisirJob" data-job="${j.code}"><span class="role ${j.role}">${echapper(abrJob(j.code))}</span>${echapper(nomJob(j.code))}</button>
        <button data-act="stade" data-job="${j.code}" data-n="-1">‹</button>
        <span class="job-stade" title="${echapper(nomArme(j.code, s))}">${stades()[s]}</span>
        <button data-act="stade" data-job="${j.code}" data-n="1">›</button>
      </div>`;
    }).join('')).join('');
  }

  function ongletJournal() {
    const j = etat().journal;
    if (!j.length) return `<p class="aide">${t('journalVide')}${connecte ? '' : t('journalHorsAct')}</p>`;
    return `<ul class="journal">${j.map((l) => `<li><time>${l.h}</time>${texteEntree(l)}</li>`).join('')}</ul>`;
  }

  function ongletReglages() {
    const r = racine.reglages;
    const tests = MODE_TEST ? `<div class="sous-titre">${t('regTests')}</div>${[
      '02|t|10000001|Aventurier Test|', '12|t|21|0|0|', '12|t|19|0|0|',
      '00|t|083E||Vous obtenez un demi-âtma saphir.|', '00|t|083E||Vous obtenez 20 morceaux de pâte de cristal.|',
      '00|t|083E||Vous obtenez une bardiche fantôme penumbra.|', '00|t|0839||La mission “Le Mésoterminal” commence.|',
      '00|t|083E||You obtain 20 pinches of crystal paste.|', '00|t|083E||You obtain a phantom bardiche umbrae.|',
      '00|t|0839||The Meso Terminal has begun.|',
      '00|t|083E||Du hast 13 Entphantomisierer α erhalten.|', '00|t|083E||Du hast einen Phantom-Berdysch Obscurum erhalten.|',
      '00|t|0839||„Das Meso-System“ hat begonnen.|',
      '00|t|083E||Vous obtenez 3 morceaux de météorite rarissime.|', '00|t|083E||Vous obtenez une hache éblouissante des Manderville.|',
      '00|t|083E||You obtain a Mandervillous battleaxe.|',
      '00|t|000A|Joueur|Vous obtenez 50 morceaux de pâte de cristal.|',
      '33|t|80034E88|40000003|00|00|00|00|', '01|t|4AD|Zone|',
    ].map((l) => `<button class="puce test" data-act="simuler" data-ligne="${echapper(l)}">${echapper(l.startsWith('00|') ? l.split('|')[4] : l)}</button>`).join('')}` : '';
    return `<div class="reglage"><span>${t('regLangue')}</span><select data-change="langue">
        <option value="auto"${TX[r.langue] ? '' : ' selected'}>${t('auto')} (${TX[langueAuto()].langue})</option>
        ${LANGUES.map((l) => `<option value="${l}"${r.langue === l ? ' selected' : ''}>${TX[l].langue}</option>`).join('')}
      </select></div>
      <div class="reglage"><span>${t('regTaille')}</span><span class="valeur"><button data-act="echelle" data-n="-0.1">A−</button> ${Math.round(r.echelle * 100)} % <button data-act="echelle" data-n="0.1">A+</button></span></div>
      <div class="reglage"><span>${t('regOpacite')}</span><span class="valeur"><button data-act="opacite" data-n="-0.1">−</button> ${Math.round(r.opacite * 100)} % <button data-act="opacite" data-n="0.1">+</button></span></div>
      <div class="reglage"><span>${t('regCacher')}<small>${t('regCacherAide', { lieu: echapper(N().lieux.lunule) })}</small></span><button data-act="cacherMission">${t(r.cacherEnMission ? 'oui' : 'non')}</button></div>
      <div class="reglage"><span>${t('regPerso')}</span><b>${echapper(nomPerso(racine.persoActif))}</b></div>
      <div class="sous-titre">${t('regSauvegarde')}</div>
      <p class="aide">${t(connecte ? 'regSauvegardeAct' : 'regSauvegardeNav')}</p>
      <div class="boutons"><button data-act="exporter">${t('exporter')}</button><button data-act="importer">${t('importer')}</button></div>
      <textarea id="echange" spellcheck="false" placeholder="${echapper(t('placeholder'))}"></textarea>
      <div class="sous-titre">${t('regRaz')}</div>
      <button class="danger" data-act="raz">${t(confirmerRaz ? 'razConfirm' : 'razBtn')}</button>
      ${tests}
      <p class="aide">${t('nomOutil')} v${VERSION}${enDemo() ? t('demo') : ''}</p>`;
  }

  function onglets(code) {
    const r = racine.reglages;
    const corps = { suivi: ongletSuivi, jobs: ongletJobs, journal: ongletJournal, reglages: ongletReglages }[r.onglet] || ongletSuivi;
    return `<nav class="onglets">${Object.entries(T().onglets).map(([id, nom]) => `<button class="${r.onglet === id ? 'actif' : ''}" data-act="onglet" data-id="${id}">${nom}</button>`).join('')}</nav>
      <section class="onglet">${corps(code)}</section>`;
  }

  function rendre() {
    L = langueActive();
    verifierJour();
    const r = racine.reglages, code = jobAffiche();
    document.documentElement.lang = L;
    document.title = t('nomOutil');
    document.documentElement.style.setProperty('--echelle', r.echelle);
    document.documentElement.style.setProperty('--opacite', r.opacite);
    // Caché pendant une mission : la page est vide, donc transparente, et les clics passent au jeu.
    app.hidden = r.cacherEnMission && enMission;
    if (app.hidden) { app.innerHTML = ''; return; }
    app.className = `panneau${r.reduit ? ' reduit' : r.compact ? ' compact' : ''}`;
    app.innerHTML = entete(code) + toast()
      + (r.reduit ? '' : resume(code) + accueil() + carteProchaine(code) + (r.compact ? '' : onglets(code)));
  }

  // ---------- Sauvegarde ----------
  let minuterie = null;
  function sauver() {
    if (enDemo()) return;
    racine.maj = Date.now();
    clearTimeout(minuterie);
    minuterie = setTimeout(() => {
      if (enDemo()) return;  // passé en aperçu entre-temps : la progression d'exemple ne doit rien écraser
      try { localStorage.setItem(CLE_STOCKAGE, JSON.stringify(racine)); } catch (e) { /* stockage indisponible */ }
      if (connecte && lueDansAct) Overlay.appeler({ call: 'saveData', key: CLE_STOCKAGE, data: racine }).catch(() => {});
    }, 300);
  }

  function adopter(d) {
    if (!d || d.version !== 1 || !d.persos) return false;
    // Les sauvegardes d'avant la v1.1 viennent forcément d'un client français (seule langue gérée alors).
    racine = { ...racine, langueJeu: 'fr', ...d, reglages: { ...racine.reglages, ...d.reglages } };
    // Avant la v1.2, une seule relique : les armes { WAR: 2 } deviennent celles de Dawntrail { dt: { WAR: 2 } }.
    for (const perso of Object.values(racine.persos)) {
      if (Object.values(perso.armes || {}).some((v) => typeof v === 'number')) perso.armes = { dt: perso.armes };
    }
    return true;
  }

  function chargerLocal() {
    try {
      const d = JSON.parse(localStorage.getItem(CLE_STOCKAGE));
      if (adopter(d)) { majLocale = d.maj || 0; persosLocaux = new Set(Object.keys(d.persos)); }
    } catch (e) { /* rien d'enregistré */ }
  }

  // Mode démo (?demo, ou fenêtre d'aperçu d'OverlayPlugin) : progression d'exemple au milieu d'une étape,
  // pour voir l'outil en action, jamais enregistrée.
  function chargerDemo() {
    const e = Object.assign(nouvelEtat(), {
      accueilVu: true,
      armes: { dt: { WAR: 2, PLD: 1, WHM: 1 }, ew: { WAR: 4, PLD: 2 } },
      quetes: { recherche: true },
      objets: { pate: 640 },
      journal: [{ h: '21:04', k: 'j.objet', p: { qte: 20, objet: 'pate' } }, { h: '20:51', k: 'j.objet', p: { qte: 15, objet: 'pate' } }],
    });
    racine.persos = { [PERSO_DEMO]: e };
    racine.persoActif = PERSO_DEMO;
    // Affichage complet sur la relique Dawntrail, quels que soient les réglages enregistrés.
    Object.assign(racine.reglages, { relique: 'dt', job: 'WAR', reduit: false, compact: false, onglet: 'suivi' });
  }

  async function avecDelai(promesse) {
    return Promise.race([promesse, new Promise((_, rejeter) => setTimeout(rejeter, 3000))]);
  }

  async function chargerDepuisAct() {
    try {
      const rep = await avecDelai(Overlay.appeler({ call: 'loadData', key: CLE_STOCKAGE }));
      const avant = racine;
      if (!enDemo() && rep?.data && adopter(rep.data)) {
        // On compare les deux copies enregistrées, pas l'état du moment : la détection du personnage, juste
        // après l'ouverture, a déjà daté l'état d'aujourd'hui. Et aucun personnage ne doit disparaître :
        // ceux qui ne sont que dans l'une des deux copies sont gardés.
        const deAct = racine.persos;
        if (majLocale > (rep.data.maj || 0)) {
          // Un personnage créé depuis l'ouverture (vide) ne remplace pas celui qu'ACT connaît déjà.
          const locaux = Object.entries(avant.persos).filter(([nom]) => persosLocaux.has(nom) || !deAct[nom]);
          racine.persos = { ...deAct, ...Object.fromEntries(locaux) };
          racine.reglages = avant.reglages;
        } else {
          racine.persos = { ...avant.persos, ...deAct };
        }
        if (avant.persoActif !== SANS_PERSO) racine.persoActif = avant.persoActif;
        changerPerso(persoEnJeu);  // la sauvegarde ne doit pas écraser le personnage déjà détecté
      }
    } catch (e) { /* OverlayPlugin sans stockage : la copie locale suffit */ }
    lueDansAct = true;
    sauver();
    rendre();
  }

  // Langue réglée dans le plugin FFXIV d'ACT : sert tant que la langue du jeu n'a pas été reconnue dans le chat.
  async function lireLangueAct() {
    try {
      const nom = String((await avecDelai(Overlay.appeler({ call: 'getLanguage' })))?.language || '').toLowerCase();
      const code = /^(fr|french)/.test(nom) ? 'fr' : /^(en|english)/.test(nom) ? 'en' : /^(de|german)/.test(nom) ? 'de' : null;
      if (code) { langueAct = code; rendre(); }
    } catch (e) { /* OverlayPlugin sans cette fonction : la langue viendra du chat */ }
  }

  // ---------- Détection automatique ----------
  function noter(k, p = {}, visible = true) {
    const e = etat();
    e.journal.unshift({ h: new Date().toTimeString().slice(0, 5), k, p });  // HH:MM, identique dans toutes les langues
    e.journal.length = Math.min(e.journal.length, 50);
    if (visible) {
      notification = { k, p, fin: Date.now() + 5000 };
      setTimeout(rendre, 5100);
    }
  }

  let persoEnJeu = null;
  function changerPerso(nom) {
    if (nom) persoEnJeu = nom;
    if (!nom || nom === racine.persoActif) return;
    if (racine.persos[SANS_PERSO] && !racine.persos[nom]) {
      racine.persos[nom] = racine.persos[SANS_PERSO];  // la saisie faite avant la connexion revient à ce personnage
      delete racine.persos[SANS_PERSO];
    }
    racine.persoActif = nom;
  }

  // Sans identifiant, le premier combattant renvoyé est le joueur (case 0 de la table des objets du jeu) :
  // on ne s'en sert que pour le job, le personnage est confirmé par les lignes 02 ou ChangePrimaryPlayer.
  async function lireJobEnJeu(id) {
    try {
      const rep = await Overlay.appeler(id ? { call: 'getCombatants', ids: [typeof id === 'string' ? parseInt(id, 16) : id] } : { call: 'getCombatants' });
      const job = JOBS.find((j) => j.id === rep?.combatants?.[0]?.Job);
      if (job) { jobJeu = job.code; rendre(); }
    } catch (e) { /* le job sera connu au prochain changement */ }
  }

  function appliquer(a) {
    const e = etat();
    switch (a.type) {
      case 'perso': changerPerso(a.nom); break;
      case 'job': if (jobJeu === a.job) return; jobJeu = a.job; break;
      case 'langue': {
        if (racine.langueJeu === a.langue) return;
        const avant = langueActive();
        racine.langueJeu = a.langue;
        if (langueActive() !== avant) { L = langueActive(); noter('j.langue', { langue: a.langue }); }
        break;
      }
      case 'objet':
        e.objets[a.cle] = (e.objets[a.cle] || 0) + a.qte;
        noter('j.objet', { qte: a.qte, objet: a.cle });
        break;
      case 'arme': {
        const relique = a.relique || rel().cle;
        if (a.stade > stadeJob(a.job, relique)) {
          const phase = RELIQUES[relique].phases[a.stade];
          // Première arme offerte par une quête (« Fire in the Forge ») : rien n'est remis.
          const offerte = phase.quetes.some((q) => q.premiereArme) && stadeMax(relique) < a.stade;
          armesDe(relique)[a.job] = a.stade;
          // Les objets demandés sont remis avec l'arme : 3 objets d'échange, ou ceux de l'étape « par arme ».
          const remis = offerte ? [] : phase.arcanite ? [{ cle: phase.arcanite, qte: 3 }]
            : (phase.arme?.taches || []).flatMap((tch) => (tch.type === 'compteurs' ? tch.elements : ['objet', 'compteur'].includes(tch.type) ? [tch] : []));
          for (const o of remis) e.objets[o.cle] = Math.max(0, (e.objets[o.cle] || 0) - o.qte);
        }
        noter('j.arme', { relique, job: a.job, stade: a.stade });
        break;
      }
      case 'quete':
        if (a.statut === 'fait') {
          e.quetes[a.cle] = true;
          casesEnCours(jobJeu || jobAffiche(), (tch, c) => tch.quete && c === a.cle).forEach((k) => { e.memoires[k] = true; });
        }
        noter(a.statut === 'fait' ? 'j.queteFaite' : 'j.queteEnCours', { quete: a.cle });
        break;
      case 'mission': {
        // Missions à faire avec le job joué pour son arme en cours (reliques plus anciennes).
        const cases = casesEnCours(jobJeu || jobAffiche(), (tch, c) => tch.type === 'missions' && c === a.cle);
        cases.forEach((k) => { e.memoires[k] = true; });
        // Le cristal de savoir ne compte que pendant « Les mémentos martiaux » (arme eclipticum obtenue).
        const memoire = RELIQUES.dt.memoires.missions.some((c) => c.cles.includes(a.cle))
          && stadeMax('dt') >= 4 && !e.quetes.mementos && stadeMax('dt') < 5;
        if (memoire) e.memoires[`m:${a.cle}`] = true;
        noter(cases.length || memoire ? 'j.mission' : 'j.missionHors', { mission: a.cle }, cases.length > 0 || memoire);
        break;
      }
      case 'instance':
        if (enMission === a.dedans) return;
        enMission = a.dedans;
        rendre();
        return;
      default: return;
    }
    sauver();
    rendre();
  }

  // Dans la fenêtre d'aperçu, l'exemple reste figé : les lignes du jeu sont ignorées.
  const surLigne = (ev) => !apercu && Array.isArray(ev.line) && Detection.analyser(ev.line).forEach(appliquer);

  // ---------- Interactions ----------
  function changerStade(code, delta) {
    if (!rel().jobs.includes(code)) return;
    armesDe(rel().cle)[code] = Math.max(0, Math.min(nbStades(), stadeJob(code) + delta));
  }

  app.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-act]');
    if (!b) return;
    const d = b.dataset, e = etat(), r = racine.reglages;
    if (d.act !== 'raz') confirmerRaz = false;
    switch (d.act) {
      case 'quete': {
        const phase = phaseDe(d.id);
        if (d.val) e.quetes[d.id] = true;
        else if (queteDeduite(phase, d.id) && !e.quetes[d.id]) { noter('j.deduite'); break; }
        else e.quetes[d.id] = !e.quetes[d.id];
        const q = phase.quetes.find((x) => x.id === d.id);
        if (q?.premiereArme && e.quetes[d.id]) armesDe(rel().cle)[jobAffiche()] = Math.max(stadeJob(jobAffiche()), phase.num);
        break;
      }
      case 'arme': appliquer({ type: 'arme', relique: rel().cle, job: d.job, stade: Number(d.stade) }); return;
      case 'stade': changerStade(d.job, Number(d.n)); break;
      case 'ajout': e.objets[d.cle] = Math.max(0, (e.objets[d.cle] || 0) + Number(d.n)); break;
      case 'basculerObjet': e.objets[d.cle] = (e.objets[d.cle] || 0) >= Number(d.qte) ? 0 : Number(d.qte); break;
      case 'jauge': e.jauges[d.cle] = Math.max(0, Math.min(10000, (e.jauges[d.cle] || 0) + Number(d.n))); break;
      case 'roulette': e.roulettes.faites[d.cle] = !e.roulettes.faites[d.cle]; break;
      case 'memoire': e.memoires[d.cle] = !e.memoires[d.cle]; break;
      case 'pli': r.ouverts[d.id] = !r.ouverts[d.id]; break;
      case 'onglet': r.onglet = d.id; break;
      case 'compact': r.compact = !r.compact; break;
      case 'reduire': r.reduit = !r.reduit; break;
      case 'cacherMission': r.cacherEnMission = !r.cacherEnMission; break;
      case 'choisirJob': r.job = d.job; break;
      case 'accueilVu': e.accueilVu = true; break;
      case 'echelle': r.echelle = Math.round(Math.max(0.7, Math.min(2.5, r.echelle + Number(d.n))) * 10) / 10; break;
      case 'opacite': r.opacite = Math.round(Math.max(0.3, Math.min(1, r.opacite + Number(d.n))) * 10) / 10; break;
      case 'exporter': rendre(); document.getElementById('echange').value = JSON.stringify(racine); document.getElementById('echange').select(); return;
      case 'importer': {
        try {
          if (!adopter(JSON.parse(document.getElementById('echange').value))) throw new Error('format');
          noter('j.importOk');
        } catch (err) { noter('j.importKo'); }
        break;
      }
      case 'raz':
        if (!confirmerRaz) { confirmerRaz = true; break; }
        racine.persos[racine.persoActif] = nouvelEtat();
        confirmerRaz = false;
        break;
      case 'simuler': surLigne({ line: d.ligne.split('|') }); return;
      default: return;
    }
    sauver();
    rendre();
  });

  app.addEventListener('change', (ev) => {
    const cible = ev.target, e = etat();
    const v = Math.max(0, parseInt(cible.value, 10) || 0);
    if (cible.dataset.change === 'job') racine.reglages.job = cible.value;
    else if (cible.dataset.change === 'langue') racine.reglages.langue = cible.value;
    else if (cible.dataset.change === 'relique') racine.reglages.relique = cible.value;
    else if (cible.dataset.change === 'objet') e.objets[cible.dataset.cle] = v;
    else if (cible.dataset.change === 'jauge') e.jauges[cible.dataset.cle] = Math.min(10000, v);
    else return;
    sauver();
    rendre();
  });

  // ---------- Démarrage ----------
  if (MODE_DEMO) chargerDemo(); else chargerLocal();
  if (TX[LANGUE_URL]) racine.reglages.langue = LANGUE_URL;  // ?lang=en : présélectionne la langue (liens de démo)
  rendre();
  Overlay.ecouter('LogLine', surLigne);
  Overlay.ecouter('ChangePrimaryPlayer', (ev) => {
    if (apercu) return;
    const avant = racine.persoActif;
    changerPerso(ev.charName);
    if (ev.charID) lireJobEnJeu(ev.charID);
    if (racine.persoActif !== avant) sauver();  // rien à enregistrer si c'est le même personnage
    rendre();
  });
  Overlay.demarrer();

  // Fenêtre d'aperçu d'OverlayPlugin (ajout d'un overlay depuis un preset) : elle n'est signalée qu'après le
  // chargement (OverlayPluginApi.preview), puis par l'évènement onExampleShowcase envoyé chaque seconde.
  function passerEnApercu() {
    if (enDemo()) return;
    apercu = true;
    chargerDemo();
    rendre();
  }
  document.addEventListener('onExampleShowcase', passerEnApercu);

  setTimeout(() => {
    connecte = Overlay.estDansAct();
    document.documentElement.classList.toggle('navigateur', !connecte);
    if (Overlay.estApercu()) passerEnApercu();
    if (connecte) { if (!enDemo()) chargerDepuisAct(); lireJobEnJeu(); lireLangueAct(); }
    rendre();
  }, 1000);
})();
