window.onload = function() {
  var audio = new Audio('/Resonance.mp3')
  audio.load();
  audio.play();
  var context = new AudioContext();
  var src = context.createMediaElementSource(audio);
  var analyser = context.createAnalyser();

  var canvas = document.getElementById("vizcool");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var ctx = canvas.getContext("2d");

  src.connect(analyser);
  analyser.connect(context.destination);

  analyser.fftSize = 256;

  var bufferLength = analyser.frequencyBinCount;
  console.log(bufferLength);

  var dataArray = new Uint8Array(bufferLength);

  var WIDTH = canvas.width;
  var HEIGHT = canvas.height;

  var barWidth = (WIDTH / bufferLength) * 2.5;
  var barHeight;
  var x = 0;

  function renderFrame() {
    requestAnimationFrame(renderFrame);

    x = 0;

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    for (var i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] * 1.5;

      var r = barHeight + (25 * (i/bufferLength));
      var g = 250 * (i/bufferLength);
      var b = 50;

      var gradient = ctx.createLinearGradient(WIDTH/2, HEIGHT, WIDTH/2, 0);
      gradient.addColorStop(0, '#ff00ff');
      gradient.addColorStop(1, '#00ffff');
      ctx.fillStyle = gradient;

      ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }
  }

  audio.play();
  renderFrame();
};
