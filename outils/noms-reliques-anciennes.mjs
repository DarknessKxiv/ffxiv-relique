// Reliques de Shadowbringers (shb), Stormblood (sb), Heavensward (hw) et A Realm Reborn (arr) :
// noms anglais officiels (repris du wiki ffxiv.consolegameswiki.com) que generer-noms.mjs retrouve dans les
// données du jeu pour en tirer les noms français et allemands. Clé interne → nom anglais.

export const QUETES = {
  // Shadowbringers
  shbMsq: 'Shadowbringers', shbCite: 'The City of Lost Angels',
  shbReine: 'Hail to the Queen', shbPasse: 'Path to the Past', shbIncident: 'The Bozja Incident', shbForge: 'Fire in the Forge',
  shbFutile: 'Resistance Is (Not) Futile',
  shbVoeux: 'Vows of Virtue, Deeds of Cruelty', shbAigles: 'Where Eagles Nest', shbSobre: 'A Sober Proposal',
  shbMemoire: 'For Want of a Memory', shbVolonte: 'The Will to Resist',
  shbSigne: "A Sign of What's to Come", shbDigne: 'Fit for a Queen', shbImage: "In the Queen's Image", shbArmes: 'Change of Arms',
  shbSouvient: 'The Resistance Remembers', shbVoie: 'A New Path of Resistance',
  shbTerrain: 'A New Playing Field', shbReves: 'What Dreams Are Made Of', shbPieces: 'Spare Parts', shbHistoire: 'Tell Me a Story',
  shbSouvenir: 'A Fond Memory', shbMarche: 'A Done Deal', shbIrresistible: 'Irresistible',
  // Stormblood
  sbMsq: 'Stormblood', sbEureka: 'And We Shall Call It Eureka',
  // Heavensward
  hwMsq: 'Heavensward', hwProposition: 'An Unexpected Proposal', hwAme: 'Soul without Life', hwEndurci: 'Toughening Up',
  hwPropre: 'Coming into Its Own', hwVoix: 'Finding Your Voice', hwReve: 'A Dream Fulfilled', hwAvenir: 'Future Proof',
  hwEtoffe: 'Cut from a Different Cloth', hwInspiration: 'Seeking Inspiration', hwRenaissance: 'Born Again Anima',
  hwAssemblage: 'Some Assembly Required', hwCorps: 'Body and Soul', hwSagesse: 'Words of Wisdom', hwAmis: 'Best Friends Forever',
  // A Realm Reborn
  arrForgeron: 'The Weaponsmith of Legend', arrArmes: 'Up in Arms',
  // « A Relic Reborn » existe en une version par arme.
  arrReliquePLD: 'A Relic Reborn (Curtana)', arrReliqueWAR: 'A Relic Reborn (Bravura)', arrReliqueDRG: 'A Relic Reborn (Gae Bolg)',
  arrReliqueMNK: 'A Relic Reborn (Sphairai)', arrReliqueNIN: 'A Relic Reborn (Yoshimitsu)', arrReliqueBRD: 'A Relic Reborn (Artemis Bow)',
  arrReliqueBLM: 'A Relic Reborn (Stardust Rod)', arrReliqueSMN: 'A Relic Reborn (The Veil of Wiyu)', arrReliqueWHM: 'A Relic Reborn (Thyrus)',
  arrReliqueSCH: 'A Relic Reborn (Omnilex)', arrBraves: 'Trials of the Braves',
  arrRayonnement: 'Celestial Radiance', arrEtoile: 'Star Light, Star Bright', arrTresors: 'Treasures and Tribulations',
  arrDechets: "One Man's Trash", arrMorbide: 'Morbid Motivation', arrLustre: 'Mmmmmm, Soulglazed Relics',
  arrZodiaque: 'Wherefore Art Thou, Zodiac', arrMalice: 'Method in His Malice', arrAmour: 'Labor of Love',
  arrPonze: 'A Ponze of Flesh', arrMere: 'A Treasured Mother', arrMateria: 'His Dark Materia', arrReveil: 'Rise and Shine',
};

