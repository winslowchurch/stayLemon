import { setupCamera, setupUICamera } from './camera.js';
import { houseMap } from './maps/houseMap.js';
import { setupPlayer } from './player.js';
import { MapManager } from './maps/mapManager.js';
import { setupWeather } from "./weather.js";

export function create() {
    // Initialize the MapManager
    this.mapManager = new MapManager(this);
    this.mapManager.loadMap(houseMap);

    setupWeather(this);
    setupPlayer(this);
    setupCamera(this, houseMap);
    setupUICamera(this);
    setupInputHandlers(this);
}

// Function to set up input handlers
function setupInputHandlers(scene) {
    scene.input.keyboard.on('keydown', (event) => {
        console.log("key pressed");
    });
}

