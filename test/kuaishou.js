const assert = require('assert');
const videoUrlLink = require('..');

describe('videoUrlLink.kuaishou', () => {
    const urls = [
        'http://www.gifshow.com/s/J5BhBj2V'
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