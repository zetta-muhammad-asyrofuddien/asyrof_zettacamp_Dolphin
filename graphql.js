const { gql } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const Song = require('./model/songSchema');
const Playlist = require('./model/playlistSchema');
const User = require('./model/userSchema');
const bcrypt = require('bcrypt');

const typeDefs = gql`
  type Song {
    _id: ID!
    title: String
    artist: String
    year: Int
    duration: String
    genre: String
    playlist: Playlist
    totalData: Int
  }
  type Playlist {
    _id: ID
    playlistName: String
    songs: [Song]
  }
  type detelePlaylist {
    message: String
  }
  type Registration {
    username: String
    firstname: String
    lastname: String
    password: String
  }
  type Users {
    _id: ID
    username: String
    firstname: String
    lastname: String
  }
  type Login {
    userId: ID
    msg: String
    token: String
  }
  input RegistrationInput {
    username: String!
    firstname: String!
    lastname: String!
    password: String!
  }
  input SongInput {
    title: String!
    artist: String!
    year: Int
    duration: String!
    genre: String!
  }
  input SongUpdate {
    title: String
    artist: String
    year: Int
    duration: String
    genre: String
  }
  input SongInputMulti {
    songs: [SongInput]
  }

  type Query {
    getAllUsers: [Users]
    getAllSong(page: Int!, dataperpage: Int!): [Song]
    getSongById(_id: ID!): Song
    getAllPlaylist: [Playlist]
    getPlaylistById(_id: ID!): Playlist
  }

  type Mutation {
    registration(input: RegistrationInput): Registration
    login(username: String, password: String): Login
    createSong(input: SongInputMulti): [Song]
    updateSong(_id: ID!, input: SongUpdate): Song
    deleteSong(_id: ID!): Song
    createPlaylist(name: String): Playlist
    createPlaylistGenre(genre: String): Playlist
    createPlaylistLessOneHour: Playlist
    updatePlaylistAddSong(playlistname: String!, songId: ID!): Playlist
    updatePlaylistRmvSong(playlistname: String!, songId: ID!): Playlist
    deletePlaylist(genre: String!): detelePlaylist
  }
`;

