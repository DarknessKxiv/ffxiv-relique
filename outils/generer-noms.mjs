// Régénère js/noms-jeu.js : noms officiels du jeu en français, anglais et allemand (XIVAPI v2).
// À relancer si un patch renomme des objets :  node outils/generer-noms.mjs
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as ANCIENNES from './noms-reliques-anciennes.mjs';

const API = 'https://v2.xivapi.com/api';
const LANGUES = ['fr', 'en', 'de'];
const SORTIE = fileURLToPath(new URL('../js/noms-jeu.js', import.meta.url));

// Objets suivis par la détection (id dans la feuille Item du jeu).
const OBJETS = {
  demiSaphir: 47744, demiTurquoise: 47745, demiEmeraude: 47746, demiCorail: 47747, demiAmethyste: 47748, demiAmbre: 47749,
  lunulite: 47750, ombralite: 46850, alunite: 50058, ecliptite: 50977,
  colle: 46854, fer: 46852, matiereA: 46855, matiereB: 46856, matiereG: 46857,
  argile: 50054, alliageAspecte: 50056, composantAspecte: 50055, resineAspectee: 50057,
  pate: 50059,
  pierre: 50970, alliageAtypique: 50972, ficelle: 50971, huile: 50973,
  dissipAlpha: 50974, dissipBeta: 50975, dissipGamma: 50976,
  memoquartz: 48, gemme: 26807, couteau: 52582,
  // Endwalker (Manderville)
  meteorite: 38420, chondrite: 38940, achondrite: 40322, cristallite: 41032, poetique: 28,
};
const OBJETS_CLES = { magiSpherier: 2003766, lunette: 2003765, cristalSavoir: 2003836 };
// Orbes du Magi sphérier (feuille Addon), cités par « L'orbe magique vert a reçu 545 unités d'énergie éthérée. »
const ORBES = { vert: 16551, rouge: 16552, bleu: 16553, jaune: 16554 };
const QUETES = {
  sentierAurore: 70495, derniereAventure: 70845, villeFantome: 70846, familier: 70847,
  forgeron: 70855, arsenal: 70856,
  tablette: 70916, orbes: 70917, penombre: 70918,
  recherche: 70990, pate: 70991, puissance: 70992,
  mirage: 71038, dissipateurs: 71039, purete: 71040,
  mementos: 71041, finale: 71042,
  // Endwalker (Manderville) : quête principale, série d'Hildibrand, puis par stade la quête d'histoire, la première arme et l'échange répétable
  ewMsq: 70000, ewHildiDebut: 66740, ewHildiFin: 70178,
  ewFaire: 70188, ewEncore: 70189,
  ewGeneration: 70255, ewInstinct: 70261, ewEblouissante: 70262,
  ewVisiteur: 70291, ewForgerons: 70307, ewMajestueuse: 70308,
  ewCadeau: 70336, ewDanse: 70342, ewManderveilleuse: 70343,
};
const MISSIONS = {
  // Donjons niv. 91-99
  ihuykatumu: 826, worqorZormor: 824, cenote: 829, avantGarde: 831, origenese: 825,
  // Donjons niv. 100
  alexandrie: 827, pampas: 834, parcErrants: 981, yuweyawata: 1008, gardienne: 1027, meso: 1028, sillage: 1064, clyteum: 1011,
  // Défis
  worqorLarDor: 832, pinacle: 995, interphos: 984, sanctuaireSerment: 1030, necropole: 1061, convoi: 1076, anticreation: 1115,
  // Raids en alliance
  jeuno: 1015, sandoria: 1058, windurst: 1117,
  // Arcadion
  m1: 985, m2: 987, m3: 989, m4: 991, m5: 1019, m6: 1021, m7: 1023, m8: 1025, m9: 1068, m10: 1070, m11: 1072, m12: 1074,
  // Opérations de terrain de Lunule (l'overlay ne s'y cache pas) et donjon sans fond
  lunuleSud: 1018, lunuleNord: 1093, pelerins: 1032,
};
const MONSTRES = {
  ratel: 13089, megapita: 13080, grosseMachoire: 13096, graveur: 13099,
  uolon: 12931, ocelot: 12941, poliste: 12949, apollyon: 12943,
  vawtsaral: 12956, tohsoq: 12960, sylveplume: 12964, sangfeuille: 12966,
  crabe: 12972, ceratoraptor: 12989, rroneek: 12991, pampa: 12973,
  cauahealoa: 13116, katobleps: 13113, gomphotherium: 13104, dosLaineux: 13110,
  aerochat: 13121, scorpion: 13129, if: 13136, ame: 13124,
};
const PNJ = {
  messager: 1053805, ketenramm: 1039720, archive: 1053794, jeffroy: 1053797, lydirceil: 1053727, gerolt: 1053907,
  ermina: 1053728, dodokkuli: 1053729, archeologue: 1058068, brigid: 1056453, metallurgiste: 1054004,
  goplu: 1048382, rral: 1048933,
  jubrunnah: 1043892, artisanManderville: 1043891, domestiqueManderville: 1043950, alchimisteManderville: 1045568, geroltEw: 1043890,
};
const LIEUX = {
  tuliyollal: 4504, villeFantome: 4757, urqopacha: 4505, kozamauka: 4506, yakTel: 4507, shaaloani: 4508,
  hoirie: 4509, memoireVivante: 4510, lunule: 4931, lunuleSud: 4932, lunuleNord: 5577,
  yokTural: 4500, xakTural: 4501, mondeInephemere: 4502,
  radzAtHan: 3707,
};
const EMOTES = { feliciter: 29 };
const CLASSES = {
  PLD: 19, WAR: 21, DRK: 32, GNB: 37, WHM: 24, SCH: 28, AST: 33, SGE: 40, MNK: 20, DRG: 22, NIN: 30, SAM: 34,
  RPR: 39, VPR: 41, BRD: 23, MCH: 31, DNC: 38, BLM: 25, SMN: 27, RDM: 35, PCT: 42,
  CRP: 8, BSM: 9, ARM: 10, GSM: 11, LTW: 12, WVR: 13, ALC: 14, CUL: 15,
};
// Armes de chaque relique, stade par stade : recherche par nom, puis tri par niveau d'objet (les répliques sont niv. 1).
const SANS_REPLIQUE = '-Name~"Replica"';
const RELIQUES = {
  dt: ['Penumbrae', 'Umbrae', 'Obscurum', 'Eclipticum', 'Occultum'].map((s, i) => ({
    requete: `+Name~"Phantom" +Name~"${s}" ${SANS_REPLIQUE}`, ilvl: [745, 760, 775, 790, 795][i] })),
  ew: [
    { requete: `+Name~"Manderville" -Name~"Amazing" -Name~"Majestic" ${SANS_REPLIQUE}`, ilvl: 615 },
    { requete: `+Name~"Amazing Manderville" ${SANS_REPLIQUE}`, ilvl: 630 },
    { requete: `+Name~"Majestic Manderville" ${SANS_REPLIQUE}`, ilvl: 645 },
    { requete: `+Name~"Mandervillous" ${SANS_REPLIQUE}`, ilvl: 665 },
  ],
};
// Une arme et sa réplique d'apparence : la différence de nom donne le mot « réplique » de chaque langue.
const ARME_TEMOIN = 47871, REPLIQUE_TEMOIN = 49101;

