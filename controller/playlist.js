var songList = [
  {
    title: 'Menunggu Kamu',
    artist: 'Anji',
    year: 2018,
    duration: '4:17',
    genre: 'Pop',
  },
  {
    title: 'Dia',
    artist: 'Anji',
    year: 2016,
    duration: '4:09',
    genre: 'Pop',
  },
  {
    title: 'Arjuna',
    artist: 'Dewa19',
    year: 2002,
    duration: '5:13',
    genre: 'Rock',
  },
  {
    title: 'Gossip Jalanan',
    artist: 'Slank',
    year: 2004,
    duration: '5:13',
    genre: 'Rock',
  },
  {
    title: 'Tetap Dalam Jiwa',
    artist: 'Isyana Sarasvati',
    year: 2015,
    duration: '3:49',
    genre: 'Pop',
  },
  {
    title: 'Bukan Untukku',
    artist: 'Rio Febrian',
    year: 2002,
    duration: '4:16',
    genre: 'Pop',
  },
  {
    title: 'Sempurna',
    artist: 'Andra and The Backbone',
    year: 2007,
    duration: '4:21',
    genre: 'Rock',
  },
  {
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    year: 2017,
    duration: '3:53',
    genre: 'Pop',
  },
  {
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    year: 1975,
    duration: '5:55',
    genre: 'Rock',
  },
  {
    title: 'Uptown Funk',
    artist: 'Mark Ronson ft. Bruno Mars',
    year: 2014,
    duration: '4:30',
    genre: 'Funk',
  },
  {
    title: 'Kau Adalah',
    artist: 'Isyana Sarasvati',
    year: 2015,
    duration: '3:59',
    genre: 'Pop',
  },
  {
    title: 'Winter Song',
    artist: 'Isyana Sarasvati',
    year: 2017,
    duration: '6:24',
    genre: 'Pop',
  },
  {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    year: 2019,
    duration: '3:20',
    genre: 'R&B',
  },
  {
    title: 'Happy',
    artist: 'Pharrell Williams',
    year: 2013,
    duration: '3:53',
    genre: 'R&B',
  },
];

function songBasedArtist(data) {
  const groupedArtistData = new Map();
  const groupedArtistList = new Set();

  data.forEach((item) => {
    const artist = item.artist;
    groupedArtistList.add(artist);
    if (!groupedArtistData.has(artist)) {
      // jika ada artis baru ->  membuat key baru / jika artis tidak sesuai maka akan dimasukkan ke dalam artis yang sesuai
      groupedArtistData.set(artist, []);
    }
    const artistData = {
      title: item.title,
      year: item.year,
      duration: item.duration,
      genre: item.genre,
    };
    groupedArtistData.get(artist).push(artistData);
  });
  // console.log(groupMusicArtist);
  // console.log(groupedArtistList);
  return { groupedArtistData, groupedArtistList };
}

function songBasedGenre(data) {
  const groupedGenreData = new Map();
  const groupedGenreList = new Set();

  data.forEach((item) => {
    const genre = item.genre;
    groupedGenreList.add(genre);
    if (!groupedGenreData.has(genre)) {
      // jika ada artis baru ->  membuat key baru / jika artis tidak sesuai maka akan dimasukkan ke dalam artis yang sesuai
      groupedGenreData.set(genre, []);
    }
    const genreData = {
      artist: item.artist,
      title: item.title,
      year: item.year,
      duration: item.duration,
    };
    groupedGenreData.get(genre).push(genreData);
  });

  return { groupedGenreData, groupedGenreList };
}

function Playlist(data) {
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
  const shuffledData = [...data];
  shuffleArray(shuffledData);

  let totalDurationInSeconds = 0;

  for (const song of shuffledData) {
    const songDurationInSeconds = convertToSeconds(song.duration); // menyimpan nilai detik dari lagu yang akan di tambah
    if (totalDurationInSeconds + songDurationInSeconds <= 3600) {
      //dicek jika total dutasi sebelumnya + durasi yang akan ditambah akan melebihi 60 menit atau tidak
      PlaylistSongs.push(song); //jika iya push song lagi
      totalDurationInSeconds += convertToSeconds(song.duration); // durasi ditambah
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
  const mapPlaylistSong = new Map();
  mapPlaylistSong.set('Playlist less than 1 hour ( ' + totalDuration + ' )', PlaylistSongs);

  return mapPlaylistSong;
}

const groupMusicArtist = async (req, res) => {
  const artis = songBasedArtist(songList);
  const list = Array.from(artis.groupedArtistList);
  const byArtist = Object.fromEntries(artis.groupedArtistData);
  const result = {
    'Artist List': list,
    'Group by Artist': byArtist,
  };

  // console.log(artis.groupedArtistList);
  res.status(200).json(result);
};
const groupMusicGenre = async (req, res) => {
  const genre = songBasedGenre(songList);
  const list = Array.from(genre.groupedGenreList);
  const byGenre = Object.fromEntries(genre.groupedGenreData);
  const result = {
    'Genre List': list,
    'Group by Genre': byGenre,
  };
  res.status(200).json(result);
};
const groupMusicPlaylist = async (req, res) => {
  const playlist = Playlist(songList);
  // console.log(playlist);
  res.status(200).json(Object.fromEntries(playlist));
};

module.exports = { groupMusicArtist, groupMusicGenre, groupMusicPlaylist };
