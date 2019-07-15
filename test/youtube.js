const assert = require('assert');
const videoUrlLink = require('..');

describe('videoUrlLink.youtube', () => {
    const urls = [
        'https://www.youtube.com/watch?v=ftlvreFtA2A',
        'https://m.youtube.com/watch?v=ftlvreFtA2A',
        'https://youtu.be/ftlvreFtA2A',
        'https://www.youtube.com/v/ftlvreFtA2A',
        'https://www.youtube.com/embed/ftlvreFtA2A',
        'https://music.youtube.com/watch?v=ftlvreFtA2A',
        'https://gaming.youtube.com/watch?v=ftlvreFtA2A',
    ]

    urls.forEach((url) => {
        it('youtube.getID ' + url, () => {
            let id = videoUrlLink.youtube.getID(url);
            assert.equal(id, 'ftlvreFtA2A');
        });
    })

    it('youtube.getInfo', (done) => {
        videoUrlLink.youtube.getInfo('https://www.youtube.com/watch?v=x7OCFcgf504', { hl: 'en', timeout: 15000, proxy: 'http://cat-cn:18888' }, (error, info) => {
            if (error) {
                done(error);
            } else {
                console.log(JSON.stringify(info, null, 4));
                done();
            }
        });
    });
});