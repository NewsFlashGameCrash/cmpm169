// import the modules
import { Sequencer } from './spessasynth_lib/sequencer/sequencer.js'
import { Synthetizer } from './spessasynth_lib/synthetizer/synthetizer.js'
import { WORKLET_URL_ABSOLUTE } from './spessasynth_lib/synthetizer/worklet_url.js'

new p5(function(p5){
    let keys = [];
    let white_keys = [];
    let black_keys = [];
    let current_notes = [];
    const key_height = 75;
    let tempo = 0;

    function get_channel(channels) {
        let lowestSetBit = (channels) & (-channels);
        if(lowestSetBit) {
            if(lowestSetBit >= 65536 || Math.floor(Math.log2(lowestSetBit)) >= 16) {
                console.log("ERROR OUT OF BOUNDS FROM ", channels);
            }
            return Math.floor(Math.log2(lowestSetBit));
        }
        return 16;
    }

    p5.setup = function() {
        p5.createCanvas(p5.windowWidth, p5.windowHeight * 0.75);
        p5.background(50);
        for (let ctr = 0; ctr < 128; ctr++)
        {
            const key = new Key(ctr);
            keys.push(key);
            if(key.white == 1) {
                white_keys.push(key);
            }
            else {
                black_keys.push(key);
            }
        }
        for (let ctr = 0; ctr < 16; ctr++) {
            let temp_keys_array = [];
            for(let iter = 0; iter < 128; iter++) {
                temp_keys_array[iter] = null;
            }
            current_notes[ctr] = temp_keys_array;
        }
    };
    p5.draw = function() {
        p5.clear();
        p5.background(50);
        for (let ctr = 0; ctr < white_keys.length; ctr++) {
            const key = white_keys[ctr]
            p5.fill(channelColors[get_channel(key.channel)]);
//            console.log("Returning ", get_channel(key.channel), " from ", key.channel);
            p5.rect(key.x, key.y, key.width, key.height);
        }
        for (let ctr = 0; ctr < black_keys.length; ctr++) {
            const key = black_keys[ctr]
            if(get_channel(key.channel) == 16) {
                p5.fill(channelColors[17]);
            }
            else {
                p5.fill(channelColors[get_channel(key.channel)]);
            }
            p5.rect(key.x, key.y, key.width, key.height);
        }
        for (let ctr = note_array.length - 1; ctr >= 0; ctr--) {
            const note = note_array[ctr];
            if(get_channel(note.channel) >= 16 || get_channel(note.channel) < 0) {
                console.log("ERROR OOB GOT ", get_channel(note.channel), " from ", note.channel);
            }
            p5.fill(channelColors[get_channel(note.channel)]);
            tempo = seq.currentTempo;
            if(note.playing) {
                note.height += (key_height) * (120 * p5.deltaTime/60000);
            }
            note.y -= (key_height) * (120 * p5.deltaTime/60000);
            if(note.y + note.height < 0) {
                note_array.splice(ctr, 1);
            }
            else {
                p5.rect(note.x, note.y, note.width, note.height);
            }
        }
    }
    // add different colors to channels!
    const channelColors = [
        'rgba(255, 99, 71, 1)',   // tomato
        'rgba(255, 165, 0, 1)',   // orange
        'rgba(255, 215, 0, 1)',   // gold
        'rgba(50, 205, 50, 1)',   // limegreen
        'rgba(60, 179, 113, 1)',  // mediumseagreen
        'rgba(0, 128, 0, 1)',     // green
        'rgba(0, 191, 255, 1)',   // deepskyblue
        'rgba(65, 105, 225, 1)',  // royalblue
        'rgba(138, 43, 226, 1)',  // blueviolet
        'rgba(50, 120, 125, 1)',  //'rgba(218, 112, 214, 1)', // percission color
        'rgba(255, 0, 255, 1)',   // magenta
        'rgba(255, 20, 147, 1)',  // deeppink
        'rgba(218, 112, 214, 1)', // orchid
        'rgba(240, 128, 128, 1)', // lightcoral
        'rgba(255, 192, 203, 1)', // pink
        'rgba(255, 255, 0, 1)',   // yellow
        'rgba(255, 255, 255, 1)',  // white
        'rgba(0, 0, 0, 1)'        // black
    ];
    
    class Key{
        constructor(note){
            if((note % 2 == 0 && note % 12 <= 4) || (note % 2 == 1 && note % 12 >= 5)) {
                
                this.x = p5.width / 75 * ((Math.floor(note / 12) * 7 + Math.ceil(Math.min(note % 12 - 5, 0) / 2) + Math.ceil(Math.max(note % 12, 4) / 2)));
                this.width = p5.width / 75
                this.height = key_height;
                this.channel = 0;
                this.white = 1;
            }
            else {
                this.x = p5.width / 75 * (1 + (Math.floor(note/12) * 7 + Math.ceil(Math.min(note % 12 - 5, 0) / 2) + Math.ceil(Math.max(note % 12, 4) / 2))) - (p5.width / 75) * (3.5 / 12);
                this.width = (p5.width / 75) * (7 / 12);
                this.height = key_height * 2/3;
                this.channel = 0;
                this.white = 0;
            }
            this.y = p5.height - key_height;
        }
    }

    class Notes extends Key{
        constructor(note, channel){
            super(note);
            this.y = p5.height - key_height;
            this.height = 0;
            this.channel = channel;
            this.playing = true;
            note_array.push(this);
        }
    }
    

    // adjust this to your liking
    const VISUALIZER_GAIN = 2;

    // load default soundfont
    const context = new AudioContext();
    context.audioWorklet.addModule(new URL("./spessasynth_lib/" + WORKLET_URL_ABSOLUTE, import.meta.url));
    let synth;
    let seq;
    let soundFontArrayBuffer;
    let famicomSoundfont;
    let note_array = [];

    // add keys to keyboard


    fetch("soundfont.sf3").then(async response => {
        famicomSoundfont = response;
        // load the soundfont into an array buffer
        soundFontArrayBuffer = await response.arrayBuffer();

        // create the context and add audio worklet
        synth = new Synthetizer(context.destination, soundFontArrayBuffer); // create the synthetizer
        // add listeners to show note being pressed
        // add note on listener
        synth.eventHandler.addEvent("noteon", "demo-keyboard-note-on", event => {
            let note = new Notes(event.midiNote, (1 << (event.channel % 16)));
            if(!current_notes[event.channel % 16][event.midiNote]) {
                current_notes[event.channel % 16][event.midiNote] = note;
                keys[event.midiNote].channel |= (1 << (event.channel % 16));
                if(event.channel == 0) {
                    console.log("Added channel ", event.channel, " to key ", event.midiNote, " for value ", keys[event.midiNote].channel);
                }
;
            }
            else {
                note.playing = false;
            }
        });

        // add note off listener
        synth.eventHandler.addEvent("noteoff", "demo-keyboard-note-off", event => {
            current_notes[event.channel % 16][event.midiNote].playing = false;
            current_notes[event.channel % 16][event.midiNote] = null;
            keys[event.midiNote].channel &= ~(1 << (event.channel % 16));

        });

        // add stop all listener
        synth.eventHandler.addEvent("stopall", "demo-keyboard-stop-all", () => {
            for(let ctr = 0; ctr < current_notes.length; ctr++) {
                for(let iter = 0; iter < current_notes[ctr].length; iter++) {
                    if(current_notes[ctr] !== null && current_notes[ctr][iter] !== null) {
                        current_notes[ctr][iter].playing = false;
                        current_notes[ctr][iter] = null;
                    }
                }
            }    
            for(let ctr = 0; ctr < keys.length; ctr++) {
                keys[ctr].channel = 0;
            }
        });
    });

    // load the soundfont
    document.getElementById("soundfont_input").onchange = async e =>
    {
        // check if there's a file uploaded
        let file;
        if (!e.target.files[0])
        {
            file = famicomSoundfont;
            soundfontLabel.innerHTML = "Using The Normalized Famicom Multichip Bank VG2";
        }
        else {
            file = e.target.files[0];
            soundfontLabel.innerHTML = e.target.files[0].name
        }
        soundFontArrayBuffer = await file.arrayBuffer(); // convert to array buffer,
        // create the context and add audio worklet
        synth.soundfontManager.reloadManager(soundFontArrayBuffer);     // create the synthetizer
    }

    // add an event listener for the file inout
    document.getElementById("midi_input").addEventListener("change", async event => {
        // check if any files are added
        if (!event.target.files[0]) {
            midiLabel.innerHTML = "Please Upload a File";
            return;
        }
        await context.resume();
        const midiFile = await event.target.files[0].arrayBuffer(); // convert the file to array buffer
        midiLabel.innerHTML = await event.target.files[0].name;
        if(seq === undefined)
        {
            seq = new Sequencer([{binary: midiFile}], synth); // create the sequencer with the parsed midis
            seq.loop = false;
            console.log(seq);
//            tempo = (await seq.getMIDI()).tempoChanges[0].tempo;
            seq.play(); // play the midi
        }
        else
        {
            seq.loadNewSongList([{binary: midiFile}]); // the sequencer is alreadu created, no need to create a new one.
        }
    });

    document.getElementById("pause").onclick = () => {
        if (seq.paused) {
            document.getElementById("pause").innerText = "Pause";
            seq.play(); // resume
        }
        else {
            document.getElementById("pause").innerText = "Resume";
            seq.pause(); // pause

        }
    }
});