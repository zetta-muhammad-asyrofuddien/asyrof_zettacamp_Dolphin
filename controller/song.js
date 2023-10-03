const Playlist = require('../model/playlistSchema');
const Song = require('../model/songSchema');

const createSong = async (req, res) => {
  try {
    const songData = req.body;
    for (const arr of songData) {
      await Song.create(arr); //create document to database one by one because the body is array of obj
    }
    res.status(201).json({ message: songData.length + ' Song created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};

const getAllSong = async (req, res) => {
  try {
    const { page, dataperpage, filter } = req.body;
    // console.log(dataperpage);
    let pipeline = [];
    if (filter.genre !== '') {
      pipeline.push({
        $match: filter,
      });
    }

    pipeline.push(
      { $match: { year: { $lte: year } } },
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
                from: 'playlists',
                localField: 'playlist',
                foreignField: '_id',
                as: 'playlist',
              },
            },
          ],
        },
      },

      {
        $project: {
          'metadata.__v': 0,
          'metadata.playlist.__v': 0,
          'metadata.playlist.songs': 0,
          'metadata.playlist._id': 0,
        },
      }
    );
    const Songs = await Song.aggregate(pipeline);
    if (Songs[0].totalData.length === 0) {
      return res.status(404).json({ msg: filter.genre + "'s Song not found" });
    }
    // console.log(Songs);
    const totalData = Songs[0].totalData[0].count;
    const totalPage = Math.floor(totalData / dataperpage);
    const song = Songs[0].metadata;
    // console.log(page);
    // console.log(Songs[0].metadata);
    const result = {
      pageInfo: {
        totalData: totalData,
        page: page + ' / ' + totalPage,
      },
    };
    res.status(200).json({ result, song });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};

const updateSong = async (req, res) => {
  try {
    const id = { _id: req.params.id };
    const data = req.body;
    // console.log(data);
    const update = await Song.findByIdAndUpdate(id, data, { new: true });
    if (!update) {
      return res.status(404).json({ error: 'song not found' });
    }
    res.status(200).json({ message: 'Song updated successfully', song: update });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};
const deleteSong = async (req, res) => {
  try {
    const id = { _id: req.params.id };
    const chek = await Song.find(id);
    const filter = { playlistName: chek[0].genre + "'s Playlist" };

    //delete song also pull from songs
    if (chek[0].playlist) {
      await Playlist.updateOne(filter, { $pull: { songs: id._id } });
    }

    const deleteSong = await Song.findByIdAndRemove(id, { new: true });
    if (!deleteSong) {
      return res.status(404).json({ error: 'song not found' });
    }
    res.status(200).json({ message: 'Song delete successfully', song: deleteSong });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', msg: error.message });
  }
};
module.exports = {
  createSong,
  getAllSong,
  updateSong,
  deleteSong,
};
