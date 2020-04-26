# VDU

VDU (video utility) is a cli tool for performing common operations on video files.

※ alpha version

## Prerequisites

* [ffmpeg](https://www.ffmpeg.org/)

## Installation

```bash
npm install -g vdu
```

## Usage

To view all available commands

```bash
vdu -h
```

To clip  a video
- start time: 0 seconds
- end time: 10 seconds

```bash
vdu clip "video.mp4" 00:00 00:10
```

To get the full audio

```bash
vdu audio "video.mp4"
```

To get the audio
- start time: 0 seconds
- end time: 10 seconds

```bash
vdu audio "video.mp4" 00:00 00:10
```

To loop a video 1 time

```bash
vdu loop "video.mp4" 1
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)