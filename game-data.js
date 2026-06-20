(function () {
  async function getGames() { return (await window.ContentStore.load()).games || []; }
  window.CinderellaGames = {
    getGames,
    safeImage: (value) => window.ContentStore.safeImage(value),
    makeId: (value) => window.ContentStore.makeId(value)
  };
})();