const resolvers = {
  Query: {
    getAllUsers: async (_, args, context) => {
      try {
        return await User.find();
      } catch (error) {
        throw new Error(error.message);
      }
    },
    getAllSong: async (_, { page, dataperpage }, context) => {
      try {
        // return await Song.find();

        // console.log(dataperpage);

        const Songs = await Song.aggregate([
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
              metadata: [{ $sort: { title: 1 } }, { $skip: page * dataperpage }, { $limit: dataperpage }],
            },
          },
        ]);

        // console.log(Songs);
        // const totalData = Songs[0].totalData[0].count;
        const song = Songs[0].metadata;
        // console.log(page);
        // console.log(Songs[0].metadata);

        // console.log(song);
        const pagination = song.map((a) => {
          return {
            ...a,
            totalData: Songs[0].totalData[0].count,
          };
        });
        // console.log(pagination);
        return pagination;
      } catch (error) {
        console.log(error);
        throw new Error(error.message);
      }
    },
    getSongById: async (_, { _id }, context) => {
      try {
        return await Song.findById(_id);
      } catch (error) {
        throw new Error(error.message);
      }
    },
    getAllPlaylist: async (_, args, context) => {
      try {
        verifyJWT(context);
        return await Playlist.find();
      } catch (error) {
        throw new Error(error.message);
      }
    },
    getPlaylistById: async (_, { _id }, context) => {
      try {
        verifyJWT(context);
        return await Playlist.findById(_id);
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Mutation: {
    registration: async (_, { input }, context) => {
      try {
        //putaran
        const saltRounds = 8;
        //encrypt password
        const hashed = await bcrypt.hash(input.password, saltRounds);
        //replace the input passward with hashed password
        input.password = hashed;

        return await User.create(input);
      } catch (error) {
        throw new Error(error.message);
      }
    },
    login: async (_, user, context) => {
      try {
        //find user data
        const userId = await User.find({ username: user.username });

        let jwtSecretKey = 'plered'; //secretkey

        let token;
        //generate token

        //comparing the hashed paswword with user input
        const result = await bcrypt.compare(user.password, userId[0].password);

        //if match generate token
        if (userId[0].username === user.username && result) {
          token = jwt.sign({ userId: userId[0]._id, username: userId[0].username }, jwtSecretKey, { expiresIn: '6h' });
          return { userId: userId[0]._id, msg: 'Login Success', token: token };
        } else {
          throw new Error('Username or Password invalid');
        }
      } catch (error) {
        // console.error(error);
        throw new Error('Username or Password invalid');
      }
    },
    createSong: async (_, { input }, context) => {
      try {
        verifyJWT(context);
        const songData = input.songs;
        //   for (const arr of songData) {
        const createSongs = await Song.create(songData); //create document to database one by one because the body is array of obj
        //   }
        //   console.log(createSongs);
        return createSongs;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    updateSong: async (_, { _id, input }, context) => {
      try {
        // console.log(data);
        verifyJWT(context);
        const update = await Song.findByIdAndUpdate(_id, input, { new: true });
        if (!update) {
          throw new Error('song not found');
        }
        return update;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    deleteSong: async (_, { _id }, context) => {
      try {
        verifyJWT(context);
        const chek = await Song.find({ _id: _id });
        const filter = { playlistName: chek[0].genre + ' Playlist' };

        //delete song also pull from songs
        if (chek[0].playlist) {
          await Playlist.updateOne(filter, { $pull: { songs: _id } });
        }

        const deleteSong = await Song.findByIdAndRemove(_id, { new: true });
        if (!deleteSong) {
          throw new Error('song not found');
        }
        return deleteSong;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    createPlaylist: async (_, { name }, context) => {
      try {
        verifyJWT(context);
        const create = await Playlist.create({
          playlistName: name + ' Playlist',
          songs: [],
        });
        return create;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    createPlaylistGenre: async (_, { genre }, context) => {
      try {
        verifyJWT(context);
        const songData = await Song.find({ genre: genre });
        if (songData.length === 0) {
          return res.status(500).json({ error: genre + ' song not found' });
        }
        // console.log(songData.map((song) => song._id));
        const create = await Playlist.create({
          playlistName: genre + ' Playlist',
          songs: songData.map((song) => song._id),
        });
        const idplaylist = await Playlist.find({ playlistName: genre + ' Playlist' }).select('_id');
        await Song.updateMany(
          { genre: genre },
          {
            $set: { playlist: idplaylist[0]._id },
          },
          { new: true }
        );
        // console.log(idplaylist[0]._id);
        return create;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    createPlaylistLessOneHour: async (_, args, context) => {
      try {
        verifyJWT(context);
        const song = await Song.find();

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
        const playlistId = createPlay._id;

        for (const song of PlaylistSongs) {
          await Song.findByIdAndUpdate(song._id, { playlist: playlistId });
        }
        // console.log(createPlay);
        return createPlay;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    updatePlaylistAddSong: async (_, { playlistname, songId }, context) => {
      try {
        // console.log(songId);
        verifyJWT(context);
        const update = await Playlist.updateOne({ playlistName: playlistname + ' Playlist' }, { $push: { songs: songId } });
        if (!update) {
          throw new Error('Playlist not found');
        }
        const idplaylist = await Playlist.find({ playlistName: playlistname + ' Playlist' });
        await Song.updateOne(
          { _id: songId },
          {
            $set: { playlist: idplaylist[0]._id },
          },
          { new: true }
        );

        return idplaylist[0];
      } catch (error) {
        throw new Error(error.message);
      }
    },
    updatePlaylistRmvSong: async (_, { playlistname, songId }, context) => {
      try {
        // console.log(songId);
        verifyJWT(context);
        const update = await Playlist.updateOne({ playlistName: playlistname + ' Playlist' }, { $pull: { songs: songId } });
        if (!update) {
          throw new Error('Playlist not found');
        }
        const idplaylist = await Playlist.find({ playlistName: playlistname + ' Playlist' });
        await Song.updateOne(
          { _id: songId },
          {
            $set: { playlist: null },
          },
          { new: true }
        );

        return idplaylist[0];
      } catch (error) {
        throw new Error(error.message);
      }
    },
    deletePlaylist: async (_, { genre }, context) => {
      try {
        verifyJWT(context);
        const idPlaylist = await Playlist.find({ playlistName: genre + ' Playlist' }).select('_id');

        await Song.updateMany(
          { playlist: idPlaylist[0]._id },
          {
            $set: { playlist: null },
          },
          { new: true }
        );
        const deletePlaylist = await Playlist.deleteOne(
          {
            playlistName: genre + ' Playlist',
          },
          { new: true }
        );
        if (!deletePlaylist) {
          throw new Error('playlist not found');
        }

        return { message: genre + ' Playlist deleted successfully' };
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Playlist: {
    async songs(parent, args, context) {
      try {
        return await context.songLoader.loadMany(parent.songs); //load single data
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
  Song: {
    async playlist(parent, args, context) {
      try {
        if (parent.playlist != null) {
          return await context.PlaylistLoader.load(parent.playlist); //load single data
        }
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

function verifyJWT(context) {
  try {
    const token = context.req.headers.authorization;
    if (!token) {
      throw new Error('Token not Found'); //if token null/empty
    }

    let userpass;
    //chek the token baerer token or from header
    if (token.split(' ').length === 2) {
      //barear ladkjwahdnlawd
      userpass = token.split(' ')[1];
    } else if (token.split(' ').length === 1) {
      //ladkjwahdnlawd
      userpass = token;
    }
    jwt.verify(userpass, 'plered');
  } catch (error) {
    throw new Error('Password or Username invalid');
  }
}
module.exports = { typeDefs, resolvers };
