const util = require('../util');
const Util = require('util');
const request = require('request').defaults({ jar: true });
var _ = require('lodash');
const AUTHORIZATION = 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
const API_GUEST = 'https://api.twitter.com/1.1/guest/activate.json';
const API_TIMELINE = 'https://api.twitter.com/2/timeline/conversation/%s.json?tweet_mode=extended'

/**
 * Get twitter ID
 *
 * @param {string} url
 * @return {string}
 */
exports.getID = (url) => {
    var regex = /twitter\.com\/[^/]+\/status\/(\d+)/;
    var matches = regex.exec(url);
    return matches && matches[1];
};

/**
 * Get twitter Info
 *
 * @param {string} url
 * @param {Object} options
 * @param {Function(Error, Object)} callback
 */
exports.getInfo = (url, options, callback) => {
    if (typeof options === 'function') callback = options, options = {};
    const id = exports.getID(url);
    if (id) {
        req({
            url: API_GUEST,
            method: 'POST',
        }, options, (error, body) => {
            const errInfo = 'Some error in the video format';
            if (error) {
                callback(error);
            } else {
                let guest_token;
                try {
                    guest_token = JSON.parse(body).guest_token;
                } catch (err) {
                    return callback(new Error(errInfo));
                }
                req({
                    url: Util.format(API_TIMELINE, id),
                    method: 'GET',
                    headers: {
                        'x-guest-token': guest_token
                    }
                }, options, (error, body) => {
                    if (error) {
                        callback(error);
                    } else {
                        try {
                            const info = JSON.parse(body);
                            callback(null, {
                                full_text: info['globalObjects']['tweets'][id]['full_text'],
                                variants: info['globalObjects']['tweets'][id]['extended_entities']['media'][0]['video_info']['variants']
                            });
                        } catch (err) {
                            return callback(new Error(errInfo));
                        }
                    }
                });
            }
        });
    } else {
        callback(new Error('Not a twitter URL'));
    }
}

function req(opt, options, callback) {
    opt = _.defaultsDeep({
        headers: {
            'authorization': AUTHORIZATION
        }
    }, opt, options);
    request(opt, (error, response, body) => {
        if (error) {
            callback(error);
        } else {
            if (response.statusCode == 200 && body) {
                callback(null, body);
            } else {
                callback(new Error('twitter API error'));
            }
        }
    });
}
