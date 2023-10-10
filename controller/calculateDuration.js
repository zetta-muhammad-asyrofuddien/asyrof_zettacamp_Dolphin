function calculateDurationInSeconds(duration) {
  const [minutes, seconds] = duration.split(':');
  // console.log(minutes);
  return parseInt(minutes) * 60 + parseInt(seconds);
}

// Fungsi untuk menghitung durasi dalam format 'MM:SS' dari total detik
function formatDuration(totalSeconds) {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  return `${totalMinutes}:${formattedSeconds}`;
}
module.exports = { calculateDurationInSeconds, formatDuration };
