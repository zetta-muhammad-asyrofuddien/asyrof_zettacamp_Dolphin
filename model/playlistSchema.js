const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  playlistName: {
    type: String,
    required: true,
    unique: true,
  },
  songs: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Song',
    },
  ],
});
const Playlist = mongoose.model('Playlist', playlistSchema);
module.exports = Playlist;
