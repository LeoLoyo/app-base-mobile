export const getWebPlayer = ({ id, type = 'media', token = null, width, height, bgColor }) => `
<!doctype html>
<html>
<header>
  <style>
    body {
      background-color: "${bgColor}";
      padding: 0;
      margin: 0;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
    #mdstrm-player-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
    }
    #mdstrm-player {
      position: relative;
      display: block;
      height: 0;
      padding: 0;
      overflow: hidden;
      padding-bottom: 56.25%;
      flex: 1;
    }
    #mdstrm-player iframe {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
    @media (max-width: 768px) {
      .container-player {
        width: 100%;
      }
      .container-player .col-md-12 {
        padding: 0px !important;
      }
    }
  </style>
</header>
  <body>
  <!-- Load the JavaScript library -->
  <!--<script src="https://platform.s-mdstrm.com/js/player_api.js"></script>-->
  <script src="https://platform-devel.s-mdstrm.com/js/player_api.js"></script>


  <!-- Create the element that will contain the iframe. You will use the #ID later -->
     <div id="mdstrm-player-wrapper">
        <div id="mdstrm-player"></div>
      </div>

  <!-- Create a new player using the JavaScript API -->
  <script>
    window.EMBED_HOST = "develop.mdstrm.com";
    
    var playerOptions = {
      width: "${width}",
      height: "${height}",
      type: "${type}",
      id: "${id}",
      autoplay: true,
      events: {
        onPlayerReady: function() { 
          player.videoPlay();
          window.postMessage('{"event": "onPlayerReady"}');
        },
        onPlay: function() {
          window.postMessage('{"event": "onPlay"}');
        },
        onVideoEnd: function() {
          window.postMessage('{"event": "onVideoEnd"}');
        },
        onVideoStop: function() {
          window.postMessage('{"event": "onVideoStop"}');
        },
        onVideoError: function() {
          window.postMessage('{"event": "onVideoError"}');
        },
        onVolumeChange: function(volume) {
          window.postMessage('{"event": "onVolumeChange", "value": ' + volume + '}');
        },
        onTimeUpdate: function(time) {
          window.postMessage('{"event": "onTimeUpdate", "value": ' + time + '}');
        },
        onFullscreenChange: function(fullscreen) {
          window.postMessage('{"event": "onFullscreenChange", "value": ' + fullscreen + '}');
        }
      }
    };

    if ("${token}" !== 'null') {
      playerOptions.access_token = "${token}"
    }

    var player = new MediastreamPlayer("mdstrm-player", playerOptions);
    player.videoPlay();
  </script>

  </body>
</html>
`
