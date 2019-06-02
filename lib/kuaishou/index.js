const request = require('request');
const util = require('../util');
const cheerio = require('cheerio');

/**
 * Get kuaishou Info
 *
 * @param {string} url
 * @param {Object} options
 * @param {Function(Error, Object)} callback
 */
exports.getInfo = (url, options, callback) => {
    if (typeof options === 'function') callback = options, options = {};
    options = util.getReqOpt(options);
    options.url = url;
    request(options, (error, response, body) => {
        if (error) {
            callback(error);
        } else {
            if (response.statusCode == 200 && body) {
                const $ = cheerio.load(body);
                let info = {
                    title: $('video').attr('alt'),
                    url: $('video').attr('src')
                }
                if (!info.title || info.title === '...') {
                    info.title = $('.user .info .txt').text() + ', ' + $('.user .info .name').text();
                }
                callback(null, info);
            } else {
                callback(new Error('Not Found kuaishou'));
            }
        }
    });
}