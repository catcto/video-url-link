const assert = require('assert');
const videoUrlLink = require('..');

describe('videoUrlLink.twitter', () => {
    const urls = [
        'https://twitter.com/taylorswift13/status/1121935013484867585',
        'https://twitter.com/blakelively/status/1045768952872398848'
    ]
    urls.forEach(function (url) {
        it('twitter.getInfo ' + url, (done) => {
            videoUrlLink.twitter.getInfo(url, { proxy: 'http://cat-cn:18888' }, (error, info) => {
                console.log(info);
                done(error);
            });
        });
    });
});