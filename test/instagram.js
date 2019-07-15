const assert = require('assert');
const videoUrlLink = require('..');

describe('videoUrlLink.instagram', () => {
    const urls = [
        'https://www.instagram.com/p/Bv_Y0S1l-bz/',//image
        'https://www.instagram.com/p/BwYBScsF5Nr/',//images
        'https://www.instagram.com/p/BwqYPMlnu8m/'//video
    ]
    urls.forEach(function (url) {
        it('instagram.getInfo ' + url, (done) => {
            videoUrlLink.instagram.getInfo(url, { timeout: 15000, proxy: 'http://cat-cn:18888' }, (error, info) => {
                console.log(info);
                done(error);
            });
        });
    });
});