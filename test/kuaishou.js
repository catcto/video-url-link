const assert = require('assert');
const videoUrlLink = require('..');

describe('videoUrlLink.kuaishou', () => {
    const urls = [
        'http://m.gifshow.com/s/mSm0M3EI'
    ]
    it('kuaishou.getInfo', (done) => {
        videoUrlLink.kuaishou.getInfo(urls[0], (error, info) => {
            if (error) {
                done(error);
            } else {
                console.log(info);
                done();
            }
        });
    });
});