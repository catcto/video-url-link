# video-url-link

This module is used to get the video download url link from the website.

Supported Sites: YouTube, 抖音, 腾讯视频, 西瓜视频

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 8.0 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install video-url-link
```

## Usage

```js
const videoUrlLink = require('video-url-link');
```

### Get YouTube Info

videoUrlLink.youtube.getInfo(url, [options], callback(error, info))

```js
videoUrlLink.youtube.getInfo('https://youtu.be/VIDEO_ID', { hl: 'en', timeout: 15000, proxy: 'http://myserver:18888' }, (error, info) => {
    if (error) {
        console.error(error);
    } else {
        console.log(info.details);
        console.log(info.formats);
    }
});
```

## Supported Sites

| Site | URL | Video? | Details? |
| :--- | :--- | :--- | :--- |
| YouTube | <https://www.youtube.com/>  | ✓ | ✓ |

## Tests

Tests are written with [mocha](https://mochajs.org)

```bash
npm test
```