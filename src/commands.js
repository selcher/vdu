/**
 * External modules
 */

const util = require('util');
const exec = util.promisify(
  require('child_process').exec
);

const utils = require('./utils');

const msg = require('./msg');
const log = console.log;

/**
 * Commands Module
 */

const FFMPEG_EXE_PATH = 'ffmpeg';
const DEFAULT_OUTPUT_VIDEO = 'video.mp4';
const DEFAULT_OUTPUT_AUDIO = 'audio.mp3';

const COMMANDS = {

  "clipMP4": (
    inputFilePath,
    outputFilePath,
    startTime,
    endTime
  ) => (
    [
      FFMPEG_EXE_PATH,
      `-ss ${startTime}`,
      `-to ${endTime}`,
      `-i "${inputFilePath}"`,
      '-acodec copy',
      `"${outputFilePath}"`
    ].join(' ')
  ),

  "toMP4": (
    inputFilePath,
    outputFilePath
  ) => (
    [
      FFMPEG_EXE_PATH,
      `-i "${inputFilePath}"`,
      // '-c copy',
      // '-strict experimental',
      '-c:v libx264',
      '-c:a aac',
      `"${outputFilePath}"`
    ].join(' ')
  ),

  "MP4TOMP3": (
    inputFilePath,
    outputFilePath,
    startTime,
    endTime
  ) => (
    [
      FFMPEG_EXE_PATH,
      `-ss ${startTime}`,
      `-to ${endTime}`,
      `-i "${inputFilePath}"`,
      '-f mp3',
      '-vn',
      `"${outputFilePath}"`
    ].join(' ')
  ),

  "noAudio": (
    inputFilePath,
    outputFilePath,
    startTime,
    endTime
  ) => (
    [
      FFMPEG_EXE_PATH,
      `-ss ${startTime}`,
      `-to ${endTime}`,
      `-i "${inputFilePath}"`,
      '-c copy',
      '-an',
      `"${outputFilePath}"`
    ].join(' ')
  ),

  "mergeImgAndAudio": (
    inputImgFilePath,
    inputAudioFilePath,
    outputFilePath
  ) => (
    [
      FFMPEG_EXE_PATH,
      '-loop 1',
      `-i "${inputImgFilePath}"`,
      `-i "${inputAudioFilePath}"`,
      '-c:v libx264',
      '-tune stillimage',
      '-c:a aac',
      '-pix_fmt yuv420p',
      '-shortest',
      `"${outputFilePath}"`
    ].join(' ')
  ),

  "addAudioToVideo": (
    inputAudioFilePath,
    inputVideoFilePath,
    outputFilePath
  ) => (
    [
      FFMPEG_EXE_PATH,
      `-i "${inputAudioFilePath}"`,
      `-i "${inputVideoFilePath}"`,
      '-c:v copy',
      '-c:a aac',
      '-strict experimental',
      '-shortest',
      `"${outputFilePath}"`
    ].join(' ')
  ),

  "loopVideo": (
    inputVideoFilePath,
    outputFilePath,
    numberOfLoops = 1
  ) => (
    [
      FFMPEG_EXE_PATH,
      `-stream_loop ${numberOfLoops}`,
      `-i "${inputVideoFilePath}"`,
      '-c copy',
      `"${outputFilePath}"`
    ].join(' ')
  ),

  "reverseVideo": (
    inputVideoFilePath,
    outputFilePath
  ) => (
    [
      FFMPEG_EXE_PATH,
      `-i "${inputVideoFilePath}"`,
      '-vf reverse',
      `"${outputFilePath}"`
    ].join(' ')
  ),

  "scaleVideo": (
    inputVideoFilePath,
    outputFilePath,
    width
  ) => (
    [
      FFMPEG_EXE_PATH,
      `-i "${inputVideoFilePath}"`,
      `-vf scale=${width}:-2,setsar=1:1`,
      '-c:v libx264',
      '-c:a copy',
      `"${outputFilePath}"`
    ].join(' ')
  ),

  "resizeVideo": (
    inputVideoFilePath,
    outputFilePath,
    width,
    height
  ) => (
    [
      FFMPEG_EXE_PATH,
      `-i "${inputVideoFilePath}"`,
      `-s ${width}x${height}`,
      '-sws_flags neighbor',
      '-sws_dither none',
      '-c:v libx264',
      '-c:a copy',
      `"${outputFilePath}"`
    ].join(' ')
  ),

  "setFps": (
    inputVideoFilePath,
    outputFilePath,
    fps = 30
  ) => (
    [
      FFMPEG_EXE_PATH,
      `-i "${inputVideoFilePath}"`,
      '-filter:v',
      `fps=fps=${fps}`,
      `"${outputFilePath}"`
    ].join(' ')
  ),

  "setSpeed": (
    inputVideoFilePath,
    outputFilePath,
    speed = 2
  ) => (
    [
      FFMPEG_EXE_PATH,
      `-i "${inputVideoFilePath}"`,
      `-filter_complex`,
      `"[0:v]setpts=${Math.round(1 / speed * 100) / 100}*PTS[v];`,
      `[0:a]atempo=${speed}[a]"`,
      '-map "[v]"',
      '-map "[a]"',
      `"${outputFilePath}"`
    ].join(' ')
  ),

  "setSpeedVideoOnly": (
    inputVideoFilePath,
    outputFilePath,
    speed = 2
  ) => (
    [
      FFMPEG_EXE_PATH,
      `-i "${inputVideoFilePath}"`,
      `-filter:v "setpts=${Math.round(1 / speed * 100) / 100}*PTS"`,
      `"${outputFilePath}"`
    ].join(' ')
  ),

  "setSpeedAudioOnly": (
    inputVideoFilePath,
    outputFilePath,
    speed = 2
  ) => (
    [
      FFMPEG_EXE_PATH,
      `-i "${inputVideoFilePath}"`,
      `-filter:a "atempo=${speed}"`,
      `"${outputFilePath}"`
    ].join(' ')
  ),

  "grayscaleVideo": (
    inputVideoFilePath,
    outputFilePath
  ) => (
    [
      FFMPEG_EXE_PATH,
      `-i "${inputVideoFilePath}"`,
      '-vf hue=s=0',
      `"${outputFilePath}"`
    ].join(' ')
  ),

  "invertVideo": (
    inputVideoFilePath,
    outputFilePath
  ) => (
    [
      FFMPEG_EXE_PATH,
      `-i "${inputVideoFilePath}"`,
      '-vf negate',
      `"${outputFilePath}"`
    ].join(' ')
  ),

  "contrastVideo":  (
    inputVideoFilePath,
    outputFilePath
  ) => (
    [
      FFMPEG_EXE_PATH,
      `-i "${inputVideoFilePath}"`,
      '-vf curves=preset=increase_contrast',
      `"${outputFilePath}"`
    ].join(' ')
  ),
}

