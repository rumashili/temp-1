const ctx = new (window.AudioContext || window.webkitAudioContext)();

window.onload = () => {
  const volumeSlider = document.getElementById("volume");
  const pitchSlider = document.getElementById("pitch");

  alert(String(volumeSlider) + "\n" + String(pitchSlider));
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
  ctx.resume(); // ブラウザ対策

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sawtooth"; // 声っぽい
  osc.frequency.value = 120; // 基本周波数（声の高さ）

  // フォルマント用フィルター2つ
  const filters = vowels[vowel].map(freq => {
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = freq;
    f.Q.value = 15; // 少し鋭く
    return f;
  });

  // 接続：osc → filters → gain → output
  osc.connect(filters[0]);
  filters[0].connect(filters[1]);
  filters[1].connect(gain);
  gain.connect(ctx.destination);

  // 音量エンベロープ（ちょっと自然にする）
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.02);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);

  osc.start();
  osc.stop(ctx.currentTime + 0.5);
}
