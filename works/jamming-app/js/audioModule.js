(function(window, undefined) {
  // Inicial settings
  var audio = undefined;
  var loop = false;
  var volumeSlider = undefined;
  var durationElement = undefined;
  var currentTimeElement = undefined;
  var currentTrackNumber = 0;
  var albumLength;
  var albumTitle;
  var fullSong;
  var details;
  var tracks;

  // HTML elements
  var btnPlayPause = document.getElementById('btnPlayPause');
  var toggleMuted = document.getElementById('toggleMuted');
  var playlist = document.getElementById('playlist');
  var seekbar = document.getElementById('seekbar');

  // Call for the playlist
  function apiCall(albumID) {
      $.ajax({
        type:'GET',
        url: 'http://api.deezer.com/album/'+albumID+'?output=jsonp',
        dataType:'jsonp',

        success: function(data) {
            tracks = data.tracks.data;
            albumTitle = data.title;
            playlistGenerator(tracks);
          },

          error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
          }
      });
  }

  function init() {
    audio = document.createElement('audio');
    audio.setAttribute('src', '#.mp3');
        
    // Volume slider
    volumeSlider = document.getElementById('volumeSlider');
    volumeSlider.addEventListener('change', setVolume, false);

    audio.durationchange = duration;
    durationElement = document.getElementById('duration');
    currentTimeElement = document.getElementById('currentTime');

    // Audio events
    audio.addEventListener('durationchange', setDuration);
    audio.addEventListener('timeupdate', setCurrentTime);
    audio.addEventListener('timeupdate', progressBar, true);
    setCurrentTime();
  };

  // Play-Pause button toggle
  btnPlayPause.addEventListener('click', function() {
    if(audio.paused || audio.ended) {
      audio.play();
      btnPlayPause.innerHTML = "<i class='fa fa-pause'></i>";
    }else {
      audio.pause();
      btnPlayPause.innerHTML = "<i class='fa fa-play'></i>";
    } 
  });

  // Playable list generator
  function playlistGenerator(tracks) { 
    var listContainer = "<h3>"+albumTitle+"</h3><ul>";
    var listNumber = 0;

      for(var i = 0; i < 14; i++) {
        listNumber ++;
        listContainer += 
        "<li class='playlist-item' onclick='player.trackPlayer(" +listNumber+ ")'>"+
        "<span class='playlist-id'>" +listNumber+ "</span>"+
        "<p class='playlist-song'>" +tracks[i].title+ "</p>"+
        "<span class='playlist-time'>" +transform(tracks[i].duration)+ "</span>"+
        "<p class='playlist-artist'>" +tracks[i].artist.name+ "</p>"+
        "</li>";
      }
      listContainer += "</ul>";
      document.getElementById('playlist').innerHTML = listContainer;
      albumLength = listNumber;
      trackDataDisplayer(tracks, 1);
  };

  function showList() {
    playlist.classList.toggle('clicked');
  };

  // Song click player
  function trackPlayer(id) {
    currentTrackNumber = id;
    trackDataDisplayer(tracks, currentTrackNumber);
    btnPlayPause.innerHTML = "<i class='fa fa-pause'></i>";
    audio.play();
  };

  function trackDataDisplayer(tracks, position) {
    id = position-1;
    audio.setAttribute('src', tracks[id].preview);
  };

  // Next track player on click
  function nextTrack() {
    currentTrackNumber = getNextTrackNum(currentTrackNumber);
    trackDataDisplayer(tracks, currentTrackNumber);
    btnPlayPause.innerHTML = "<i class='fa fa-pause'></i>";
    audio.play();
  };
  
  function getNextTrackNum(currTrackNum) {
    currTrackNum++;
    if(currTrackNum == albumLength+1) {
      currTrackNum = 1;
    }
    return currTrackNum;
  };

  // Previous track player on click
  function previousTrack() {
    currentTrackNumber = getPreviousTrackNum(currentTrackNumber);
    trackDataDisplayer(tracks, currentTrackNumber);
    btnPlayPause.innerHTML = "<i class='fa fa-pause'></i>";
    audio.play();
  };

  function getPreviousTrackNum(currTrack) {
    currTrack--;
    if(currTrack == 0){
      currTrack = albumLength;
    }
    return currTrack;
  };

  function muted() {
    if(audio.muted =! audio.muted) {
      toggleMuted.innerHTML = "<i class='fa fa-volume-off'>";
    }else {
      toggleMuted.innerHTML = "<i class='fa fa-volume-up'>";
    }
  };

  function setVolume() {
    audio.volume = volumeSlider.value / 100;
  };

  function progressBar() { 
      seekbar.setAttribute('value', playingSong / fullSong);
    };

  function setDuration() {
    fullSong = Math.floor(audio.duration);
    durationElement.innerHTML = ' / '+transform(fullSong);
  };

  function setCurrentTime() {
    playingSong = Math.floor(audio.currentTime);
    currentTimeElement.innerHTML = transform(playingSong);
  };

  function transform(secondsRaw) {
    var minutes = Math.floor(secondsRaw / 60);
    var seconds = secondsRaw - minutes * 60;
    seconds = seconds.toString();
    if( seconds.length == 1 ){
      seconds = '0'+seconds;
    }else {
      false;
    }
    return minutes+' : '+seconds;
  };

  function repeatSong(button) {
    loop =! loop;
    if(loop) {
      audio.setAttribute('loop', '');
      button.classList.add('active');
    }else {
      audio.removeAttribute('loop');
      button.classList.remove('active');
    };
  };

  function resetSong(button) {
    audio.load();
    audio.play();
    currentTimeElement.innerHTML = '0 : 00';
  };

  // Javascript Class using Revealing Module Pattern
  window.Player = function() {
    apiCall(302127);
    init();
    // Revealing Module Pattern
    return {
      apiCall:apiCall,
      muted:muted,
      setVolume:setVolume,
      trackPlayer:trackPlayer,
      next:nextTrack,
      previous:previousTrack,
      showList:showList,
      repeatSong:repeatSong,
      resetSong:resetSong
    };
  }
})(window, undefined);