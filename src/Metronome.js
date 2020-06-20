function defaultBuildBeat(audioContext, current16thBeat) {
  const oscillator = audioContext.createOscillator();

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // value in hertz

  return oscillator;
}

export default class Metronome {

  constructor(options) {
    this.options = {
      tempo: 220,
      beatLength: 0.05,
      buildBeat: defaultBuildBeat,
      onBeatScheduled(beatIndex, time, audioContext) {},
    };
    Object.assign(this.options, options);

    this.audioContext = null;
    this.nextBeatTime = 0.0;
    this.initialized = false;
    this.current16thBeat = 0;
    this.playing = false;
  }

  init() {
    if (!this.initialized) {
      this.audioContext = new AudioContext();
      this.nextBeatTime = this.audioContext.currentTime;

      // play silent buffer to unlock the audio
      const node = this.audioContext.createBufferSource();
      node.buffer = this.audioContext.createBuffer(1, 1, 22050);
      node.start(0);
      this.initialized = true;
    }
  }

  start() {
    this.nextBeatTime = this.audioContext.currentTime;
    this.playing = true;
  }

  stop() {
    this.playing = false;
  }

  tick() {
    if (!this.playing) {
      return;
    }

    while (this.nextBeatTime < this.audioContext.currentTime + 0.1) {
      this.scheduleBeat(this.nextBeatTime);
      this.nextBeatTime += 60.0 / this.options.tempo;

      this.current16thBeat += 1;

      if (this.current16thBeat === 16) {
        this.current16thBeat = 0;
      }
    }
  }

  scheduleBeat(time) {
    const node = this.options.buildBeat(this.audioContext, this.current16thBeat);

    node.connect(this.audioContext.destination);
    node.start(time);
    node.stop(time + this.options.beatLength);

    this.options.onBeatScheduled(this.current16thBeat, time, this.audioContext);
  }

  setTempo(tempo) {
    if (tempo < 1) {
      tempo = 1;
    }

    this.options.tempo = tempo;
  }

}
