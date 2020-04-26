/**
 * External modules
 */

const ffmpeg = require('fluent-ffmpeg');

/**
 * Utils Module
 */

function _getFileData(filePath) {
  return new Promise(
    (resolve, reject) => {
      ffmpeg.ffprobe(
        filePath,
        (err, metadata) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(metadata);
        }
      );
    }
  );
}

function _padTime(value) {
  if (value < 10) {
    return '0' + value;
  }

  return value;
}

function _formatTime(timeInSeconds) {
  const hours = Math.floor(
    timeInSeconds / 3600
  );
  const minutes = Math.floor(
    (timeInSeconds - (hours * 3600)) / 60
  );
  const seconds = Math.floor(
    timeInSeconds % 60
  );

  return (
    `${
      _padTime(hours)
    }:${
      _padTime(minutes)
    }:${
      _padTime(seconds)
    }`
  );
}

async function _getVideoInfo(filePath) {
  try {
    let fileMetaData = await _getFileData(filePath);

    let videoInfo = {};

    if (fileMetaData.streams[0].duration !== 'N/A') {
      videoInfo = fileMetaData.streams[0];
    }
    else if (fileMetaData.format.duration) {
      videoInfo = fileMetaData.format;
    }

    return {
      startTime: '00:00:00',
      endTime: _formatTime(videoInfo.duration)
    };
  }
  catch (exception) {
    return {
      error: exception
    };
  }
}

async function _getVideoTimeRange(
  inputFilePath,
  startTime,
  endTime
) {
  try { 
    const info = await _getVideoInfo(
      inputFilePath
    );

    return {
      from: startTime ? startTime : info.startTime,
      to: endTime ? endTime : info.endTime
    };
  }
  catch (exception) {
    return {
      from: '',
      to: ''
    };
  }
}

module.exports = {
  getVideoTimeRange: _getVideoTimeRange,
};
