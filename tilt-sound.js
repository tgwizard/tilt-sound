(function() {
  var helpText = document.getElementById('help-text');
  var playToggle = document.getElementById('play-toggle');
  var freqLabel = document.getElementById('freq-label');
  var volLabel = document.getElementById('vol-label');

  var minFreq = 220;
  var maxFreq = 1760;

  var t = T('sin');
  setFreq(880);
  setRelativeVol(0.5);

  playToggle.addEventListener('click', function(event) {
    event.stopPropagation();
    if (playToggle.innerText === 'Play') {
      playToggle.innerText = 'Pause';
      t.play();
    } else {
      playToggle.innerText = 'Play';
      t.pause();
    }
  });


  console.log(window.location.search);
  var mode = 'tilt';
  if (/mode=click/.test(window.location.search)) mode = 'click';
  console.log(mode);

  if (mode === 'tilt' && window.DeviceOrientationEvent) {
    helpText.innerText = 'Change pitch and volume by tilting your device.';
    // http://www.html5rocks.com/en/tutorials/device/orientation/
    window.addEventListener('deviceorientation', function(event) {
      var tiltLR = event.gamma; // this goes from -90 to 90
      var tiltFB = event.beta; // this goes from -90 to 90
      tiltLR += 90;
      tiltFB += 90;
      setRelativeFreq(tiltLR / 180);
      setRelativeVol(tiltFB / 180);
    });
  } else {
    helpText.innerText = 'Change pitch and volume by clicking in the viewport.';
    document.addEventListener('click', function(event) {
      var pos = { x: event.clientX, y: event.clientY };
      var vpSize = getViewPortSize();
      var relPos = { x: pos.x / vpSize.w, y: pos.y / vpSize.h };

      setRelativeFreq(relPos.x);
      setRelativeVol(relPos.y);
    });
  }

  function setRelativeFreq(relVal) {
    var freq = minFreq + (maxFreq - minFreq) * relVal;
    setFreq(freq);
    setRelativeColor(relVal);
  }

  function setFreq(val) {
    freqLabel.innerText = Math.round(val) + ' Hz';
    t.set({ freq: val });
  }

  function setRelativeVol(relVal) {
    volLabel.innerText = 'Vol: ' + Math.round(relVal*100) + '%';
    t.set({ mul: relVal });
  }

  function setRelativeColor(relVal) {
    document.body.style.backgroundColor = 'hsl(' + (relVal * 360) + ', 60%, 45%)';
  }

  function getViewPortSize() {
    // http://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return { w: w, h: h };
  }
})();
