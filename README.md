# Metronome

> JavaScript metronome library using Web Audio API

## Installation

```
npm i musical-metronome
```

## Usage

```javascript
// ES Module
import { Metronome } from 'musical-metronome';

// CommonJS
const { Metronome } = require('musical-metronome');

//UMD
const Metronome = window.metronome.Metronome;


const metronome = new Metronome({ tempo: 120 });

metronome.init(); // call on user action, e.g. onClick
setInterval(() => metronome.tick(), 25);
metronome.play();
metronome.stop();
```

See example in `public` directory.

## License

[MIT](https://oss.ninja/mit/developit/)
