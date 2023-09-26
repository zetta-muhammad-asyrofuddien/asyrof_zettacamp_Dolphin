const { createPlaylist } = require('../controller/playlist');
const song = require('../controller/song');
const playlist = require('../controller/playlist');

// const fileSystem = require('../controller/fs');

// const purches = require('./book.js');

const route = (app) => {
  app.post('/addSong', song.createSong);
  app.post('/getSong', song.getAllSong);
  app.post('/updateSong/:id', song.updateSong);
  app.post('/deleteSong/:id', song.deleteSong);
  ///////////////////////////////////////////////////
  app.post('/addPlaylistArtist', playlist.createPlaylistArtist);
  app.post('/addPlaylistGenre', playlist.createPlaylistGenre);
  app.post('/getPlaylist', playlist.getAllPlaylist);
  app.post('/deletePlaylist', playlist.deletePlaylist);
  app.post('/updatePlaylist/:id', playlist.updatePlaylistAddSong);
  app.post('/1hour', playlist.playlist1Hour);
};

module.exports = route;
