function initPlayer(URL) {

    const video = document.getElementById('video');
    const videoSrc = URL;

    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
    } else {
        console.error('HLS not supported in this browser');
    }

}

export default function decorate(block) {
    const link = block.querySelector('a');
    const videoLink = link.getAttribute('href');
    link.remove();
    // setup dom elements
    const video = document.createElement('video');
    video.setAttribute('controls', 'controls');
    video.id = 'video';
    //attach block
    block.append(video);
    //initialize player
    initPlayer(videoLink);
}