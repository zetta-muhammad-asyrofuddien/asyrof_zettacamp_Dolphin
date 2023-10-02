function songBasedArtist(data) {
  const groupedArtistData = new Map();
  const groupedArtistList = new Set();

  data.forEach((item) => {
    const artist = item.artist;
    groupedArtistList.add(artist);
    if (!groupedArtistData.has(artist)) {
      // if key not exist, make a new key for map
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
      // if key not exist, make a new key for map
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

  //change array of object to MAP
  const mapPlaylistSong = new Map();
  mapPlaylistSong.set('Playlist less than 1 hour ( ' + totalDuration + ' )', PlaylistSongs);

  return mapPlaylistSong;
}

const groupMusicArtist = async (req, res) => {
  try {
    const artis = songBasedArtist(songList);
    const list = Array.from(artis.groupedArtistList);
    const byArtist = Object.fromEntries(artis.groupedArtistData);
    const result = {
      'Artist List': list,
      'Group by Artist': byArtist,
    };

    // console.log(artis.groupedArtistList);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      msg: 'Internal Server Error',
    });
  }
};
const groupMusicGenre = async (req, res) => {
  try {
    const genre = songBasedGenre(songList);
    const list = Array.from(genre.groupedGenreList);
    const byGenre = Object.fromEntries(genre.groupedGenreData);
    const result = {
      'Genre List': list,
      'Group by Genre': byGenre,
    };
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      msg: 'Internal Server Error',
    });
  }
};
const groupMusicPlaylist = async (req, res) => {
  try {
    const playlist = Playlist(songList);

    // console.log(playlist);
    res.status(200).json(Object.fromEntries(playlist));
  } catch (error) {
    res.status(500).json({
      msg: 'Internal Server Error',
    });
  }
};

module.exports = { groupMusicArtist, groupMusicGenre, groupMusicPlaylist };
