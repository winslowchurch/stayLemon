import { ITEM_DATA } from "../data/itemData.js";
const tileSize = 16;

export function handleTileHit(scene, tile, soundKey, itemDropped) {
    const inventory = scene.inventory;
    const selectedItemKey = inventory.items[inventory.selectedIndex]?.key ?? 'fist';
    const itemData = ITEM_DATA[selectedItemKey];
    const damage = itemData?.damage;

    tile.health -= damage;
    // Flash effect if the tile is still alive
    if (tile.health > 0 && tile.image) {
        tile.image.setVisible(false);
        scene.time.delayedCall(100, () => {
            if (tile.image?.active) {
                tile.image.setVisible(true);
            }
        });
    }

    if (soundKey) scene.sound.play(soundKey, { volume: 0.2 });

    if (tile.health <= 0) {
        tile.collider.destroy();
        tile.image.destroy();
        scene.inventory.addItem(itemDropped);
    }
}

// === Tile Definitions ===
// Colliding areas will be rendered at the very bottom of the image and to
// the left unless specified otherwise with offsets
export const TILE_DEFINITIONS = {
    // -- Terrain --
    0: { name: 'desert1', collides: false },
    1: { name: 'desert2', collides: false },
    2: { name: 'desert3', collides: false },
    3: { name: 'grass1', collides: false },
    4: { name: 'grass2', collides: false },

    // -- Static Objects --
    5: {
        name: 'skull',
        collides: true,
        colliderSize: { width: tileSize, height: tileSize },
    },
    6: {
        name: 'deadTree',
        collides: true,
        colliderSize: { width: tileSize, height: tileSize },
        colliderOffset: { x: tileSize }
    },
    7: {
        name: 'pineTree',
        collides: true,
        colliderSize: { width: tileSize, height: tileSize },
        colliderOffset: { x: tileSize }
    },

    // -- Plants --
    8: {
        name: 'cactus1',
        collides: true,
        colliderSize: { width: tileSize, height: tileSize },
        health: 30,
        onHit: (scene, tile) => handleTileHit(scene, tile, 'hatchetSwing', 'cactusChunk')
    },
    9: {
        name: 'cactus2',
        collides: true,
        colliderSize: { width: tileSize, height: tileSize },
        health: 30,
        onHit: (scene, tile) => handleTileHit(scene, tile, 'hatchetSwing', 'cactusChunk')
    },
    10: {
        name: 'rock',
        collides: true,
        colliderSize: { width: tileSize, height: tileSize },
    },

    // -- Walls / Structures --
    11: { name: 'wall1', collides: true, colliderSize: { width: tileSize, height: tileSize } },
    12: { name: 'wall2', collides: true, colliderSize: { width: tileSize, height: tileSize * 3 } },
    13: { name: 'wall3', collides: true, colliderSize: { width: tileSize, height: tileSize * 3 } },
    14: { name: 'wall4', collides: true, colliderSize: { width: tileSize, height: tileSize * 3 } },
    15: { name: 'wall5', collides: true, colliderSize: { width: tileSize, height: tileSize } },
    16: { name: 'wall6', collides: true, colliderSize: { width: tileSize, height: tileSize * 3 } },
    17: { name: 'wall7', collides: true, colliderSize: { width: tileSize, height: tileSize * 3 } },
    18: { name: 'wall8', collides: true, colliderSize: { width: tileSize, height: tileSize } },
    19: { name: 'wall9', collides: true, colliderSize: { width: tileSize, height: tileSize } },

    // -- Buildings --
    20: {
        name: 'house1',
        collides: true,
        colliderSize: { width: tileSize * 7, height: tileSize * 3 },
    },
    21: {
        name: 'house2',
        collides: true,
        colliderSize: { width: tileSize * 9, height: tileSize * 4 },
    },

    22: { name: 'grassPath', collides: false },

    23: {
        name: 'bed',
        collides: true,
        colliderSize: { width: tileSize * 2, height: tileSize * 2 },
    },

    24: { name: 'woodWall', collides: true, colliderSize: { width: tileSize, height: tileSize * 3 } },
    25: { name: 'blueStripeWall', collides: true, colliderSize: { width: tileSize, height: tileSize * 3 } },
    26: { name: 'tileFloor', collides: false },
    27: { name: 'woodFloor', collides: false },

    28: { name: 'furnace', collides: true, colliderSize: { width: tileSize, height: tileSize }, light: 'flame' },
    29: { name: 'barCart', collides: true, colliderSize: { width: tileSize * 2, height: tileSize } },
    30: {
        name: 'flowerDisplay1',
        collides: true,
        colliderSize: { width: tileSize * 2, height: tileSize * 2 },
    },
    31: {
        name: 'flowerDisplay2',
        collides: true,
        colliderSize: { width: tileSize * 2, height: tileSize * 2 },
    },
    32: { name: 'rug', collides: false },
    33: { name: 'meshDivider', collides: true, colliderSize: { width: tileSize * 2, height: tileSize } },
    34: { name: 'sideTable', collides: true, colliderSize: { width: tileSize, height: tileSize }, light: 'bulb', lightOffset: { x: 0, y: -tileSize }, },
    35: { name: 'flowerPot', collides: true, colliderSize: { width: tileSize * 2 - 16, height: tileSize - 5 }, colliderOffset: { x: 8 } },
    36: { name: 'flowerDisplay3', collides: true, colliderSize: { width: tileSize * 3, height: tileSize } },
    37: { name: 'painting1', collides: false, wallDecoration: true },
    38: { name: 'painting2', collides: false, wallDecoration: true },
    39: { name: 'floorLamp', collides: true, colliderSize: { width: tileSize, height: tileSize }, light: 'bulb', lightOffset: { x: 0, y: -tileSize } },
    40: { name: 'window1', collides: false, wallDecoration: true, light: 'window' },
    41: { name: 'window2', collides: false, wallDecoration: true, light: 'window' },
    42: { name: 'window3', collides: false, wallDecoration: true, light: 'window' },
    43: { name: 'window4', collides: false, wallDecoration: true, light: 'window' },

    // // -- Triggers --
    // 99: {
    //     name: 'mapTrigger',
    //     collides: false,
    //     onEnter: (scene) => switchToHoneyspurMap(scene)
    // },
};
