/* jshint -W117 */

// Set up variable for the result of the waveform selector
var waveformSelector = document.getElementById("waveFormSelector");
var randomSelector = document.getElementById("randomSelector");

// Oscillator waveform type
var oType = "sawtooth";

// declare Audio Context
var context = new AudioContext();

//set default to ordered and tonic of 220
var tonicSlider;
var cRandom = false;
tonicSlider = 220;


function sliderChange() 
            {
                tonicSlider = document.getElementById('theTonic').innerHTML;
            }

// A major scale tuned like a piano
// The formula is: tonic * 2^(x/12), where x is the 
// number of semitones above the tonic.


// playNote() function plays all notes 1-8 of the array scale
function playNotesFreq1() 
{
    var i;
    majorScale1 = [tonicSlider, tonicSlider * Math.pow(2,2/12), tonicSlider * Math.pow(2,4/12), tonicSlider * Math.pow(2,5/12), tonicSlider * Math.pow(2,7/12), tonicSlider * Math.pow(2,9/12), tonicSlider * Math.pow(2,11/12), tonicSlider * Math.pow(2,12/12)];
   
    for(i = 0; i < 8; i++)
      { 
          var freq;
       
          var currentTime = context.currentTime;
          // Get frequency from the array. Arrays start at 0
          if (!cRandom) {
                freq = majorScale1[i];
          }
          else {
                freq = majorScale1[Math.floor(Math.random() * 7)];
          }
        // Variables for the nodes
        var oscNode, gainNode, filterNode, filterNode2;

        // Create oscillator node, apply frequency and type;
        oscNode = context.createOscillator();

        oscNode.frequency.value = freq;
        oscNode.type = oType;

        // Create gain node, set up envelope
        gainNode = context.createGain();
        // Initial gain = 0
        gainNode.gain.value = 0;
        // The attack of the envelope
        gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.02);
        // The decay of the envelope
        gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 1.2);

        // Create two identical filter nodes in parallel. (The filter effect is more
        // pronounced that way).
        // Create filter node, make it bandpass, hi Q.
        filterNode = context.createBiquadFilter();
        filterNode.type = "bandpass";
        filterNode.Q = 1000; 
        // Create the starting frequency and the filter frequency envelope.
        filterNode.frequency = 100;
        filterNode.frequency.linearRampToValueAtTime(3000, context.currentTime + 2.0);
        filterNode.frequency.linearRampToValueAtTime(600, context.currentTime + 2.0);

        // Exactly the same as above for more pronounced filter effect.
        filterNode2 = context.createBiquadFilter();
        filterNode2.type = "bandpass";
        filterNode2.Q = 1000; 
        filterNode2.frequency = 100;
        filterNode2.frequency.linearRampToValueAtTime(3000, context.currentTime + 0.3);
        filterNode2.frequency.linearRampToValueAtTime(600, context.currentTime + 1.0);


        // Connect the nodes: osc -> gain -> filter -> filter2 -> destination
        oscNode.connect(gainNode);
        gainNode.connect(filterNode);
        filterNode.connect(filterNode2);
        filterNode2.connect(context.destination);

        // Start (play) the oscillator
        oscNode.start(currentTime + i/9);
    
      }
}

// Function called when the selector is changed. Value chosen by selector
// is passed to oType variable.
function selectWaveType() 
{
    oType = waveformSelector.value;
    console.log(oType);
}

function selectIfRandom() 
{
    cRandom = randomSelector.value;
    console.log(cRandom);
    cRandom = randomSelector.value;
}

