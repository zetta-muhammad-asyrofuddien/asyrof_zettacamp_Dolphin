const songList = [
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
    title: 'Birunya Cinta',
    artist: 'Mansyur S',
    year: 2010,
    duration: '5:12',
    genre: 'Dangdut',
  },
  {
    title: 'Goyang Dumang',
    artist: 'Cita Citata',
    year: 2014,
    duration: '3:47',
    genre: 'Dangdut',
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
    title: 'Despacito',
    artist: 'Luis Fonsi ft. Daddy Yankee',
    year: 2017,
    duration: '3:48',
    genre: 'Reggaeton',
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
  const groupedArtist = {};

  data.forEach((item) => {
    const artist = item.artist;
    if (!groupedArtist[artist]) { // jika ada artis baru ->  membuat key baru / jika artis tidak sesuai maka akan dimasukkan ke dalam artis yang sesuai
      groupedArtist[artist] = [];
    }
    groupedArtist[artist].push({
      title: item.title,
      year: item.year,
      duration: item.duration,
      genre: item.genre,
    });
  });

  return groupedArtist;
}

function songBasedGenre(data) {
  const songBasedGenre = {};

  data.forEach((item) => {
    const genre = item.genre;
    if (!songBasedGenre[genre]) { // jika ada artis baru ->  membuat key baru / jika artis tidak sesuai maka akan dimasukkan ke dalam artis yang sesuai
      songBasedGenre[genre] = [];
    }
    songBasedGenre[genre].push({
      artist: item.artist,
      title: item.title,
      year: item.year,
      duration: item.duration,
      
    });
  });

  return songBasedGenre;
}
// function songBasedGenre(data,search) {
//   const songBasedGenre = {};
//   if(search === undefined){
//     data.forEach((item) => {
//       const genre = item.genre;
//       if (!songBasedGenre[genre]) { // jika ada artis baru ->  membuat key baru / jika artis tidak sesuai maka akan dimasukkan ke dalam artis yang sesuai
//         songBasedGenre[genre] = [];
//       }
//       songBasedGenre[genre].push({
//         artist: item.artist,
//         title: item.title,
//         year: item.year,
//         duration: item.duration,
        
//       });
//     });
//     return songBasedGenre;
//   } else if(search) {
//     const genreSongs = data.filter((item) => item.genre === search);
//     return genreSongs;
//   }
 

  
// }

  function Playlist(data){
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
      if(totalDurationInSeconds  + songDurationInSeconds  <= 3600) { //dicek jika total dutasi sebelumnya + durasi yang akan ditambah akan melebihi 60 menit atau tidak
        PlaylistSongs.push(song); //jika iya push song lagi
        totalDurationInSeconds += convertToSeconds(song.duration); // durasi ditambah
      } 
    }
    
    let totalMinutes = Math.floor(totalDurationInSeconds / 60);
    const totalSeconds = totalDurationInSeconds % 60;
    if(totalSeconds<10) {
      console.log(`Total Durasi : ${totalMinutes}:0${totalSeconds}`);
    } else {
      console.log(`Total Durasi : ${totalMinutes}:${totalSeconds}`);
    }
    
    return PlaylistSongs;

  }


console.log('Grouped by Artist : ')
console.log(songBasedArtist(songList));
console.log('----------------------------------------------------------------------------------- ')
console.log('Grouped by Genre : ')
console.log(songBasedGenre(songList));
// console.log(songBasedGenre(songList,'Rock'));
console.log('----------------------------------------------------------------------------------- ')
console.log('Playlist     : ZettaCamp_Asyrof ')
console.table(Playlist(songList));
