import { TILE_DEFINITIONS } from '../data/tileData.js';
import { setupCamera, calibrateUICamera } from "../camera.js";

export class MapManager {
    constructor(scene) {
        this.scene = scene;
        this.tileSize = 16;
        this.currentMap = null;
        this.tileImages = [];
    }

    loadMap(mapObj) {
        this.currentMapObject = mapObj;
        const mapData = mapObj.data;
        // Clear existing tiles and colliders
        if (this.scene.collidableTiles) {
            this.scene.collidableTiles.clear(true, true);
        } else {
            this.scene.collidableTiles = this.scene.physics.add.staticGroup();
        }

        // Destroy previous tile images
        this.tileImages.forEach(img => img.destroy());
        this.tileImages = [];

        for (let row = 0; row < mapData.length; row++) {
            for (let col = 0; col < mapData[row].length; col++) {
                const tileCodes = mapData[row][col];
                const x = col * this.tileSize;
                const y = row * this.tileSize;

                if (!Array.isArray(tileCodes)) continue;

                tileCodes.forEach((tileCode, layerIndex) => {
                    const def = TILE_DEFINITIONS[tileCode];
                    if (!def) return;

                    const texture = this.scene.textures.get(def.name);
                    const imageHeight = texture.source[0].height;
                    const imageOffsetY = imageHeight - this.tileSize;

                    const tileImage = this.scene.add.image(x, y - imageOffsetY, def.name)
                        .setOrigin(0)
                        .setDepth(layerIndex === 0 && !def.foreground ? 0 : y);

                    this.tileImages.push(tileImage);

                    if (def.collides) {
                        this.createCollider(x, y, def, tileImage);
                    }
                });
            }
        }
        this.currentMap = mapData;
        const mapWidth = mapData[0].length * 16;
        const mapHeight = mapData.length * 16;
        this.scene.physics.world.setBounds(0, 0, mapWidth, mapHeight);
        this.scene.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    }

    resetMap() {
        if (this.currentMap) {
            this.loadMap(this.currentMap);
            calibrateUICamera(this.scene);
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

// export function switchToHoneyspurMap(scene) {
//     scene.mapManager.loadMap(honeyspurMap);
//     scene.player.setPosition(64, 64); // Adjust later
//     setupCamera(scene, honeyspurMap);
//     calibrateUICamera(scene);
// }