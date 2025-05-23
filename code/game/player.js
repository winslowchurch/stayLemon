import { PLAYER_SETTINGS } from "./settings.js";
import { TILE_DEFINITIONS } from "./data/tileData.js";

export function setupPlayer(scene) {
    scene.player = scene.physics.add.sprite(64, 64, 'lemon', 0);
    scene.player.setCollideWorldBounds(true);
    scene.player.setSize(14, 8).setOffset(1, 24); // Collision box
    scene.player.directionFacing = 'down';
    scene.player.health = PLAYER_SETTINGS.maxHealth;
    scene.player.maxHealth = PLAYER_SETTINGS.maxHealth;

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
        key: 'walk-down',
        frames: scene.anims.generateFrameNumbers('lemon', { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
    });

    scene.anims.create({
        key: 'walk-up',
        frames: scene.anims.generateFrameNumbers('lemon', { start: 4, end: 7 }),
        frameRate: 8,
        repeat: -1
    });

    scene.anims.create({
        key: 'idle-down',
        frames: [{ key: 'lemon', frame: 0 }],
        frameRate: 1
    });

    scene.anims.create({
        key: 'idle-up',
        frames: [{ key: 'lemon', frame: 4 }],
        frameRate: 1
    });
}

export function updatePlayerPosition(scene) {
    const player = scene.player;
    const cursors = scene.cursors;
    const wasd = scene.wasd;
    if (!player || player.isSwinging || player.health <= 0) return;

    const speed = PLAYER_SETTINGS.playerSpeed;

    let vx = 0;
    let vy = 0;

    if (cursors.left.isDown || wasd.left.isDown) vx = -speed;
    else if (cursors.right.isDown || wasd.right.isDown) vx = speed;

    if (cursors.up.isDown || wasd.up.isDown) {
        vy = -speed;
        player.directionFacing = 'up';
    } else if (cursors.down.isDown || wasd.down.isDown) {
        vy = speed;
        player.directionFacing = 'down';
    }

    player.setVelocity(vx, vy);

    if (vx !== 0 || vy !== 0) {
        if (vy < 0) {
            player.anims.play('walk-up', true); // Walking up
        } else if (vy > 0) {
            player.anims.play('walk-down', true); // Walking down
        } else if (player.anims.currentAnim?.key === 'walk-up') {
            player.anims.play('walk-up', true); // Continue walking up
        } else {
            player.anims.play('walk-down', true); // Continue walking down
        }
    } else {
        if (player.directionFacing === 'up') {
            player.anims.play('idle-up');
        } else {
            player.anims.play('idle-down');
        }
    }

    // Update player's depth based on its y position
    player.setDepth(player.y);

    const isMoving = vx !== 0 || vy !== 0;

    if (isMoving) {
        if (!player.footstepSound.isPlaying) {
            player.footstepSound.play();
        }
    } else {
        if (player.footstepSound.isPlaying) {
            player.footstepSound.stop();
        }
    }
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