// ALÉA (feuille Fate) et affrontements cruciaux (feuille DynamicEvent) de Lunule qui donnent un objet précis (wiki).
const SOURCES_LUNULE = {
  demiSaphir: ['A Prying Eye', 'Rough Waters', 'The Golden Guardian', 'Crawling Death', 'Scourge of the Mind', 'The Unbridled'],
  demiTurquoise: ['A Delicate Balance', 'Sworn to Soil', 'Pleading Pots', 'Calamity Bound'],
  demiEmeraude: ['An Unending Duty', 'Flame of Dusk', 'Trial by Claw', 'From Times Bygone'],
  demiCorail: ['Brain Drain', 'The Winged Terror', 'With Extreme Prejudice', 'Shark Attack', 'Cursed Concern'],
  demiAmethyste: ['Serving Darkness', 'Company of Stone', 'Eternal Watch', 'On the Hunt'],
  demiAmbre: ['Fatal Allure', 'King of the Crescent', 'Persistent Pots', 'Noise Complaint', 'The Black Regiment'],
  dissipAlpha: ['A Rotten Affair', 'Gale-force Encounter', 'Raging Thrall', 'Waved Away', 'Ahead of the Competition',
    'Appalling Behavior', 'Forbidden Folios', 'Many Mouths to Feed', 'Web of Terror'],
  dissipBeta: ['Allure of the Occult', 'Eye to Eye', 'In a Pot of Bother', 'Territorial Dispute', 'Thunderregnum',
    'Cursed Resurgence', 'Dark Artistry', 'Imbalanced Diet', 'Tiny Terror', 'Quarried Away'],
  dissipGamma: ['Daylight Pottery', 'Inconstant Gardener', 'Scale Model', 'Shoreline Showdown', 'A Beast Unleashed',
    'Accept No Imitators', 'Doubled Trouble', 'Familiar Tactics', 'Lost on the Wind'],
};
const ROULETTES = {
  gainNiveaux: 'Duty Roulette: Leveling', hautNiveau: 'Duty Roulette: High-level Dungeons', expert: 'Duty Roulette: Expert',
  niveauMax: 'Duty Roulette: Level Cap Dungeons', defis: 'Duty Roulette: Trials', alliance: 'Duty Roulette: Alliance Raids',
  raidsNormaux: 'Duty Roulette: Normal Raids',
};

