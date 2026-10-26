// Liaison avec OverlayPlugin par sa bibliothèque officielle (js/vendor/overlayplugin-common.js) : dans ACT,
// elle passe par window.OverlayPluginApi ; sous Linux ou macOS (ou dans un navigateur), par le serveur WebSocket
// d'OverlayPlugin, avec ?OVERLAY_WS=ws://… dans l'adresse de l'overlay. Ailleurs, les appels restent sans réponse.
(function () {
  const viaWebSocket = /[?&]OVERLAY_WS=/.test(location.href);

  window.Overlay = {
    estDansAct: () => viaWebSocket || !!window.OverlayPluginApi,
    // Fenêtre d'aperçu d'OverlayPlugin (ajout d'un overlay depuis un preset), signalée après le chargement.
    estApercu: () => !!(window.OverlayPluginApi && window.OverlayPluginApi.preview),
    // Les écouteurs doivent tous être posés avant demarrer(). Une erreur dans l'un d'eux est notée dans la
    // console sans interrompre la suite des évènements.
    ecouter: (evenement, f) => window.addOverlayListener(evenement, (ev) => {
      try { f(ev); } catch (e) { console.error(e); }
    }),
    demarrer: () => window.startOverlayEvents(),
    appeler: (msg) => window.callOverlayHandler(msg).then((rep) => {
      if (rep && rep.$error) throw rep;
      return rep;
    }),
  };
})();
