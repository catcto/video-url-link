const request = require('request');
const util = require('../util');
const cheerio = require('cheerio');

/**
 * Get instagram Info
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
                const data = JSON.parse(body.match(/<script type="text\/javascript">window._sharedData = (.*);<\/script>/)[1]) || {};
                const type = data.entry_data.PostPage[0].graphql.shortcode_media.__typename;
                let info = {};
                if (type === 'GraphImage') {
                    info.list = [{
                        image: data.entry_data.PostPage[0].graphql.shortcode_media.display_url
                    }];
                } else if (type === 'GraphSidecar') {
                    info.list = data.entry_data.PostPage[0].graphql.shortcode_media.edge_sidecar_to_children.edges.map((item) => ({
                        image: item.node.display_url,
                        video: item.node.video_url,
                    }));
                } else if (type === 'GraphVideo') {
                    info.list = [{
                        image: data.entry_data.PostPage[0].graphql.shortcode_media.display_url,
                        video: data.entry_data.PostPage[0].graphql.shortcode_media.video_url,
                    }];
                }
                callback(null, info);
            } else {
                callback(new Error('Not Found instagram'));
            }
        }
    });
}