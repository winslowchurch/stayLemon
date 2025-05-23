import { PLAYER_SETTINGS } from "./settings.js";
import { TILE_DEFINITIONS } from "./data/tileData.js";

export function setupPlayer(scene) {
    scene.player = scene.physics.add.sprite(128, 64, 'lemon', 0);
    scene.player.setCollideWorldBounds(true);
    scene.player.setSize(28, 10).setOffset(2, 21); // Collision box
    scene.player.directionFacing = 'left';

    scene.physics.add.collider(scene.player, scene.collidableTiles);

    scene.cursors = scene.input.keyboard.createCursorKeys();
    scene.wasd = scene.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D
    });

    // Create animations for walking in different directions
    scene.anims.create({
        key: 'walk-right',
        frames: scene.anims.generateFrameNumbers('lemon', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });

    scene.anims.create({
        key: 'walk-left',
        frames: scene.anims.generateFrameNumbers('lemon', { start: 4, end: 7 }),
        frameRate: 8,
        repeat: -1
    });

    scene.anims.create({
        key: 'idle-right',
        frames: [{ key: 'lemon', frame: 0 }],
        frameRate: 1
    });

    scene.anims.create({
        key: 'idle-left',
        frames: [{ key: 'lemon', frame: 4 }],
        frameRate: 1
    });
}

export function updatePlayerPosition(scene) {
    const player = scene.player;
    const cursors = scene.cursors;
    const wasd = scene.wasd;
    if (!player) return;

    const speed = PLAYER_SETTINGS.playerSpeed;

    let vx = 0;
    let vy = 0;

    if (cursors.left.isDown || wasd.left.isDown) {
        vx = -speed;
        player.directionFacing = 'left';
    } else if (cursors.right.isDown || wasd.right.isDown) {
        vx = speed;
        player.directionFacing = 'right';
    }

    if (cursors.up.isDown || wasd.up.isDown) {
        vy = -speed;
    } else if (cursors.down.isDown || wasd.down.isDown) {
        vy = speed;
    }

    player.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
        if (player.directionFacing === 'left') {
            player.anims.play('walk-left', true);
        } else {
            player.anims.play('walk-right', true);
        }
    } else {
        if (player.directionFacing === 'left') {
            player.anims.play('idle-left');
        } else {
            player.anims.play('idle-right');
        }
    }

    // Update player's depth based on its y position
    player.setDepth(player.y);
}

export function handlePlayerSwitchingMaps(scene) {
    if (!scene.player || !scene.mapManager.currentMap) return;

    const playerTileX = Math.floor(scene.player.x / 16);
    const playerTileY = Math.floor(scene.player.y / 16);

    const tileCodes = scene.mapManager.currentMap[playerTileY][playerTileX];
    if (!Array.isArray(tileCodes) || tileCodes.length < 2) return;

    const tileCode = tileCodes[1]; // Check the second number in the array
    const def = TILE_DEFINITIONS[tileCode];

    if (tileCode === 99 && def?.onEnter) {
        def.onEnter(scene);
    }
}

export function isPlayerWithinRange(player, clickedTile) {
    const dx = Math.abs(player.body.x - clickedTile.body.x);
    const dy = Math.abs(player.body.y - clickedTile.body.y);
    return dx <= 20 && dy <= 20;
}