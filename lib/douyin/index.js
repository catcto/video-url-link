const request = require('request');
const util = require('../util');
const cheerio = require('cheerio');

/**
 * Get douyin Info
 *
 * @param {string} url
 * @param {Object} options
 * @param {Function(Error, Object)} callback
 */
exports.getInfo = (url, options, callback) => {
    if(typeof options === 'function') callback = options, options = {};
    options = util.getReqOpt(options);
    options.url = url;
    request(options, (error, response, body) => {
        if (error) {
            callback(error);
        } else {
            if (response.statusCode == 200 && body) {
                const $ = cheerio.load(body);
                let info = {
                    title: $('#videoUser .user-title').text(),
                    url: $('video.video-player').attr('src')
                }
                callback(null, info);
            } else {
                callback(new Error('Not Found douyin'));
            }
        }
    });
}