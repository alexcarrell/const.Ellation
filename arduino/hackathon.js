var five = require("johnny-five");
var pixel = require("./node_modules/node-pixel/lib/pixel.js");
const got = require('got');

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);
var strip = null;

var fps = 2; // Frames per Second

const LED_URL = "http://10.10.10.87/api/activeled/";
const FEEDBACK_COLOR = "rgb(0, 50, 0)";
const BLINK_COLOR = "rgb(0, 150, 150)";

var led = 0;
var ledChanged = true;

// Getter and Setter for the current LED
function getCurrentLed() {
    return led;
}
function setCurrentLed(newLed) {
    if (parseInt(newLed) != parseInt(led)) {
        console.log('current led changed to: ' + newLed);
        led = newLed;
        ledChanged = true;
    }
}

// Some visual feedback when current LED changes (turn all LEDs to dark green)
function prepareForNewLed() {
    for(var i = 0; i < strip.length; i++) {
        strip.pixel( i ).color( FEEDBACK_COLOR );
    }
    strip.show();
}

// Get the current LED from the API
function lookupNewLed() {
    got(LED_URL)
    .then(response => {
        //console.log("API call finished with response: "+response.body);
        if (response.body) {
            try {
                temp = new Number(response.body);
                //console.log("Temp: "+temp);
                if (temp >= 0 && temp < strip.length) {
                    setCurrentLed(temp);
                }
            } catch (e) {
                console.log("Invalid number returned from the API: " + e.message);
            }
        }
    })
    .catch(err => {
        console.error(err);
    });
}

board.on("ready", function() {

    console.log("Board ready");

    strip = new pixel.Strip({
        data: 6,        // This is the Arduino pin we use (D6)
        length: 174,    // number of pixels in the strip.
        board: this,
        controller: "FIRMATA"
    });

    strip.on("ready", function() {

        var pixelWasOn = false;

        console.log("LED strip ready");

        // Turn all LEDs off
        strip.off();

        var blinker = setInterval(function() {

            lookupNewLed();

            if (ledChanged) {
                prepareForNewLed();
                ledChanged = false;
            } else {

                for(var i = 0; i < strip.length; i++) {
                    strip.pixel(i).off();
                }
    
                if (!pixelWasOn) {
                    strip.pixel(getCurrentLed()).color( BLINK_COLOR );
                }
    
                strip.show();
    
                pixelWasOn = !pixelWasOn;
            }

        }, 1000/fps);
    });
});
