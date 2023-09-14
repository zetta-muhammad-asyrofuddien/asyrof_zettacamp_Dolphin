const Playlist = require('../controller/playlist');

// const fileSystem = require('../controller/fs');

// const purches = require('./book.js');

const route = (app) => {
  app.get('/group_artist', Playlist.groupMusicArtist);
  app.get('/group_genre', Playlist.groupMusicGenre);
  app.get('/playlist', Playlist.groupMusicPlaylist);

  // app.get('/fs', fileSystem(fs));
  // app.get('/second', secondEndpoint);
};

module.exports = route;
