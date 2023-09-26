const Playlist = require('../model/playlistSchema');
const Song = require('../model/songSchema');

const createPlaylistArtist = async (req, res) => {
  try {
    const { artist } = req.body;

    const songData = await Song.find({ artist: artist });
    if (songData.length === 0) {
      return res.status(500).json({ error: artist + "'s song not found" });
    }
    // console.log(songData.map((song) => song._id));
    const create = await Playlist.create({
      playlistName: artist + "'s Playlist",
      songs: songData.map((song) => song._id),
    });
    const idplaylist = await Playlist.find({}).select('_id');
    console.log(idplaylist);
    res.status(200).json({ playlist: create, songs: songData });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};
const createPlaylistGenre = async (req, res) => {
  try {
    const { genre } = req.body;

    const songData = await Song.find({ genre: genre });
    if (songData.length === 0) {
      return res.status(500).json({ error: genre + ' song not found' });
    }
    // console.log(songData.map((song) => song._id));
    const create = await Playlist.create({
      playlistName: genre + "'s Playlist",
      songs: songData.map((song) => song._id),
    });
    const idplaylist = await Playlist.find({ playlistName: genre + "'s Playlist" }).select('_id');
    const songUpdated = await Song.updateMany(
      { genre: genre },
      {
        $set: { playlist: idplaylist[0]._id },
      },
      { new: true }
    );
    // console.log(idplaylist[0]._id);
    res.status(200).json({ playlist: create, songs: songUpdated });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};
const getAllPlaylist = async (req, res) => {
  try {
    const { page, dataperpage, filter, year } = req.body;
    let pipeline = [];
    if (filter.genre !== '') {
      pipeline.push({
        $match: { playlistName: filter.genre + "'s Playlist" },
      });
    }

    pipeline.push(
      {
        $facet: {
          totalData: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },
          ],
          metadata: [
            { $sort: { title: 1 } },
            { $skip: page * dataperpage },
            { $limit: dataperpage },
            {
              $lookup: {
                from: 'songs',
                // localField: 'songs',
                // foreignField: '_id',
                pipeline: [{ $match: { year: { $lte: year } } }],
                as: 'songs',
              },
            },
          ],
        },
      },

      {
        $project: {
          'metadata.__v': 0,
          'metadata.songs.__v': 0,
          'metadata.songs.playlist': 0,
        },
      }
    );
    const PlaylistQuery = await Playlist.aggregate(pipeline);
    if (PlaylistQuery[0].totalData.length === 0) {
      return res.status(404).json({ msg: filter.genre + "'s playlist not found" });
    }
    const setPlaylist = new Set();

    const totalData = PlaylistQuery[0].totalData[0].count;
    const totalPage = Math.floor(totalData / dataperpage);
    const playlist = PlaylistQuery[0].metadata;
    for (const a of playlist) {
      setPlaylist.add(a.playlistName);
    }

    const result = {
      pageInfo: {
        totalData: totalData,
        page: page + ' / ' + totalPage,
        playlists: Array.from(setPlaylist),
      },
    };
    res.status(200).json({ result, playlist });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};
const updatePlaylistAddSong = async (req, res) => {
  try {
    const id = req.params.id;
    const genre = req.body.genre;
    // console.log(id);
    const update = await Playlist.updateOne({ playlistName: genre + "'s Playlist" }, { $push: { songs: id } });
    if (!update) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    const idplaylist = await Playlist.find({ playlistName: genre + "'s Playlist" }).select('_id');
    await Song.updateMany(
      { genre: genre },
      {
        $set: { playlist: idplaylist[0]._id },
      },
      { new: true }
    );
    res.status(200).json({ message: 'Playlist updated successfully', song: update });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};
const deletePlaylist = async (req, res) => {
  try {
    const { genre } = req.body;
    await Playlist.find({ playlistName: genre + "'s Playlist" }).select('_id');
    await Song.updateMany(
      { playlistName: genre + "'s Playlist" },
      {
        $set: { playlist: null },
      },
      { new: true }
    );
    const deletePlaylist = await Playlist.deleteOne(
      {
        playlistName: genre + "'s Playlist",
      },
      { new: true }
    );
    if (!deletePlaylist) {
      return res.status(404).json({ error: 'playlist not found' });
    }

    res.status(200).json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};

const playlist1Hour = async (req, res) => {
  const song = await Song.find();
  console.log(song);
  //   return res.status(200).json(song);
  const PlaylistSongs = [];
  function convertToSeconds(duration) {
    const [minutes, seconds] = duration.split(':'); //sparator , desructure
    return parseInt(minutes) * 60 + parseInt(seconds);
  }

  // Fungsi untuk mengacak array algoritma Fisher-Yates
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
      // console.log(array)
    }
  }
  // const shuffledData = [1,2,3,5,4,6,8,7,4,6,5];
  const shuffledData = [...song];
  shuffleArray(shuffledData);

  let totalDurationInSeconds = 0;

  for (const songs of shuffledData) {
    const songDurationInSeconds = convertToSeconds(songs.duration); // menyimpan nilai detik dari lagu yang akan di tambah
    if (totalDurationInSeconds + songDurationInSeconds <= 3600) {
      //dicek jika total dutasi sebelumnya + durasi yang akan ditambah akan melebihi 60 menit atau tidak
      PlaylistSongs.push(songs); //jika iya push song lagi
      totalDurationInSeconds += convertToSeconds(songs.duration); // durasi ditambah
    }
  }

  let totalMinutes = Math.floor(totalDurationInSeconds / 60);
  const totalSeconds = totalDurationInSeconds % 60;
  let totalDuration;
  if (totalSeconds < 10) {
    totalDuration = totalMinutes + ':0' + totalSeconds;
  } else {
    totalDuration = totalMinutes + ':' + totalSeconds;
  }
  const createPlay = await Playlist.create({
    playlistName: 'Playlist less than 1 hour ( ' + totalDuration + ' )',
    songs: PlaylistSongs,
  });

  res.status(200).json(createPlay);
};
module.exports = {
  createPlaylistArtist,
  createPlaylistGenre,
  getAllPlaylist,
  deletePlaylist,
  updatePlaylistAddSong,
  playlist1Hour,
};
