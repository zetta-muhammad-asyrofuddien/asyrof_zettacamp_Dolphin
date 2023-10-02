const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  artist: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  playlist: {
    type: mongoose.Types.ObjectId,
    ref: 'Playlist',
    default: null,
  },
});
const Song = mongoose.model('Song', songSchema);
module.exports = Song;