// Retire les césures invisibles et les glyphes privés du jeu (icônes de quête, etc.).
// Les marques allemandes [a] (terminaison d'adjectif) et [p] restent dans les formes sg/pl : la détection s'en sert.
const propre = (s) => String(s ?? '').replace(/[­-]/g, '').trim();
// Pour l'affichage d'un nom sans article : la marque [p] disparaît et [a] prend la terminaison allemande
// du nominatif selon le genre du nom (0 masculin -er, 1 féminin -e, 2 neutre -es).
const affichage = (s, genre = 0) => propre(s).replace(/\[p\]/g, '').replace(/\[a\]/g, ['er', 'e', 'es'][genre] ?? 'e');
const champs = (noms) => LANGUES.flatMap((l) => noms.map((n) => `${n}@lang(${l})`)).join(',');
const enLangues = (fn) => Object.fromEntries(LANGUES.map((l) => [l, fn(l)]));

async function json(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} : ${url}`);
  return res.json();
}

// Lit des lignes par id et renvoie { cle: champs } pour la table donnée.
async function parCle(feuille, table, noms) {
  const ids = Object.values(table);
  const parId = {};
  for (let i = 0; i < ids.length; i += 100) {
    const lot = ids.slice(i, i + 100);
    const { rows } = await json(`${API}/sheet/${feuille}?rows=${lot.join(',')}&fields=${champs(noms)}&limit=${lot.length}`);
    for (const r of rows) parId[r.row_id] = r.fields;
  }
  return Object.fromEntries(Object.entries(table).map(([cle, id]) => [cle, parId[id] ?? {}]));
}

async function rechercheNoms(feuille, noms) {
  const res = [];
  for (let i = 0; i < noms.length; i += 20) {
    const q = noms.slice(i, i + 20).map((n) => `Name="${n}"`).join(' ');
    const { results } = await json(`${API}/search?sheets=${feuille}&query=${encodeURIComponent(q)}&fields=Name,${champs(['Name'])}&limit=200`);
    res.push(...results);
  }
  return res;
}

// Recherche par nom anglais (anciennes reliques) : la ligne dont le nom, sans glyphes, est exactement celui-là
// (la plus ancienne s'il y en a plusieurs, comme les versions par job de « A Relic Reborn »). Renvoie { cle: { id, f } }.
async function parNomAnglais(feuille, champ, table, champsVoulus, extra = '') {
  const noms = [...new Set(Object.values(table))];
  const trouve = {};
  for (let i = 0; i < noms.length; i += 10) {
    const lot = noms.slice(i, i + 10);
    const q = lot.map((n) => `${champ}~"${n.replace(/"/g, '\\"')}"`).join(' ');
    const { results } = await json(`${API}/search?sheets=${feuille}&query=${encodeURIComponent(q)}`
      + `&fields=${champ},${champs(champsVoulus)}${extra}&limit=300`);
    // Le jeu met parfois deux espaces (« Heaven-on-High  (Floors 1-10) ») ou un tiret long (« Toto–Rak »).
    const egal = (s) => propre(s).toLowerCase().replace(/\s+/g, ' ').replace(/[–—]/g, '-');
    for (const n of lot) {
      const r = results.filter((x) => egal(x.fields[champ]) === egal(n)).sort((a, b) => a.row_id - b.row_id)[0];
      if (r) trouve[n] = { id: r.row_id, f: r.fields };
    }
  }
  const manquants = noms.filter((n) => !trouve[n]);
  if (manquants.length) console.warn(`${feuille} introuvable(s) :`, manquants.join(' | '));
  return Object.fromEntries(Object.entries(table).filter(([, n]) => trouve[n]).map(([cle, n]) => [cle, trouve[n]]));
}

