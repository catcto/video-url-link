const querystring = require('querystring');
const Url = require('url');
const request = require('request');
const util = require('../util');
const FORMATS = require('./formats');
const VIDEO_URL = 'https://www.youtube.com/watch?v=';
const EMBED_URL = 'https://www.youtube.com/embed/';
const VIDEO_EURL = 'https://youtube.googleapis.com/v/';
const INFO_PROTOCOL = 'https';
const INFO_HOST = 'www.youtube.com';
const INFO_PATH = '/get_video_info';
const KEYS_TO_SPLIT = [
    'fmt_list',
    'fexp',
    'watermark'
];

/**
 * Validate youtube ID
 *
 * @param {string} id
 * @return {boolean}
 */
const idRegex = /^[a-zA-Z0-9-_]{11}$/;
exports.validateID = (id) => {
    return idRegex.test(id);
};

/**
 * Get youtube ID
 *
 * URL formats
 * - https://www.youtube.com/watch?v={ID}
 * - https://m.youtube.com/watch?v={ID}
 * - https://youtu.be/{ID}
 * - https://www.youtube.com/v/{ID}
 * - https://www.youtube.com/embed/{ID}
 * - https://music.youtube.com/watch?v={ID}
 * - https://gaming.youtube.com/watch?v={ID}
 *
 * @param {string} url
 * @return {string}
 */
const queryHost = new Set([
    'youtube.com',
    'www.youtube.com',
    'm.youtube.com',
    'music.youtube.com',
    'gaming.youtube.com',
]);
const pathHost = new Set([
    'youtu.be',
    'youtube.com',
    'www.youtube.com',
]);
exports.getID = (url) => {
    const urlObj = Url.parse(url, true);
    let id = null;
    if (urlObj.query.v && queryHost.has(urlObj.hostname)) {
        id = urlObj.query.v;
    } else if (pathHost.has(urlObj.hostname)) {
        try {
            const paths = urlObj.pathname.split('/');
            id = paths[paths.length - 1];
        } catch (error) {
            console.error(error);
        }
    }
    if (!exports.validateID(id)) {
        console.error('Not a youtube URL');
    }
    return id;
};

/**
 * @param {Object} info
 * @return {Array.<Object>}
 */
exports.parseFormats = (info) => {
    let formats = [];
    if (info.url_encoded_fmt_stream_map) {
        formats = formats.concat(info.url_encoded_fmt_stream_map.split(','));
    }
    if (info.adaptive_fmts) {
        formats = formats.concat(info.adaptive_fmts.split(','));
    }
    formats = formats.map((format) => querystring.parse(format));
    formats.forEach((format) => {
        const meta = FORMATS[format.itag];
        for (let key in meta) {
            format[key] = meta[key];
        }
        if (/\/live\/1\//.test(format.url)) {
            format.live = true;
        }
    });
    return formats;
};

/**
 * Get youtube Info
 *
 * @param {string} url
 * @param {Object} options
 * @param {Function(Error, Object)} callback
 */
exports.getInfo = (url, options, callback) => {
    if(typeof options === 'function') callback = options, options = {};
    const id = exports.getID(url);
    if (id) {
        options = util.getReqOpt(options);
        const infoUrl = Url.format({
            protocol: INFO_PROTOCOL,
            host: INFO_HOST,
            pathname: INFO_PATH,
            query: {
                video_id: id,
                eurl: VIDEO_EURL + id,
                ps: 'default',
                gl: (options.gl || 'US'),
                hl: (options.hl || 'en')
            }
        });
        options.url = infoUrl;
        request(options, (error, response, body) => {
            if (error) {
                callback(error);
            } else {
                if (response.statusCode == 200 && body) {
                    let info = querystring.parse(body);
                    const errInfo = 'Some error in the video format';
                    if (info.status === 'fail') {
                        callback(Error(errInfo));
                    } else {
                        if (info.player_response) {
                            try {
                                info.player_response = JSON.parse(info.player_response);
                            } catch (err) {
                                return callback(new Error(errInfo));
                            }
                            let playability = info.player_response.playabilityStatus;
                            if (playability && playability.status === 'UNPLAYABLE') {
                                return callback(new Error(errInfo));
                            }
                            KEYS_TO_SPLIT.forEach((key) => {
                                if (!info[key]) return;
                                info[key] = info[key]
                                    .split(',')
                                    .filter((v) => v !== '');
                            });
                            var videoInfo = {};
                            videoInfo.fmt_list = info.fmt_list ? info.fmt_list.map((format) => format.split('/')) : [];
                            videoInfo.formats = exports.parseFormats(info);
                            videoInfo.details = info.player_response.videoDetails;
                            callback(null, videoInfo);
                        } else {
                            callback(new Error('Not Found youtube'));
                        }
                    }
                } else {
                    callback(new Error('Not Found youtube'));
                }
            }
        });
    } else {
        callback(new Error('Not a youtube URL'));
    }
}