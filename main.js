const ctx = new (window.AudioContext || window.webkitAudioContext)();

let columeSlider, pitchSlider;

window.onload = () => {
  volumeSlider = document.getElementById("volume");
  pitchSlider = document.getElementById("pitch");
};

// 母音ごとのフォルマント（ざっくり）
const vowels = {
  a: [700, 1100, 2500],
  i: [300, 2200, 3000],
  u: [350, 900, 2200],
  e: [500, 1900, 2600],
  o: [500, 1000, 2400]
};

function playVowel(vowel) {
  ctx.resume();

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  const volume = parseFloat(volumeSlider.value);
  const pitch = parseFloat(pitchSlider.value);

  osc.type = "sawtooth";
  osc.frequency.value = pitch;

  const filters = vowels[vowel].map(freq => {
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = freq;
    f.Q.value = 15;
    return f;
  });

  osc.connect(filters[0]);
  filters[0].connect(filters[1]);
  filters[1].connect(gain);
  gain.connect(ctx.destination);

  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.02);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

  osc.start();
  osc.stop(ctx.currentTime + 0.5);
}