const formes = (f, l) => ({ nom: propre(f[`Name@lang(${l})`]), sg: propre(f[`Singular@lang(${l})`]), pl: propre(f[`Plural@lang(${l})`]) });

const objets = await parCle('Item', OBJETS, ['Name', 'Singular', 'Plural']);
const objetsCles = await parCle('EventItem', OBJETS_CLES, ['Name', 'Singular', 'Plural']);
const orbes = await parCle('Addon', ORBES, ['Text']);
const quetes = await parCle('Quest', QUETES, ['Name']);
const missions = await parCle('ContentFinderCondition', MISSIONS, ['Name']);
const monstres = await parCle('BNpcName', MONSTRES, ['Singular', 'Pronoun']);
const pnj = await parCle('ENpcResident', PNJ, ['Singular', 'Pronoun']);
const lieux = await parCle('PlaceName', LIEUX, ['Name']);
const classes = await parCle('ClassJob', CLASSES, ['Name', 'Abbreviation']);
const emotes = await parCle('Emote', EMOTES, ['Name']);
const temoins = await parCle('Item', { arme: ARME_TEMOIN, replique: REPLIQUE_TEMOIN }, ['Name']);

// Anciennes reliques : recherche par nom anglais, ajoutée aux mêmes tables.
const idsQuetes = { ...QUETES };
for (const [cle, { id, f }] of Object.entries(await parNomAnglais('Quest', 'Name', ANCIENNES.QUETES, ['Name']))) { quetes[cle] = f; idsQuetes[cle] = id; }
for (const [cle, { f }] of Object.entries(await parNomAnglais('Item', 'Name', ANCIENNES.OBJETS, ['Name', 'Singular', 'Plural']))) objets[cle] = f;
for (const [cle, { f }] of Object.entries(await parNomAnglais('ContentFinderCondition', 'Name', ANCIENNES.MISSIONS, ['Name']))) missions[cle] = f;
for (const [cle, { f }] of Object.entries(await parNomAnglais('PlaceName', 'Name', ANCIENNES.LIEUX, ['Name']))) lieux[cle] = f;
for (const [cle, { f }] of Object.entries(await parNomAnglais('ENpcResident', 'Singular', ANCIENNES.PNJ, ['Singular', 'Pronoun']))) pnj[cle] = f;
const fates = Object.fromEntries(Object.entries(await parNomAnglais('Fate', 'Name', ANCIENNES.FATES, ['Name'])).map(([c, { f }]) => [c, f]));

// PNJ de départ de chaque quête et sa position (feuilles Quest → IssuerStart, IssuerLocation → Level → Map).
const carte = (pos, taille, decalage) => { const c = taille / 100; return Math.round((41 / c * ((pos + decalage) * c + 1024) / 2048 + 1) * 10) / 10; };
const departsBruts = {};
{
  const entrees = Object.entries(idsQuetes);
  const voulus = ['IssuerStart.Singular', 'IssuerStart.Pronoun', 'IssuerLocation.Map.PlaceName.Name'];
  for (let i = 0; i < entrees.length; i += 50) {
    const lot = entrees.slice(i, i + 50);
    const { rows } = await json(`${API}/sheet/Quest?rows=${lot.map(([, id]) => id).join(',')}&fields=${champs(voulus)},`
      + 'IssuerLocation.X,IssuerLocation.Z,IssuerLocation.Map.SizeFactor,IssuerLocation.Map.OffsetX,IssuerLocation.Map.OffsetY&limit=50');
    for (const r of rows) {
      const cle = lot.find(([, id]) => id === r.row_id)?.[0];
      const lv = r.fields.IssuerLocation?.fields, m = lv?.Map?.fields;
      if (cle && lv && m) departsBruts[cle] = { pnj: r.fields.IssuerStart?.fields, lieu: m.PlaceName?.fields, x: carte(lv.X, m.SizeFactor, m.OffsetX), y: carte(lv.Z, m.SizeFactor, m.OffsetY) };
    }
  }
}

