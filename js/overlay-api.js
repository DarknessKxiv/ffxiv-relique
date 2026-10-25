// Liaison minimale avec OverlayPlugin (même fonctionnement que common.js / cactbot).
// Dans ACT, OverlayPlugin injecte window.OverlayPluginApi ; dans un navigateur normal, rien ne se passe.
(function () {
  const abonnes = {};
  let attente = [];  // appels mis en file tant que l'API n'est pas prête (null ensuite)

  function envoyer(msg, cb) {
    if (attente) attente.push([msg, cb]);
    else window.OverlayPluginApi.callHandler(JSON.stringify(msg), cb);
  }

  function distribuer(msg) {
    (abonnes[msg.type] || []).forEach((f) => {
      try { f(msg); } catch (e) { console.error(e); }
    });
  }

  function attendreApi() {
    if (!(window.OverlayPluginApi && window.OverlayPluginApi.ready)) {
      setTimeout(attendreApi, 300);
      return;
    }
    const file = attente;
    attente = null;
    window.__OverlayCallback = distribuer;
    envoyer({ call: 'subscribe', events: Object.keys(abonnes) });
    file.forEach(([msg, cb]) => envoyer(msg, cb));
  }

  window.Overlay = {
    estDansAct: () => !!window.OverlayPluginApi,
    ecouter(evenement, f) {
      if (!abonnes[evenement]) {
        abonnes[evenement] = [];
        if (!attente) envoyer({ call: 'subscribe', events: [evenement] });
      }
      abonnes[evenement].push(f);
    },
    appeler(msg) {
      return new Promise((resoudre, rejeter) => envoyer(msg, (data) => {
        if (data == null) return resoudre(null);
        const rep = JSON.parse(data);
        if (rep && rep.$error) rejeter(rep); else resoudre(rep);
      }));
    },
    // Injecte un évènement à la main (mode test dans le navigateur).
    simuler: distribuer,
  };

  attendreApi();
})();
