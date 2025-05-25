import { TILE_DEFINITIONS } from '../data/tileData.js';
import { GAME_SETTINGS } from '../settings.js';
import { setupCamera } from "../camera.js";
import { setupWeather } from "../weather.js";

export class MapManager {
    constructor(scene) {
        this.scene = scene;
        this.tileSize = 16;
        this.currentMap = null;
        this.tileImages = [];
        this.isDay = true;
    }

    loadMap(mapObj) {
        this.currentMapObject = mapObj;
        this.clearPreviousMap();
        this.buildLayers(mapObj);
        this.setWorldBounds(mapObj);
        this.currentMap = mapObj;
    }

    clearPreviousMap() {
        if (this.scene.collidableTiles) {
            this.scene.collidableTiles.clear(true, true);
        } else {
            this.scene.collidableTiles = this.scene.physics.add.staticGroup();
        }

        this.tileImages.forEach(img => img.destroy());
        this.tileImages = [];

        if (this.darknessLayer) {
            this.darknessLayer.destroy();
        }
    }

    buildLayers(mapObj) {
        const LAYER_ORDER = ['baseLayer', 'decorationLayer', 'objectLayer'];
        const rows = mapObj.baseLayer.length;
        const cols = mapObj.baseLayer[0].length;

        LAYER_ORDER.forEach(layerKey => {
            const layerData = mapObj[layerKey];

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const tileCode = layerData[row][col];
                    if (tileCode == null) continue;

                    const def = TILE_DEFINITIONS[tileCode];
                    if (!def) continue;

                    const x = col * this.tileSize;
                    const y = row * this.tileSize;

                    const texture = this.scene.textures.get(def.name);
                    const imageHeight = texture.source[0].height;
                    const defaultImageOffsetY = imageHeight - this.tileSize;

                    const addedYOffset = def.imageOffset?.y ?? 0;
                    const imageOffsetY = defaultImageOffsetY + addedYOffset;

                    const depth = layerKey === 'objectLayer'
                        ? (def.wallDecoration ? y + 32 : y)
                        : 0;

                    const textureKey = def.name;

                    const tileImage = this.scene.add.image(x, y - imageOffsetY, textureKey)
                        .setOrigin(0)
                        .setDepth(depth);
                    this.tileImages.push(tileImage);

                    if (def.collides && layerKey === 'objectLayer') {
                        this.createCollider(x, y, def, tileImage);
                    }
                }
            }
        });
    }

    setWorldBounds(mapObj) {
        const width = mapObj.baseLayer[0].length * this.tileSize;
        const height = mapObj.baseLayer.length * this.tileSize;

        this.scene.physics.world.setBounds(0, 0, width, height);
        this.scene.cameras.main.setBounds(0, 0, width, height);
    }

    renderLighting(mapObj) {
        const rows = mapObj.baseLayer.length;
        const cols = mapObj.baseLayer[0].length;
        const mapWidth = cols * this.tileSize;
        const mapHeight = rows * this.tileSize;

        if (!this.darknessLayer) {
            this.darknessLayer = this.scene.add.renderTexture(0, 0, mapWidth, mapHeight)
                .setDepth(GAME_SETTINGS.lightingDepth)
                .setScrollFactor(1)
                .setOrigin(0);
        } else {
            this.darknessLayer.clear();
        }

        // Slightly purplish darkness tint
        this.darknessLayer.fill(0x040112, 0.8);

        if (!this.lightGfx) {
            this.lightGfx = this.scene.make.graphics({ x: 0, y: 0, add: false });
        }

        const flickerBaseRadius = 48;
        const flickerRange = 0.5;
        const flickerSpeed = 0.00005;

        const time = this.scene.time.now;

        this.lightGfx.clear();
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const tileCode = mapObj.objectLayer[row][col];
                const def = TILE_DEFINITIONS[tileCode];
                if (!def) continue;

                const isNaturalDayLight = def.light === 'window' && this.isDay;
                const hasOwnLight = def.light && def.light !== 'window';

                if (!isNaturalDayLight && !hasOwnLight) continue;

                const baseX = col * this.tileSize + this.tileSize / 2;
                const baseY = row * this.tileSize + this.tileSize / 2;
                const offset = def.lightOffset ?? { x: 0, y: 0 };

                const flicker = flickerRange * Math.sin(time * flickerSpeed * (row + col + 1) * 10);
                const radius = flickerBaseRadius + flicker;

                // Determine light color
                let color = 0xffffff; // assume bulb
                if (def.light === 'window') {
                    color = 0xfff2b3; // soft yellow
                } else if (def.light === 'flame') {
                    color = 0xffa64d; // warm orange
                }

                this.drawLightGradient(baseX + offset.x, baseY + offset.y, radius, color);

                this.darknessLayer.erase(this.lightGfx);
                this.lightGfx.clear();
            }
        }
    }

    drawLightGradient(x, y, radius, color) {
        const steps = 32;
        for (let i = steps; i > 0; i--) {
            const alpha = (1 / steps) * i * 0.1;
            const r = (radius / steps) * i;

            this.lightGfx.fillStyle(color, alpha);
            this.lightGfx.fillCircle(x, y, r);
        }
    }

    createCollider(x, y, def, tileImage) {
        const colliderWidth = def.colliderSize?.width ?? this.tileSize;
        const colliderHeight = def.colliderSize?.height ?? this.tileSize;

        let baseColliderOffsetX = this.tileSize;
        const additionalColliderOffsetX = def.colliderOffset?.x ?? 0;

        let baseColliderOffsetY = this.tileSize;
        if (colliderHeight > this.tileSize) {
            baseColliderOffsetY -= (colliderHeight - this.tileSize);
        }
        const additionalColliderOffsetY = def.colliderOffset?.y ?? 0;

        const collider = this.scene.collidableTiles.create(
            x + baseColliderOffsetX + additionalColliderOffsetX,
            y + baseColliderOffsetY + additionalColliderOffsetY,
            null
        )
            .setOrigin(0.5)
            .setSize(colliderWidth, colliderHeight)
            .setOffset(0, 0);
        collider.setVisible(false);

        // Attach tile data to the collider
        collider.tile = { ...def, image: tileImage, collider, health: def.health || 0 };
    }
}

export function switchMap(scene, mapObj) {
    scene.mapManager.loadMap(mapObj);
    scene.player.setPosition(5 * 16, 5 * 16); // Adjust later
    setupCamera(scene, mapObj);
    setupWeather(scene);
}
