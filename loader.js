const DataLoader = require('dataloader');
const Song = require('./model/songSchema');
const Playlist = require('./model/playlistSchema');
/*
In the context of DataLoader, cacheKeyFn is a function that determines how the cache key is generated for the data being loaded. 
The cache key is used to store and retrieve results from the cache.
*/
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

// const DataLoader = require('dataloader');
// const Song = require('./model/songSchema');
// const Playlist = require('./model/playlistSchema');

// const createDataLoader = (model, keyName) => {
//   const loader = new DataLoader(async (keys) => {
//     const documents = await model.find({ [keyName]: { $in: keys } });

//     // Create a map of key to document
//     const documentsMap = new Map();
//     documents.forEach((doc) => {
//       documentsMap.set(doc[keyName], doc);
//     });

//     // Return the documents in the order of keys
//     return keys.map((key) => documentsMap.get(key));
//   });

//   return loader;
// };

// const songLoader = createDataLoader(Song, '_id');
// const playlistLoader = createDataLoader(Playlist, '_id');

// module.exports = { songLoader, playlistLoader };
