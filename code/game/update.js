import { updatePlayerPosition, handlePlayerSwitchingMaps } from "./player.js";
import { calibrateUICamera } from "./camera.js";

export function update(time, delta) {
    updatePlayerPosition(this);
    handlePlayerSwitchingMaps(this);
    calibrateUICamera(this);

    if (this.mapManager && this.mapManager.currentMapObject) {
        this.mapManager.renderLighting(this.mapManager.currentMapObject);
    }
}
