const assert = require('assert');
const videoUrlLink = require('..');

describe('videoUrlLink.douyin', () => {
    const urls = [
        'http://v.douyin.com/B17aH9/'
    ]
    it('douyin.getInfo', (done) => {
        videoUrlLink.douyin.getInfo(urls[0], (error, info) => {
            if (error) {
                done(error);
            } else {
                console.log(info);
                done();
            }
        });
    });
});