// Armes : pour chaque relique et chaque stade, les armes du bon niveau d'objet, rangées par job.
const armesBrutes = [];
for (const [relique, stades] of Object.entries(RELIQUES)) {
  for (const [i, { requete, ilvl }] of stades.entries()) {
    const { results } = await json(`${API}/search?sheets=Item&query=${encodeURIComponent(requete)}`
      + `&fields=Name,${champs(['Name', 'Singular', 'Plural'])},ClassJobCategory.Name,LevelItem.value&limit=150`);
    for (const r of results) {
      const job = r.fields.ClassJobCategory?.fields?.Name;
      if (CLASSES[job] && r.fields.LevelItem?.value === ilvl) armesBrutes.push({ relique, job, stade: i, f: r.fields });
    }
  }
}
// Anciennes reliques : noms anglais des armes, stade par stade (le job vient du wiki, le niveau d'objet est vérifié).
const NB_STADES = Object.fromEntries([...Object.entries(RELIQUES), ...Object.entries(ANCIENNES.ARMES)].map(([r, s]) => [r, s.length]));
for (const [relique, stades] of Object.entries(ANCIENNES.ARMES)) {
  const liste = stades.flatMap(([ilvl, texte], i) => texte.split(';').map((x) => { const [job, nom] = x.split(':'); return { job, nom, ilvl, stade: i }; }));
  const trouves = await parNomAnglais('Item', 'Name', Object.fromEntries(liste.map((a, k) => [k, a.nom])), ['Name', 'Singular', 'Plural'], ',LevelItem.value');
  for (const [k, a] of liste.entries()) {
    const t = trouves[k];
    if (!t) continue;
    if (t.f.LevelItem?.value !== a.ilvl) console.warn(`niveau inattendu : ${a.nom} (${t.f.LevelItem?.value} au lieu de ${a.ilvl})`);
    armesBrutes.push({ relique, job: a.job, stade: a.stade, f: t.f });
  }
}

// Sources de Lunule : nom de l'ALÉA (fate) ou de l'affrontement crucial (ce) dans chaque langue.
const tousNoms = Object.values(SOURCES_LUNULE).flat();
const trouves = [
  ...(await rechercheNoms('Fate', tousNoms)).map((r) => ({ ...r, genre: 'fate' })),
  ...(await rechercheNoms('DynamicEvent', tousNoms)).map((r) => ({ ...r, genre: 'ce' })),
];

const { rows: lignesRoulettes } = await json(`${API}/sheet/ContentRoulette?rows=${Array.from({ length: 40 }, (_, i) => i + 1).join(',')}&fields=Name,${champs(['Name'])}`);

