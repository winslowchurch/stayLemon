const GRAPHICS_PATH = '../../graphics/';
const AUDIO_PATH = '../../assets/sounds/';
const FONT_PATH = '../../assets/fonts/';

const assets = {
    bitmapFonts: [
        { key: 'pixelFont', png: `${FONT_PATH}round_6x6.png`, xml: `${FONT_PATH}round_6x6.xml` },
    ],
    images: {
        ui: ['inventoryBar', 'textBox', 'closeButton',],
        nature: ['desert1', 'desert2', 'desert3', 'wall1', 'wall2', 'wall3', 'wall4', 'wall5', 'wall6', 'wall7', 'wall8', 'wall9', 'grass1', 'grass2', 'grassPath', 'skull', 'rock'],
        plants: ['cactus1', 'cactus2', 'deadTree', 'pineTree'],
        buildings: ['house1', 'house2'],
        food: ['cactusChunk', 'cake', 'steak'],
        misc: ['mapTrigger'],
        decoration: ['painting1', 'painting2', 'rug', 'meshDivider', 'flowerDisplay1', 'flowerDisplay2', 'flowerDisplay3', 'furnace', 'barCart', 'bed', 'sideTable', 'flowerPot', 'floorLamp', 'window1'],
        walls: ['blueStripeWall', 'woodWall', 'tileFloor', 'woodFloor']
    },
    audio: ['pop', 'textBlip', 'success',],
    spritesheets: [
        { key: 'lemon', path: 'characters/lemonWalkingSprite.png', frameWidth: 32, frameHeight: 32 },
        { key: 'butterfly', path: 'critters/butterflySprites.png', frameWidth: 16, frameHeight: 16 },
        { key: 'rainDrop', path: 'misc/rainSprite.png', frameWidth: 16, frameHeight: 16 },
        { key: 'rainFloor', path: 'misc/rainFloorSprite.png', frameWidth: 16, frameHeight: 16 }
    ]
};

export function preload() {
    // Fonts
    assets.bitmapFonts.forEach(font =>
        this.load.bitmapFont(font.key, font.png, font.xml)
    );

    // UI
    for (const group in assets.images) {
        assets.images[group].forEach(name => {
            this.load.image(name, `${GRAPHICS_PATH}${group}/${name}.png`);
        });
    }

    // Audio
    assets.audio.forEach(sound =>
        this.load.audio(sound, `${AUDIO_PATH}${sound}.mp3`)
    );

    // Spritesheets
    assets.spritesheets.forEach(({ key, path, frameWidth, frameHeight }) => {
        this.load.spritesheet(key, `${GRAPHICS_PATH}${path}`, {
            frameWidth,
            frameHeight
        });
    });
}
