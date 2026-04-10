const ctx = new (window.AudioContext || window.webkitAudioContext)();

let volumeSlider, pitchSlider;

window.onload = () => {
  volumeSlider = document.getElementById("volume");
  pitchSlider = document.getElementById("pitch");
};

// 母音フォルマント（ちょいリアル寄り）
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

  // スライダー値取得
  const volume = parseFloat(volumeSlider.value);
  const pitch = parseFloat(pitchSlider.value);

  // 音源（柔らかめ）
  osc.type = "triangle";

  // 微妙な揺れを追加（人間っぽさ）
  osc.frequency.value = pitch + (Math.random() - 0.5) * 3;

  // 直通音（少し混ぜると自然）
  osc.connect(gain);

  // フォルマント（並列）
  vowels[vowel].forEach(freq => {
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = freq;
    f.Q.value = 7; // なめらか

    osc.connect(f);
    f.connect(gain);
  });

  gain.connect(ctx.destination);

  // 音量エンベロープ（ちょい強め）
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume * 2, ctx.currentTime + 0.02);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

  osc.start();
  osc.stop(ctx.currentTime + 0.5);
}