export const OBJETS = {
  // Shadowbringers
  ecailles: 'Thavnairian Scalepowder', memTorture: 'Tortured Memory of the Dying', memChagrin: 'Sorrowful Memory of the Dying',
  memAngoisse: 'Harrowing Memory of the Dying', memAmer: 'Bitter Memory of the Dying', memOdieux: 'Loathsome Memory of the Dying',
  memHantise: 'Haunting Memory of the Dying', memVexation: 'Vexatious Memory of the Dying', artefact: 'Timeworn Artifact',
  essieu: 'Compact Axle', ressort: 'Compact Spring', livreRoyaume: 'A Day in the Life: Battles for the Realm',
  livreFaille: 'A Day in the Life: Beyond the Rift', memSombre: 'Bleak Memory of the Dying', memCriard: 'Lurid Memory of the Dying',
  emotion: 'Raw Emotion',
  // Stormblood
  proteen: 'Protean Crystal', cristalAnemos: 'Anemos Crystal', plume: "Pazuzu's Feather", proteenGivre: 'Frosted Protean Crystal',
  cristalPagos: 'Pagos Crystal', glaceLouhi: "Louhi's Ice", cristalPyros: 'Pyros Crystal', flamme: "Penthesilea's Flame",
  cristalHydatos: 'Hydatos Crystal', ecaille: 'Crystalline Scale', fragmentEureka: 'Eureka Fragment',
  // Heavensward
  luxVent: 'Luminous Wind Crystal', luxFeu: 'Luminous Fire Crystal', luxFoudre: 'Luminous Lightning Crystal',
  luxGlace: 'Luminous Ice Crystal', luxTerre: 'Luminous Earth Crystal', luxEau: 'Luminous Water Crystal',
  os: 'Unidentifiable Bone', coquille: 'Unidentifiable Shell', minerai: 'Unidentifiable Ore', graines: 'Unidentifiable Seeds',
  francisque: 'Adamantite Francesca', miroir: 'Titanium Alloy Mirror', fleche: 'Dispelling Arrow', galette: 'Kingcake',
  huileEther: 'Aether Oil', umbrite: 'Umbrite', sable: 'Crystal Sand', grappe: 'Singing Cluster', pneumite: 'Pneumite',
  encreArchaique: 'Archaic Enchanted Ink', avoirArtisan: "Blue Crafters' Scrip Token", avoirRecolteur: "Blue Gatherers' Scrip Token",
  // A Realm Reborn
  huileTrempe: 'Radz-at-Han Quenching Oil', brume: 'Thavnairian Mist', encreSup: 'Superior Enchanted Ink', alexandrite: 'Alexandrite',
  carte: 'Mysterious Map', noyau: 'Bombard Core', eauSacree: 'Sacred Spring Water',
  atmaLion: 'Atma of the Lion', atmaVerseau: 'Atma of the Water-bearer', atmaBelier: 'Atma of the Ram', atmaCrabe: 'Atma of the Crab',
  atmaPoissons: 'Atma of the Fish', atmaTaureau: 'Atma of the Bull', atmaBalance: 'Atma of the Scales', atmaGemeaux: 'Atma of the Twins',
  atmaScorpion: 'Atma of the Scorpion', atmaSagittaire: 'Atma of the Archer', atmaCapricorne: 'Atma of the Goat',
  atmaVierge: 'Atma of the Maiden',
};