const donnees = enLangues((l) => {
  const nom = (f, champ = 'Name') => propre(f[`${champ}@lang(${l})`]);
  // armes[relique][job][stade] = formes des armes (le paladin en a deux : épée et bouclier).
  const armes = {};
  for (const a of armesBrutes) {
    const parJob = (armes[a.relique] ||= {});
    (parJob[a.job] ||= Array.from({ length: NB_STADES[a.relique] }, () => []))[a.stade].push(formes(a.f, l));
  }
  // Le mot qui distingue une réplique d'apparence (« réplique », « replica », « replik »), en minuscules.
  const replique = nom(temoins.replique).toLowerCase().replace(nom(temoins.arme).toLowerCase(), '').replace(/[^\p{L}\s-]/gu, '').trim().split(/\s/)[0];
  return {
    objets: Object.fromEntries(Object.entries(objets).map(([c, f]) => [c, formes(f, l)])),
    objetsCles: Object.fromEntries(Object.entries(objetsCles).map(([c, f]) => [c, formes(f, l)])),
    orbes: Object.fromEntries(Object.entries(orbes).map(([c, f]) => [c, nom(f, 'Text')])),
    quetes: Object.fromEntries(Object.entries(quetes).map(([c, f]) => [c, nom(f)])),
    missions: Object.fromEntries(Object.entries(missions).map(([c, f]) => [c, nom(f).replace(/\s*\([^)]*\d[^)]*\)$/, '').replace(/\s+/g, ' ')])),
    monstres: Object.fromEntries(Object.entries(monstres).map(([c, f]) => [c, affichage(f[`Singular@lang(${l})`], f[`Pronoun@lang(${l})`])])),
    pnj: Object.fromEntries(Object.entries(pnj).map(([c, f]) => [c, affichage(f[`Singular@lang(${l})`], f[`Pronoun@lang(${l})`])])),
    lieux: Object.fromEntries(Object.entries(lieux).map(([c, f]) => [c, nom(f)])),
    classes: Object.fromEntries(Object.entries(classes).map(([c, f]) => [c, { nom: nom(f), abr: nom(f, 'Abbreviation') }])),
    emotes: Object.fromEntries(Object.entries(emotes).map(([c, f]) => [c, nom(f)])),
    fates: Object.fromEntries(Object.entries(fates).map(([c, f]) => [c, nom(f)])),
    departs: Object.fromEntries(Object.entries(departsBruts).map(([c, d]) => [c, {
      pnj: affichage(d.pnj?.[`Singular@lang(${l})`], d.pnj?.[`Pronoun@lang(${l})`]), lieu: propre(d.lieu?.[`Name@lang(${l})`]), x: d.x, y: d.y,
    }])),
    armes,
    replique,
    sourcesLunule: Object.fromEntries(Object.entries(SOURCES_LUNULE).map(([cle, noms]) => [cle, noms.map((en) => {
      const t = trouves.find((r) => r.fields.Name.toLowerCase() === en.toLowerCase());
      return t ? { nom: nom(t.fields), genre: t.genre } : { nom: en, genre: 'fate' };
    })])),
    roulettes: Object.fromEntries(Object.entries(ROULETTES).map(([cle, en]) => {
      const r = lignesRoulettes.find((x) => x.fields.Name === en);
      return [cle, r ? nom(r.fields) : en];
    })),
  };
});

// Objets dont le nom contient, en mot entier, celui d'une arme relique ou d'un objet suivi sans en être un
// (« Forgotten Fragment of Tenacity », « Unfinished Bravura », « Mythrit-Dreizack »…) : la détection les retire
// du message avant de chercher armes et objets, sinon ils passeraient pour eux.
const NON_SUIVIS = ['memoquartz', 'poetique', 'gemme', 'couteau'];
const normDetection = (s) => propre(s).normalize('NFC').replace(/[’`]/g, "'").replace(/\s+/g, ' ').toLowerCase();
const motifMot = (s) => new RegExp(`(?<!\\p{L})${normDetection(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?!\\p{L})`, 'u');
for (const l of LANGUES) {
  const d = donnees[l];
  const cibles = [...new Set([
    ...Object.values(d.armes).flatMap((jobs) => Object.values(jobs).flat(2).map((f) => f.nom)),
    ...Object.entries(d.objets).filter(([c]) => !NON_SUIVIS.includes(c)).map(([, f]) => f.nom),
  ].filter(Boolean))];
  const connus = new Set(cibles.map(normDetection));
  const homonymes = new Map();
  const examiner = (results, lot) => {
    for (const r of results) {
      const n = normDetection(r.fields.Name);
      if (!n || connus.has(n) || n.includes(d.replique) || homonymes.has(n) || !lot.some((c) => motifMot(c).test(n))) continue;
      homonymes.set(n, { nom: propre(r.fields.Name), sg: propre(r.fields.Singular), pl: propre(r.fields.Plural) });
    }
  };
  const chercher = async (lot) => (await json(`${API}/search?sheets=Item&language=${l}&query=${encodeURIComponent(lot.map((n) => `Name~"${n.replace(/"/g, '\\"')}"`).join(' '))}&fields=Name,Singular,Plural&limit=500`)).results;
  for (let i = 0; i < cibles.length; i += 10) {
    const lot = cibles.slice(i, i + 10);
    const results = await chercher(lot);
    // Lot trop fourni pour une seule page : on reprend nom par nom.
    if (results.length >= 500) for (const c of lot) examiner(await chercher([c]), [c]);
    else examiner(results, lot);
  }
  d.homonymes = [...homonymes.values()];
  console.log(`${l} : ${d.homonymes.length} homonyme(s)`);
}

writeFileSync(SORTIE, '// Fichier généré par outils/generer-noms.mjs : noms officiels du jeu (FR, EN, DE).\n'
  + `window.NOMS_JEU = ${JSON.stringify(donnees, null, 1)};\n`, 'utf8');
console.log('écrit :', SORTIE);
