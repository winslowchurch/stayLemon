import { TILE_DEFINITIONS } from '../data/tileData.js';
import { calibrateUICamera } from "../camera.js";

export class MapManager {
    constructor(scene) {
        this.scene = scene;
        this.tileSize = 16;
        this.currentMap = null;
        this.tileImages = [];
    }

    loadMap(mapObj) {
        this.currentMapObject = mapObj;

        const LAYER_ORDER = ['baseLayer', 'decorationLayer', 'objectLayer'];

        // Clear previous
        if (this.scene.collidableTiles) {
            this.scene.collidableTiles.clear(true, true);
        } else {
            this.scene.collidableTiles = this.scene.physics.add.staticGroup();
        }

        this.tileImages.forEach(img => img.destroy());
        this.tileImages = [];

        // Assume all layers are same dimensions
        const rows = mapObj.baseLayer.length;
        const cols = mapObj.baseLayer[0].length;

        LAYER_ORDER.forEach((layerKey, layerIndex) => {
            const layerData = mapObj[layerKey];
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const tileCode = layerData[row][col];
                    if (tileCode === null || tileCode === undefined) continue;

                    const def = TILE_DEFINITIONS[tileCode];
                    if (!def) continue;

                    const x = col * this.tileSize;
                    const y = row * this.tileSize;
                    const texture = this.scene.textures.get(def.name);
                    const imageHeight = texture.source[0].height;
                    const imageOffsetY = imageHeight - this.tileSize;

                    let depth = 0;
                    if (layerKey === 'objectLayer') {
                        depth = def.wallDecoration ? y + 32 : y;
                    }
                    const tileImage = this.scene.add.image(x, y - imageOffsetY, def.name)
                        .setOrigin(0)
                        .setDepth(depth);

                    this.tileImages.push(tileImage);

                    if (def.collides && layerKey === 'objectLayer') {
                        this.createCollider(x, y, def, tileImage);
                    }
                }
            }
        });

        const mapWidth = cols * this.tileSize;
        const mapHeight = rows * this.tileSize;
        this.scene.physics.world.setBounds(0, 0, mapWidth, mapHeight);
        this.scene.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
        this.currentMap = mapObj;
    }


    resetMap() {
        if (this.currentMapObject) {
            this.loadMap(this.currentMapObject);
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