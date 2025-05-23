import { GAME_SETTINGS } from "./settings.js";

export function setupWeather(scene) {
    const mapType = scene.mapManager.currentMapObject?.type || 'outside';

    if (mapType === 'outside') {
        setUpButterflies(scene);
        setupRain(scene);
        applyRainDarkness(scene);
    }
}

function applyRainDarkness(scene) {
    const { width, height } = scene.scale;

    // Create a black transparent overlay rectangle
    const overlay = scene.add.rectangle(0, 0, width, height, 0x000000, 0.25)
        .setOrigin(0)
        .setScrollFactor(0)
        .setDepth(GAME_SETTINGS.weatherDepth)
        .setName('rain-darkness');

    scene.rainOverlay = overlay;
}


function setUpButterflies(scene) {
    const butterflyTextures = ['butterflyWhite', 'butterflyPink'];
    const butterflyGroup = scene.add.group();


    // Create animations for the butterflies
    scene.anims.create({
        key: 'butterfly-white',
        frames: scene.anims.generateFrameNumbers('butterfly', { start: 0, end: 2 }),
        frameRate: 8,
        repeat: -1
    });

    scene.anims.create({
        key: 'butterfly-pink',
        frames: scene.anims.generateFrameNumbers('butterfly', { start: 3, end: 5 }),
        frameRate: 8,
        repeat: -1
    });

    for (let i = 0; i < 5; i++) {
        const x = Phaser.Math.Between(0, scene.physics.world.bounds.width);
        const y = Phaser.Math.Between(0, scene.physics.world.bounds.height);
        const texture = Phaser.Utils.Array.GetRandom(butterflyTextures);

        const butterfly = scene.add.sprite(x, y, texture, 0)
            .setScale(1)
            .setDepth(GAME_SETTINGS.weatherDepth);

        butterflyGroup.add(butterfly);

        // Play the appropriate animation
        if (texture === 'butterflyWhite') {
            butterfly.anims.play('butterfly-white');
        } else {
            butterfly.anims.play('butterfly-pink');
        }

        // Periodically update the butterfly's position
        scene.time.addEvent({
            delay: Phaser.Math.Between(1000, 3500), // Time between movements
            loop: true,
            callback: () => {
                const targetX = Phaser.Math.Between(
                    Math.max(0, butterfly.x - 50), // Stay within a small range
                    Math.min(scene.physics.world.bounds.width, butterfly.x + 50)
                );
                const targetY = Phaser.Math.Between(
                    Math.max(0, butterfly.y - 50),
                    Math.min(scene.physics.world.bounds.height, butterfly.y + 50)
                );

                scene.tweens.add({
                    targets: butterfly,
                    x: targetX,
                    y: targetY,
                    duration: Phaser.Math.Between(2000, 4000), // Movement speed
                    ease: 'Sine.easeInOut'
                });
            }
        });

        // Add a slight fluttering effect to the angle
        scene.tweens.add({
            targets: butterfly,
            angle: {
                value: Phaser.Math.Between(-10, 10),
                duration: 2000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            }
        });
    }

    scene.butterflyGroup = butterflyGroup;
}

function setupRain(scene) {
    scene.anims.create({
        key: 'rain-drop',
        frames: scene.anims.generateFrameNumbers('rainDrop', { start: 0, end: 2 }),
        frameRate: 8,
        repeat: -1
    });

    scene.anims.create({
        key: 'rain-floor',
        frames: scene.anims.generateFrameNumbers('rainFloor', { start: 0, end: 2 }),
        frameRate: 5,
        repeat: -1
    });

    const groundWidth = scene.physics.world.bounds.width;
    const groundHeight = scene.physics.world.bounds.height;

    // Groups to hold rain and splashes
    scene.rainGroup = scene.add.group();
    scene.rainFloorGroup = scene.add.group();

    // Spawn multiple raindrops per interval
    scene.time.addEvent({
        delay: 50,
        loop: true,
        callback: () => {
            for (let i = 0; i < 3; i++) {
                // Spawn rain drop from top, potentially beyond right edge
                const x = Phaser.Math.Between(0, groundWidth + 150);
                const y = Phaser.Math.Between(-50, -10);

                const drop = scene.add.sprite(x, y, 'rainDrop')
                    .setDepth(GAME_SETTINGS.weatherDepth)
                    .play('rain-drop');

                drop.direction = new Phaser.Math.Vector2(-2, 4);
                drop.speed = 100;
                drop.pos = new Phaser.Math.Vector2(x, y);

                scene.rainGroup.add(drop);

                // Splash roughly aligned with drop x-position
                const splashX = drop.pos.x + Phaser.Math.Between(-2, 2);
                const splashY = Phaser.Math.Between(0, groundHeight - 10);

                const splash = scene.add.sprite(splashX, splashY, 'rainFloor')
                    .setDepth(GAME_SETTINGS.weatherDepth)
                    .play('rain-floor');

                scene.rainFloorGroup.add(splash);

                scene.time.delayedCall(500, () => splash.destroy());
            }
        }
    });

    // Move raindrops each frame
    scene.events.on('update', (time, delta) => {
        const deltaSeconds = delta / 1000;

        scene.rainGroup.getChildren().forEach(drop => {
            if (!drop.active) return;

            drop.pos.add(drop.direction.clone().scale(drop.speed * deltaSeconds));
            drop.setPosition(drop.pos.x, drop.pos.y);

            if (drop.y > groundHeight + 20) {
                drop.destroy();
            }
        });
    });
}