export const MISSIONS = {
  // Shadowbringers
  bozja: 'The Bozjan Southern Front', zadnor: 'Zadnor', delubrum: 'Delubrum Reginae',
  labyrinthe: 'The Labyrinth of the Ancients', syrcus: 'Syrcus Tower', tenebres: 'The World of Darkness',
  arche: 'The Void Ark', mhach: 'The Weeping City of Mhach', dunScaith: 'Dun Scaith', rabanastre: 'The Royal City of Rabanastre',
  ridorana: 'The Ridorana Lighthouse', orbonne: 'The Orbonne Monastery', palais: 'The Palace of the Dead (Floors 1-10)',
  empyree: 'Heaven-on-High  (Floors 1-10)', antitour: 'The Antitower', hellsLid: "Hells' Lid",
  a1: 'Alexander - The Fist of the Father', a2: 'Alexander - The Cuff of the Father', a3: 'Alexander - The Arm of the Father',
  a4: 'Alexander - The Burden of the Father', o1: 'Deltascape V1.0', o3: 'Deltascape V3.0',
  e1: "Eden's Gate: Resurrection", e3: "Eden's Gate: Inundation",
  // Stormblood
  anemos: 'The Forbidden Land, Eureka Anemos', pagos: 'The Forbidden Land, Eureka Pagos', pyros: 'The Forbidden Land, Eureka Pyros',
  hydatos: 'The Forbidden Land, Eureka Hydatos',
  // Heavensward (donjons de l'étape « Toughening Up », dans l'ordre)
  snowcloak: 'Snowcloak', sastashaH: 'Sastasha (Hard)', qarnH: 'The Sunken Temple of Qarn (Hard)', keeper: 'The Keeper of the Lake',
  wandererH: "The Wanderer's Palace (Hard)", amdaporH: 'Amdapor Keep (Hard)', dusk: 'The Dusk Vigil', sohmAl: 'Sohm Al',
  aery: 'The Aery', vault: 'The Vault',
  amdaporCiteH: 'The Lost City of Amdapor (Hard)', gubalH: 'The Great Gubal Library (Hard)', sohmAlH: 'Sohm Al (Hard)',
  a9s: 'Alexander - The Eyes of the Creator (Savage)',
  emberH: 'The Bowl of Embers (Hard)', eyeH: 'The Howling Eye (Hard)', navelH: 'The Navel (Hard)', thornH: 'Thornmarch (Hard)',
  whorlH: 'The Whorleater (Hard)', strikingH: 'The Striking Tree (Hard)', akhAfahH: 'The Akh Afah Amphitheatre (Hard)',
  thokH: 'Thok ast Thok (Hard)', limitlessH: 'The Limitless Blue (Hard)', s1t7: 'Containment Bay S1T7', p1t6: 'Containment Bay P1T6',
  z1t9: 'Containment Bay Z1T9',
  // A Realm Reborn
  bahamutT4: 'The Final Coil of Bahamut - Turn 4', emberEx: 'The Bowl of Embers (Extreme)', thornEx: 'Thornmarch (Extreme)',
  aurum: 'The Aurum Vale', totoRak: 'the Thousand Maws of Toto–Rak',
};

export const LIEUX = {
  // Zones d'ALÉA de Heavensward et Stormblood
  merNuages: 'The Sea of Clouds', coerthasOuest: 'Coerthas Western Highlands', avantPays: 'The Dravanian Forelands',
  brumes: 'The Churning Mists', arrierePays: 'The Dravanian Hinterlands', azysLla: 'Azys Lla',
  marches: 'The Fringes', pics: 'The Peaks', lacs: 'The Lochs', merRubis: 'The Ruby Sea', yanxia: 'Yanxia', azim: 'The Azim Steppe',
  // Villes et lieux des PNJ
  gangos: 'Gangos', morDhona: 'Mor Dhona', idyllee: 'Idyllshire',
  eurekaAnemos: 'Eureka Anemos', eurekaPagos: 'Eureka Pagos', eurekaPyros: 'Eureka Pyros', eurekaHydatos: 'Eureka Hydatos',
  // Instances des opérations de terrain (ce ne sont pas des missions de l'outil de recherche)
  castrum: 'Castrum Lacus Litore', dalriada: 'The Dalriada',
  // Zones des atmas (A Realm Reborn)
  noscea_ext: 'Outer La Noscea', noscea_haute: 'Upper La Noscea', noscea_centre: 'Middle La Noscea', noscea_ouest: 'Western La Noscea',
  noscea_basse: 'Lower La Noscea', thanalan_est: 'Eastern Thanalan', thanalan_centre: 'Central Thanalan',
  thanalan_ouest: 'Western Thanalan', thanalan_sud: 'Southern Thanalan', sombrelinceul_nord: 'North Shroud',
  sombrelinceul_est: 'East Shroud', sombrelinceul_centre: 'Central Shroud',
};

