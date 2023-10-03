const DataLoader = require('dataloader');
const Song = require('./model/songSchema');
const Playlist = require('./model/playlistSchema');

const PlaylistLoader = new DataLoader(async (playlistIds) => {
  const playlist = await Playlist.find({ _id: { $in: playlistIds } });
  const playlistMap = {};
  playlist.forEach((playlist) => {
    playlistMap[playlist._id] = playlist;
  });
  return playlistIds.map((playlistId) => playlistMap[playlistId]);
});
const songLoader = new DataLoader(async (songIds) => {
  const songs = await Song.find({ _id: { $in: songIds } });
  const songsMap = {};
  songs.forEach((song) => {
    songsMap[song._id] = song;
  });
  return songIds.map((songId) => songsMap[songId]);
});
module.exports = { songLoader, PlaylistLoader };
