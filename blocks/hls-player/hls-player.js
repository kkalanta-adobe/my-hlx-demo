function initPlayer(URL){
    document.addEventListener('DOMContentLoaded', () => {
        const video = document.getElementById('video');
        const videoSrc = URL;
      
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(videoSrc);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play();
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = videoSrc;
          video.addEventListener('loadedmetadata', () => {
            video.play();
          });
        } else {
          console.error('HLS not supported in this browser');
        }
      });
}

export default function decorate(block) {
    const videoLink = block.querySelector('a');
    // setup dom elements
    const videoContainer = document.createElement('div');
    videoContainer.classList.add('video-container');    
    const video = document.createElement('video');
    video.setAttribute('controls','controls');
    video.id = 'video';
    videoContainer.appendChild(video);
    //attach block
    block.append(videoContainer);
    //initialize player
    initPlayer(videoLink);
  }