export const PNJ = {
  auriana: 'Auriana', hismena: 'Hismena', zlatan: 'Zlatan', syndony: 'Syndony', ardashir: 'Ardashir', cristiana: 'Cristiana',
  ulan: 'Ulan', blamprest: 'Blamprest', jalzahn: 'Jalzahn', gjusana: "G'jusana", hubairtin: 'Hubairtin', remon: 'Remon',
  oiseleur: 'expedition birdwatcher', receleur: 'Calamity salvager', sabina: 'Sabina',
};

// ALÉA nommés (feuille Fate) qui donnent un objet précis.
export const FATES = {
  pazuzu: 'Wail in the Willows', louhi: 'Louhi on Ice', penthesilee: 'Lost Epic', provenance: 'Crystalline Provenance',
};

// Armes par stade : « JOB:nom anglais » séparés par « ; » (paladin : épée et bouclier). Le niveau d'objet sert au contrôle.
export const ARMES = {
  shb: [
    [485, 'PLD:Honorbound;PLD:Tenacity;WAR:Skullrender;DRK:Woeborn;GNB:Crownsblade;DRG:Dreizack;MNK:Samsara;SAM:Hoshikiri;NIN:Honeshirazu;BRD:Brilliance;MCH:Lawman;DNC:Enchufla;BLM:Soulscourge;SMN:Espiritus;RDM:Talekeeper;WHM:Ingrimm;SCH:Akademos;AST:Solstice'],
    [500, 'PLD:Augmented Honorbound;PLD:Augmented Tenacity;WAR:Augmented Skullrender;DRK:Augmented Woeborn;GNB:Augmented Crownsblade;DRG:Augmented Dreizack;MNK:Augmented Samsara;SAM:Augmented Hoshikiri;NIN:Augmented Honeshirazu;BRD:Augmented Brilliance;MCH:Augmented Lawman;DNC:Augmented Enchufla;BLM:Augmented Soulscourge;SMN:Augmented Espiritus;RDM:Augmented Talekeeper;WHM:Augmented Ingrimm;SCH:Augmented Akademos;AST:Augmented Solstice'],
    [500, 'PLD:Honorbound Recollection;PLD:Tenacity Recollection;WAR:Skullrender Recollection;DRK:Woeborn Recollection;GNB:Crownsblade Recollection;DRG:Dreizack Recollection;MNK:Samsara Recollection;SAM:Hoshikiri Recollection;NIN:Honeshirazu Recollection;BRD:Brilliance Recollection;MCH:Lawman Recollection;DNC:Enchufla Recollection;BLM:Soulscourge Recollection;SMN:Espiritus Recollection;RDM:Talekeeper Recollection;WHM:Ingrimm Recollection;SCH:Akademos Recollection;AST:Solstice Recollection'],
    [510, "PLD:Law's Order Bastard Sword;PLD:Law's Order Kite Shield;WAR:Law's Order Labrys;DRK:Law's Order Zweihander;GNB:Law's Order Manatrigger;DRG:Law's Order Spear;MNK:Law's Order Knuckles;SAM:Law's Order Samurai Blade;NIN:Law's Order Knives;BRD:Law's Order Composite Bow;MCH:Law's Order Revolver;DNC:Law's Order Chakrams;BLM:Law's Order Rod;SMN:Law's Order Index;RDM:Law's Order Rapier;WHM:Law's Order Cane;SCH:Law's Order Codex;AST:Law's Order Astrometer"],
    [515, "PLD:Augmented Law's Order Bastard Sword;PLD:Augmented Law's Order Kite Shield;WAR:Augmented Law's Order Labrys;DRK:Augmented Law's Order Zweihander;GNB:Augmented Law's Order Manatrigger;DRG:Augmented Law's Order Spear;MNK:Augmented Law's Order Knuckles;SAM:Augmented Law's Order Samurai Blade;NIN:Augmented Law's Order Knives;BRD:Augmented Law's Order Composite Bow;MCH:Augmented Law's Order Revolver;DNC:Augmented Law's Order Chakrams;BLM:Augmented Law's Order Rod;SMN:Augmented Law's Order Index;RDM:Augmented Law's Order Rapier;WHM:Augmented Law's Order Cane;SCH:Augmented Law's Order Codex;AST:Augmented Law's Order Astrometer"],
    [535, "PLD:Blade's Honor;PLD:Blade's Fortitude;WAR:Blade's Valor;DRK:Blade's Justice;GNB:Blade's Resolve;DRG:Blade's Glory;MNK:Blade's Serenity;SAM:Blade's Fealty;NIN:Blade's Subtlety;BRD:Blade's Muse;MCH:Blade's Ingenuity;DNC:Blade's Euphoria;BLM:Blade's Fury;SMN:Blade's Acumen;RDM:Blade's Temperance;WHM:Blade's Mercy;SCH:Blade's Wisdom;AST:Blade's Providence"],
  ],
  sb: [
    [290, 'PLD:Antiquated Galatyn;PLD:Antiquated Evalach;WAR:Antiquated Farsha;DRK:Antiquated Caladbolg;DRG:Antiquated Ryunohige;MNK:Antiquated Sudarshana Chakra;SAM:Antiquated Kiku-ichimonji;NIN:Antiquated Nagi;BRD:Antiquated Failnaught;MCH:Antiquated Outsider;BLM:Antiquated Vanargand;SMN:Antiquated Lemegeton;RDM:Antiquated Murgleis;WHM:Antiquated Aymur;SCH:Antiquated Organum;AST:Antiquated Pleiades'],
    [355, 'PLD:Galatyn Anemos;PLD:Evalach Anemos;WAR:Farsha Anemos;DRK:Caladbolg Anemos;DRG:Ryunohige Anemos;MNK:Sudarshana Chakra Anemos;SAM:Kiku-ichimonji Anemos;NIN:Nagi Anemos;BRD:Failnaught Anemos;MCH:Outsider Anemos;BLM:Vanargand Anemos;SMN:Lemegeton Anemos;RDM:Murgleis Anemos;WHM:Aymur Anemos;SCH:Organum Anemos;AST:Pleiades Anemos'],
    [370, 'PLD:Elemental Sword;PLD:Elemental Shield;WAR:Elemental Battleaxe;DRK:Elemental Guillotine;DRG:Elemental Lance;MNK:Elemental Knuckles;SAM:Elemental Blade;NIN:Elemental Knives;BRD:Elemental Harp Bow;MCH:Elemental Handgonne;BLM:Elemental Rod;SMN:Elemental Grimoire;RDM:Elemental Tuck;WHM:Elemental Cane;SCH:Elemental Codex;AST:Elemental Astrometer'],
    [385, 'PLD:Pyros Sword;PLD:Pyros Shield;WAR:Pyros Battleaxe;DRK:Pyros Guillotine;DRG:Pyros Lance;MNK:Pyros Knuckles;SAM:Pyros Blade;NIN:Pyros Knives;BRD:Pyros Harp Bow;MCH:Pyros Handgonne;BLM:Pyros Rod;SMN:Pyros Grimoire;RDM:Pyros Tuck;WHM:Pyros Cane;SCH:Pyros Codex;AST:Pyros Astrometer'],
    [405, 'PLD:Antea Eureka;PLD:Bellerophon Eureka;WAR:Shamash Eureka;DRK:Xiphias Eureka;DRG:Daboya Eureka;MNK:Dumuzis Eureka;SAM:Torigashira Eureka;NIN:Kasasagi Eureka;BRD:Circinae Eureka;MCH:Mollfrith Eureka;BLM:Paikea Eureka;SMN:Tuah Eureka;RDM:Brunello Eureka;WHM:Rose Couverte Eureka;SCH:Jebat Eureka;AST:Albireo Eureka'],
    [405, 'PLD:Antea Physeos;PLD:Bellerophon Physeos;WAR:Shamash Physeos;DRK:Xiphias Physeos;DRG:Daboya Physeos;MNK:Dumuzis Physeos;SAM:Torigashira Physeos;NIN:Kasasagi Physeos;BRD:Circinae Physeos;MCH:Mollfrith Physeos;BLM:Paikea Physeos;SMN:Tuah Physeos;RDM:Brunello Physeos;WHM:Rose Couverte Physeos;SCH:Jebat Physeos;AST:Albireo Physeos'],
  ],
  hw: [
    [170, 'PLD:Animated Hauteclaire;PLD:Animated Prytwen;WAR:Animated Parashu;DRK:Animated Deathbringer;DRG:Animated Brionac;MNK:Animated Rising Suns;NIN:Animated Yukimitsu;BRD:Animated Berimbau;MCH:Animated Ferdinand;BLM:Animated Lunaris Rod;SMN:Animated Almandal;WHM:Animated Seraph Cane;SCH:Animated Elements;AST:Animated Atlas'],
    [200, 'PLD:Hauteclaire Awoken;PLD:Prytwen Awoken;WAR:Parashu Awoken;DRK:Deathbringer Awoken;DRG:Brionac Awoken;MNK:Rising Suns Awoken;NIN:Yukimitsu Awoken;BRD:Berimbau Awoken;MCH:Ferdinand Awoken;BLM:Lunaris Rod Awoken;SMN:Almandal Awoken;WHM:Seraph Cane Awoken;SCH:Elements Awoken;AST:Atlas Awoken'],
    [210, 'PLD:Almace;PLD:Ancile;WAR:Ukonvasara;DRK:Nothung;DRG:Rhongomiant;MNK:Verethragna;NIN:Kannagi;BRD:Gandiva;MCH:Armageddon;BLM:Hvergelmir;SMN:Draconomicon;WHM:Majestas;SCH:Tetrabiblos;AST:Deneb'],
    [230, 'PLD:Hyperconductive Almace;PLD:Hyperconductive Ancile;WAR:Hyperconductive Ukonvasara;DRK:Hyperconductive Nothung;DRG:Hyperconductive Rhongomiant;MNK:Hyperconductive Verethragna;NIN:Hyperconductive Kannagi;BRD:Hyperconductive Gandiva;MCH:Hyperconductive Armageddon;BLM:Hyperconductive Hvergelmir;SMN:Hyperconductive Draconomicon;WHM:Hyperconductive Majestas;SCH:Hyperconductive Tetrabiblos;AST:Hyperconductive Deneb'],
    [240, "PLD:Sword of the Twin Thegns;PLD:Shield of the Twin Thegns;WAR:Axe of the Blood Emperor;DRK:Guillotine of the Tyrant;DRG:Trident of the Overlord;MNK:Sultan's Fists;NIN:Spurs of the Thorn Prince;BRD:Bow of the Autarch;MCH:Flame of the Dynast;BLM:Rod of the Black Khan;SMN:Book of the Mad Queen;WHM:Cane of the White Tsar;SCH:Word of the Magnate;AST:Sphere of the Last Heir"],
    [260, "PLD:Sharpened Sword of the Twin Thegns;PLD:Sharpened Shield of the Twin Thegns;WAR:Sharpened Axe of the Blood Emperor;DRK:Sharpened Guillotine of the Tyrant;DRG:Sharpened Trident of the Overlord;MNK:Sharpened Sultan's Fists;NIN:Sharpened Spurs of the Thorn Prince;BRD:Sharpened Bow of the Autarch;MCH:Sharpened Flame of the Dynast;BLM:Sharpened Rod of the Black Khan;SMN:Sharpened Book of the Mad Queen;WHM:Sharpened Cane of the White Tsar;SCH:Sharpened Word of the Magnate;AST:Sharpened Sphere of the Last Heir"],
    [270, 'PLD:Aettir;PLD:Priwen;WAR:Minos;DRK:Cronus;DRG:Areadbhar;MNK:Nyepels;NIN:Sandungs;BRD:Terpander;MCH:Deathlocke;BLM:Kaladanda;SMN:Mimesis;WHM:Sindri;SCH:Anabasis;AST:Canopus'],
    [275, 'PLD:Aettir Lux;PLD:Priwen Lux;WAR:Minos Lux;DRK:Cronus Lux;DRG:Areadbhar Lux;MNK:Nyepels Lux;NIN:Sandungs Lux;BRD:Terpander Lux;MCH:Deathlocke Lux;BLM:Kaladanda Lux;SMN:Mimesis Lux;WHM:Sindri Lux;SCH:Anabasis Lux;AST:Canopus Lux'],
  ],
  arr: [
    [80, 'PLD:Curtana;PLD:Holy Shield;WAR:Bravura;DRG:Gae Bolg;MNK:Sphairai;NIN:Yoshimitsu;BRD:Artemis Bow;BLM:Stardust Rod;SMN:The Veil of Wiyu;WHM:Thyrus;SCH:Omnilex'],
    [90, 'PLD:Curtana Zenith;PLD:Holy Shield Zenith;WAR:Bravura Zenith;DRG:Gae Bolg Zenith;MNK:Sphairai Zenith;NIN:Yoshimitsu Zenith;BRD:Artemis Bow Zenith;BLM:Stardust Rod Zenith;SMN:The Veil of Wiyu Zenith;WHM:Thyrus Zenith;SCH:Omnilex Zenith'],
    [100, 'PLD:Curtana Atma;PLD:Holy Shield Atma;WAR:Bravura Atma;DRG:Gae Bolg Atma;MNK:Sphairai Atma;NIN:Yoshimitsu Atma;BRD:Artemis Bow Atma;BLM:Stardust Rod Atma;SMN:The Veil of Wiyu Atma;WHM:Thyrus Atma;SCH:Omnilex Atma'],
    [100, 'PLD:Curtana Animus;PLD:Holy Shield Animus;WAR:Bravura Animus;DRG:Gae Bolg Animus;MNK:Sphairai Animus;NIN:Yoshimitsu Animus;BRD:Artemis Bow Animus;BLM:Stardust Rod Animus;SMN:The Veil of Wiyu Animus;WHM:Thyrus Animus;SCH:Omnilex Animus'],
    [110, 'PLD:Curtana Novus;PLD:Holy Shield Novus;WAR:Bravura Novus;DRG:Gae Bolg Novus;MNK:Sphairai Novus;NIN:Yoshimitsu Novus;BRD:Artemis Bow Novus;BLM:Stardust Rod Novus;SMN:The Veil of Wiyu Novus;WHM:Thyrus Novus;SCH:Omnilex Novus'],
    [115, 'PLD:Curtana Nexus;PLD:Holy Shield Nexus;WAR:Bravura Nexus;DRG:Gae Bolg Nexus;MNK:Sphairai Nexus;NIN:Yoshimitsu Nexus;BRD:Artemis Bow Nexus;BLM:Stardust Rod Nexus;SMN:The Veil of Wiyu Nexus;WHM:Thyrus Nexus;SCH:Omnilex Nexus'],
    [125, "PLD:Excalibur;PLD:Aegis Shield;WAR:Ragnarok;DRG:Longinus;MNK:Kaiser Knuckles;NIN:Sasuke's Blades;BRD:Yoichi Bow;BLM:Lilith Rod;SMN:Apocalypse;WHM:Nirvana;SCH:Last Resort"],
    [135, "PLD:Excalibur Zeta;PLD:Aegis Shield Zeta;WAR:Ragnarok Zeta;DRG:Longinus Zeta;MNK:Kaiser Knuckles Zeta;NIN:Sasuke's Blades Zeta;BRD:Yoichi Bow Zeta;BLM:Lilith Rod Zeta;SMN:Apocalypse Zeta;WHM:Nirvana Zeta;SCH:Last Resort Zeta"],
  ],
};
