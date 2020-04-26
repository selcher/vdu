/**
 * External modules
 */

const chalk = require('chalk');
const logSymbols = require('log-symbols');

/**
 * MSG module
 */

const MSG = {
  about: (name, version) => [
    chalk.white(` ${name.toUpperCase()}`),
    chalk.gray(`- ${version}`)
  ].join(' '),

  usage: chalk.white('[options]'),

  examples: (name) => [
    '\n',
    chalk.white('Example:'),
    chalk.white(`\n  $ ${name} -h`),
    chalk.white(`\n  $ ${name} -u 'link'`)
  ].join(' '),

  done: [
    ` ${logSymbols.success}`,
    chalk.white('Done\n')
  ].join(' '),

  versionParam: chalk.cyanBright('-v, --version'),
  versionParamDescription: chalk.gray('Display the current version'),

  outputParam: chalk.cyanBright('-o, --output [output]'),
  outputParamDescription: chalk.gray('output file path'),

  errorParam: chalk.cyanBright('-e, --error'),
  errorParamDescription: chalk.gray('display error message'),

  commandNotFound: (name) => [
    ` ${logSymbols.warning}`,
    chalk.yellow('Command Not Found'),
    '\n',
    logSymbols.warning,
    chalk.yellow(`Use "${name} -h" for help`)
  ].join(' '),

  commandParseError: (err) => [
    ` ${logSymbols.error}`,
    chalk.yellow('Failed to recognize command:'),
    '\n',
    chalk.gray(err)
  ].join(' '),

  commandError: [
    ` ${logSymbols.warning}`,
    chalk.yellow('Oh no, something went wrong.'),
    '\n',
    logSymbols.warning,
    chalk.yellow('Use -e to view the error and try again.')
  ].join(' '),

  outputFile: (outputFilePath) => [
    ` ${logSymbols.success}`,
    chalk.white('Output File:'),
    chalk.gray(outputFilePath)
  ].join(' '),

  timeRange: (fromTime, toTime)  => [
    chalk.cyanBright(' +'),
    chalk.white('['),
    chalk.yellow(`${fromTime} -> ${toTime}`),
    chalk.white(']'),
  ].join(' '),

  clipVideo: (filePath) => [
    chalk.cyanBright(' +'),
    chalk.white('Clipping video:'),
    chalk.yellow(filePath)
  ].join(' '),

  toMP4: (filePath) => [
    chalk.cyanBright(' +'),
    chalk.white('Converting to MP4:'),
    chalk.yellow(filePath)
  ].join(' '),

  getAudio: (filePath) => [
    chalk.cyanBright(' +'),
    chalk.white('Get audio from:'),
    chalk.yellow(filePath)
  ].join(' '),

  removeAudio: (filePath) => [
    chalk.cyanBright(' +'),
    chalk.white('Remove audio of:'),
    chalk.yellow(filePath)
  ].join(' '),

  imgToVideo: (imgFilePath, audioFilePath) => [
    chalk.cyanBright(' +'),
    chalk.white('Create video with'),
    chalk.gray(`[${imgFilePath}]`),
    chalk.white('and'),
    chalk.gray(`[${audioFilePath}]`)
  ].join(' '),

  audioToVideo: (audioFilePath, videoFilePath) => [
    chalk.cyanBright(' +'),
    chalk.white('Replace audio in'),
    chalk.gray(`[${videoFilePath}]`),
    chalk.white('with'),
    chalk.gray(`[${audioFilePath}]`)
  ].join(' '),

  loopVideo: (filePath, loops) => [
    chalk.cyanBright(' +'),
    chalk.white('Loop video'),
    chalk.gray(`[${filePath}]`),
    chalk.gray('['),
    chalk.yellow(`x${loops}`),
    chalk.gray(']')
  ].join(' '),

  invalidLoopValue: [
    ` ${logSymbols.error}`,
    chalk.yellow('Number of loops must be > 0')
  ].join(' '),

  reverseVideo: (filePath) => [
    chalk.cyanBright(' +'),
    chalk.white('Reversing video:'),
    chalk.gray(filePath)
  ].join(' '),

  scaleVideo: (filePath, width) => [
    chalk.cyanBright(' +'),
    chalk.white('Scaling video'),
    chalk.gray(`[${filePath}]`),
    chalk.white('to width'),
    chalk.yellow(width)
  ].join(' '),

  resizeVideo: (filePath, width, height) => [
    chalk.cyanBright(' +'),
    chalk.white('Resizing video'),
    chalk.gray(`[${filePath}]`),
    chalk.white('to'),
    chalk.gray('['),
    chalk.yellow(`${width}x${height}`),
    chalk.gray(']')
  ].join(' '),

  setFps: (filePath, fps) => [
    chalk.cyanBright(' +'),
    chalk.white('Set to'),
    chalk.gray('['),
    chalk.yellow(`${fps}fps`),
    chalk.gray(']'),
    chalk.white('of'),
    chalk.gray(`[${filePath}]`),
  ].join(' '),

  setSpeed: (filePath, speed) => [
    chalk.cyanBright(' +'),
    chalk.white('Set speed to'),
    chalk.gray('['),
    chalk.yellow(`${speed}x`),
    chalk.gray(']'),
    chalk.white('of'),
    chalk.gray(`[${filePath}]`),
  ].join(' '),

  setSpeedVideoOnly: (filePath, speed) => [
    chalk.cyanBright(' +'),
    chalk.white('Set speed to'),
    chalk.gray('['),
    chalk.yellow(`${speed}x`),
    chalk.gray(']'),
    chalk.white('of'),
    chalk.gray(`[${filePath}] (no audio)`),
  ].join(' '),

  setSpeedAudioOnly: (filePath, speed) => [
    chalk.cyanBright(' +'),
    chalk.white('Set speed to'),
    chalk.gray('['),
    chalk.yellow(`${speed}x`),
    chalk.gray(']'),
    chalk.white('of'),
    chalk.gray(`[${filePath}] (audio)`),
  ].join(' '),

  grayscaleVideo: (filePath) => [
    chalk.cyanBright(' +'),
    chalk.white('Applying grayscale to:'),
    chalk.gray(filePath)
  ].join(' '),

  invertVideo: (filePath) => [
    chalk.cyanBright(' +'),
    chalk.white('Inverting colors in:'),
    chalk.gray(filePath)
  ].join(' '),

  contrastVideo: (filePath) => [
    chalk.cyanBright(' +'),
    chalk.white('Increasing contrast of:'),
    chalk.gray(filePath)
  ].join(' '),
};

module.exports = MSG;