async function _runCommand(command) {
  try {
    const {
      stdout,
      stderr
    } = await exec(
      command
    );

    return {
      output: stdout,
      error: stderr
    };
  }
  catch (exception) {
    return {
      error: exception
    };
  }
}

const commandList = [
  {
    syntax: 'clip <videoFilePath> [from] [to]',
    description: 'Clip a video',
    outputFilePath: DEFAULT_OUTPUT_VIDEO,
    action: async (outputFilePath, videoFilePath, fromTime, toTime) => {
      log(msg.clipVideo(videoFilePath));

      try { 
        const timeRange = await utils.getVideoTimeRange(
          videoFilePath,
          fromTime,
          toTime
        );

        log(msg.timeRange(timeRange.from, timeRange.to));

        return _runCommand(
          COMMANDS.clipMP4(
            videoFilePath,
            outputFilePath,
            timeRange.from,
            timeRange.to
          )
        );
      }
      catch (exception) {
        return Promise.reject(exception);
      }
    }
  },

  {
    syntax: 'toMp4 <webmFilePath>',
    description: 'Convert webm to mp4 file',
    outputFilePath: DEFAULT_OUTPUT_VIDEO,
    action: (outputFilePath, webmFilePath) => {
      log(msg.toMP4(webmFilePath));

      return _runCommand(
        COMMANDS.toMP4(
          webmFilePath,
          outputFilePath
        )
      );
    }
  },

  {
    syntax: 'audio <videoFilePath> [from] [to]',
    description: 'Get the audio of a video',
    outputFilePath: DEFAULT_OUTPUT_AUDIO,
    action: async (outputFilePath, videoFilePath, fromTime, toTime) => {
      log(msg.getAudio(videoFilePath));

      try {
        const timeRange = await utils.getVideoTimeRange(
          videoFilePath,
          fromTime,
          toTime
        );

        log(msg.timeRange(timeRange.from, timeRange.to));
    
        return _runCommand(
          COMMANDS.MP4TOMP3(
            videoFilePath,
            outputFilePath,
            timeRange.from,
            timeRange.to
          )
        );
      }
      catch (exception) {
        return Promise.reject(exception);
      }
    }
  },

  {
    syntax: 'noaudio <videoFilePath> [from] [to]',
    description: 'Remove the audio of a video',
    outputFilePath: DEFAULT_OUTPUT_VIDEO,
    action: async (outputFilePath, videoFilePath, fromTime, toTime) => {
      log(msg.removeAudio(videoFilePath));

      try {
        const timeRange = await utils.getVideoTimeRange(
          videoFilePath,
          fromTime,
          toTime
        );

        log(msg.timeRange(timeRange.from, timeRange.to));
    
        return _runCommand(
          COMMANDS.noAudio(
            videoFilePath,
            outputFilePath,
            timeRange.from,
            timeRange.to
          )
        );
      }
      catch (exception) {
        return Promise.reject(exception);
      }
    }
  },

  {
    syntax: 'imgtovideo <imageFilePath> <audioFilePath>',
    description: 'Create a video with an image and audio file',
    outputFilePath: DEFAULT_OUTPUT_VIDEO,
    action: (outputFilePath, imageFilePath, audioFilePath) => {
      log(msg.imgToVideo(imageFilePath,audioFilePath));

      return _runCommand(
        COMMANDS.addImgToAudio(
          imageFilePath,
          audioFilePath,
          outputFilePath
        )
      );
    }
  },

  {
    syntax: 'audiotovideo <audioFilePath> <videoFilePath>',
    description: 'Add audio to a video file',
    outputFilePath: DEFAULT_OUTPUT_VIDEO,
    action: (outputFilePath, audioFilePath, videoFilePath) => {
      log(msg.audioToVideo(audioFilePath, videoFilePath));

      return _runCommand(
        COMMANDS.addAudioToVideo(
          audioFilePath,
          videoFilePath,
          outputFilePath
        )
      );
    }
  },

  {
    syntax: 'loop <videoFilePath> <numberOfLoops>',
    description: 'Loop a video',
    outputFilePath: DEFAULT_OUTPUT_VIDEO,
    action: (outputFilePath, videoFilePath, numberOfLoops) => {
      const loops = parseInt(numberOfLoops);

      if (loops < 1) {
        return Promise.reject(msg.invalidLoopValue);
      }

      log(msg.loopVideo(videoFilePath, loops));

      return _runCommand(
        COMMANDS.loopVideo(
          videoFilePath,
          outputFilePath,
          loops
        )
      );
    }
  },

  {
    syntax: 'reverse <videoFilePath>',
    description: 'Reverse the playback of a video',
    outputFilePath: DEFAULT_OUTPUT_VIDEO,
    action: (outputFilePath, videoFilePath) => {
      log(msg.reverseVideo(videoFilePath));

      return _runCommand(
        COMMANDS.reverseVideo(
          videoFilePath,
          outputFilePath
        )
      );
    }
  },

  {
    syntax: 'scale <videoFilePath> <width>',
    description: 'Scale the size to the given width',
    outputFilePath: DEFAULT_OUTPUT_VIDEO,
    action: (outputFilePath, videoFilePath, width) => {
      log(msg.scaleVideo(videoFilePath, width));

      return _runCommand(
        COMMANDS.scaleVideo(
          videoFilePath,
          outputFilePath,
          width
        )
      );
    }
  },

  {
    syntax: 'resize <videoFilePath> <width> <height>',
    description: 'Resize to the given width and height',
    outputFilePath: DEFAULT_OUTPUT_VIDEO,
    action: (outputFilePath, videoFilePath, width, height) => {
      log(msg.resizeVideo(videoFilePath, width, height));

      return _runCommand(
        COMMANDS.resizeVideo(
          videoFilePath,
          outputFilePath,
          width,
          height
        )
      );
    }
  },

  {
    syntax: 'fps <videoFilePath> <fps>',
    description: 'Set the no of frames per second',
    outputFilePath: DEFAULT_OUTPUT_VIDEO,
    action: (outputFilePath, videoFilePath, fps) => {
      log(msg.setFps(videoFilePath, fps));

      return _runCommand(
        COMMANDS.setFps(
          videoFilePath,
          outputFilePath,
          fps
        )
      );
    }
  },

  {
    syntax: 'speed <videoFilePath> <speed>',
    description: 'Set the video speed',
    outputFilePath: DEFAULT_OUTPUT_VIDEO,
    action: (outputFilePath, videoFilePath, speed) => {
      log(msg.setSpeed(videoFilePath, speed));

      return _runCommand(
        COMMANDS.setSpeed(
          videoFilePath,
          outputFilePath,
          speed
        )
      );
    }
  },

  {
    syntax: 'speedvideo <videoFilePath> <speed>',
    description: 'Set the speed of videos without audio',
    outputFilePath: DEFAULT_OUTPUT_VIDEO,
    action: (outputFilePath, videoFilePath, speed) => {
      log(msg.setSpeedVideoOnly(videoFilePath, speed));

      return _runCommand(
        COMMANDS.setSpeedVideoOnly(
          videoFilePath,
          outputFilePath,
          speed
        )
      );
    }
  },

  {
    syntax: 'speedaudio <videoFilePath> <speed>',
    description: 'Set the speed of an audio file',
    outputFilePath: DEFAULT_OUTPUT_AUDIO,
    action: (outputFilePath, audioFilePath, speed) => {
      log(msg.setSpeedAudioOnly(audioFilePath, speed));

      return _runCommand(
        COMMANDS.setSpeedAudioOnly(
          audioFilePath,
          outputFilePath,
          speed
        )
      );
    }
  },

  {
    syntax: 'grayscale <videoFilePath>',
    description: 'Convert video to black and white',
    outputFilePath: DEFAULT_OUTPUT_VIDEO,
    action: (outputFilePath, videoFilePath) => {
      log(msg.grayscaleVideo(videoFilePath));

      return _runCommand(
        COMMANDS.grayscaleVideo(
          videoFilePath,
          outputFilePath
        )
      );
    }
  },

  {
    syntax: 'invert <videoFilePath>',
    description: 'Invert the colors of the video',
    outputFilePath: DEFAULT_OUTPUT_VIDEO,
    action: (outputFilePath, videoFilePath) => {
      log(msg.invertVideo(videoFilePath));

      return _runCommand(
        COMMANDS.invertVideo(
          videoFilePath,
          outputFilePath
        )
      );
    }
  },

  {
    syntax: 'contrast <videoFilePath>',
    description: 'Increase the contrast of the video',
    outputFilePath: DEFAULT_OUTPUT_VIDEO,
    action: (outputFilePath, videoFilePath) => {
      log(msg.contrastVideo(videoFilePath));

      return _runCommand(
        COMMANDS.contrastVideo(
          videoFilePath,
          outputFilePath
        )
      );
    }
  },

];

module.exports = commandList;