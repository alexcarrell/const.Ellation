var five = require("johnny-five");
var pixel = require("./node_modules/node-pixel/lib/pixel.js");
const got = require('got');

var opts = {};
opts.port = process.argv[2] || "";

var board = new five.Board(opts);
var strip = null;

var fps = 2; // how many frames per second do you want to try?

//const LED_URL = "http://localhost:5000/api/Xyz";
const LED_URL = "http://10.10.10.87/api/activeled/";

var led = 1;
var ledChanged = true;

function getCurrentLed() {
    return led;
}

function setCurrentLed(newLed) {
    if (parseInt(newLed) != parseInt(led)) {
        console.log(newLed + ' is different from ' + led);
        led = newLed;
        ledChanged = true;
    }
}

function prepareForNewLed() {
    console.log('led changed');
    for(var i = 0; i < strip.length; i++) {
        strip.pixel( i ).color( "rgb(0, 10, 0)" );
    }
    strip.show();
}

function lookupNewLed() {
    got(LED_URL)
    .then(response => {
        console.log("API call finished with response: "+response.body);
        if (response.body) {
            try {
                temp = new Number(response.body);
                //console.log("Temp: "+temp);
                if (temp >= 0 && temp <= 173) {
                    setCurrentLed(temp);
                }
                //console.log("Temp: "+led);
            } catch (e) {
                console.log("I caught an error: " + e.message);
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
        data: 6,
        length: 174, // number of pixels in the strip.
        board: this,
        controller: "FIRMATA"
    });

    strip.on("ready", function() {

        var pixelWasOn = false;

        console.log("LED strip ready event: show 3 colors");

        strip.off();

        var blinker = setInterval(function() {

            lookupNewLed();

            if (ledChanged) {
                prepareForNewLed();
                ledChanged = false;
            } else {

                for(var i = 0; i < 174; i++) {
                    strip.pixel(i).off();
                }
    
                if (!pixelWasOn) {
                    strip.pixel(getCurrentLed()).color("rgb(0, 100, 0)");
                }
    
                strip.show();
    
                //console.log('was on? ' + pixelWasOn);
                pixelWasOn = !pixelWasOn;
            }

        }, 1000/fps);
    });
});
