var audio = document.querySelector('audio')

function myPlay(url) {
  audio.src = url
  audio.load();
  audio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
  }, false);
  audio.play();
  var context = new AudioContext();
  var src = context.createMediaElementSource(audio);
  var analyser = context.createAnalyser();

  var canvas = document.getElementById("vizcool");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var WIDTH = canvas.width;
  var HEIGHT = canvas.height;

  var ctx = canvas.getContext("2d");

  src.connect(analyser);
  analyser.connect(context.destination);

  analyser.fftSize = 4096 * (WIDTH > 1000 ? 2 : 1);

  var bufferLength = analyser.frequencyBinCount;

  var dataArray = new Uint8Array(bufferLength);

  var barWidth = (WIDTH / bufferLength) * 2.5;
  var barHeight;
  var x = 0;

  window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    barWidth = (WIDTH / bufferLength) * 2.5;
    analyser.fftSize = 4096 * (WIDTH > 1000 ? 2 : 1);
  })

  function renderFrame() {
    requestAnimationFrame(renderFrame);

    x = 0;

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for (var i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] * 1.5;

      var gradient = ctx.createLinearGradient(WIDTH/2, HEIGHT, WIDTH/2, HEIGHT/1.5);
      gradient.addColorStop(0, toColor(COLORPRIMARY));
      gradient.addColorStop(1, toColor(COLORSECONDARY));
      ctx.fillStyle = gradient;

      ctx.fillRect(x, HEIGHT - barHeight, barWidth+2, barHeight);

      x += barWidth + 1;
    }
  }

  audio.play();
  renderFrame();
};

function toColor(num) {
  strnum = num.toString(16)
  return `#${'0'.repeat(6 - strnum.length)}${strnum}`
}

document.querySelector('input[type="file"]').onchange = function() {
  var files = this.files;
  myPlay(URL.createObjectURL(files[0]));
}

myPlay('/Resonance.mp3')
