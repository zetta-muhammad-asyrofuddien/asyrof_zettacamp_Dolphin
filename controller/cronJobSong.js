const { CronJob } = require('cron');
const Song = require('../model/songSchema');
const moment = require('moment');
/**
 * *CRON is a utility for scheduling recurring tasks on a computer.
 * *It works in the background and executes predefined tasks at specified times.
 * *It's like a digital assistant that performs non-interactive jobs automatically.
 *
 * ! Recurring Tasks:
 * CRON is perfect for tasks you want to repeat at specific intervals, like system maintenance, disk space checks, or backups.
 * ! Daemon:
 * CRON operates as a daemon, always ready to perform tasks.
 * It remains idle until a scheduled task is triggered, either within the computer or from the network.
 * ! Ideal for 24/7 Systems:
 *  CRON is great for computers that run continuously, like servers. It ensures tasks are carried out without manual intervention.
 * ! Use Cases:
 * It's mainly used by system administrators, but web developers can benefit too. For instance,
 * it can be used to deactivate expired accounts, check for broken links, or send targeted newsletters.
 * ?
 * In a nutshell, CRON automates repetitive tasks, making computer management more efficient,
 * especially for always-on systems like servers.
 */
const sec = moment().format('ss');
const min = moment().format('mm');
// console.log(sec);
const job = new CronJob(
  //   '1 * * * *', // every minute is 8
  '0 */5 * * * *',
  //   `${sec} ${min}/5 * * * *`,
  async function () {
    PlaySong();
  },
  null,
  false,
  'Asia/Jakarta'
);

async function PlaySong() {
  try {
    const song = await Song.findOne({ is_already_played: false });
    console.log('------------------------------');
    if (song) {
      await Song.findByIdAndUpdate({ _id: song._id }, { is_already_played: true, last_played: moment().format('DD/MM/YYYY HH:mm:ss') });

      console.log('Played at ' + moment().format('DD/MM/YYYY HH:mm:ss'));
      return console.table({
        playing: song.title,
        artist: song.artist,
        duration: song.duration,
      });
    } else {
      return console.log('song unavalaible');
      //   console.log('Song will be restart');
      //   await Song.updateMany({}, { is_already_played: false });
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = job;
