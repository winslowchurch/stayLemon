import { preload } from './game/preload.js';
import { create } from './game/create.js';
import { update } from './game/update.js';
import { TitleScreen } from './title/titleScreen.js';
import { GAME_SETTINGS } from "./game/settings.js";

const config = {
    type: Phaser.AUTO,
    width: GAME_SETTINGS.screenWidth,
    height: GAME_SETTINGS.screenHeight,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false,
        },
    },
    scene: [TitleScreen, { key: 'mainScene', preload, create, update }],
};

const game = new Phaser.Game(config);

window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});