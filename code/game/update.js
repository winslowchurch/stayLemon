import { updatePlayerPosition, handlePlayerSwitchingMaps } from "./player.js";
import { calibrateUICamera } from "./camera.js";

export function update() {
    updatePlayerPosition(this);
    handlePlayerSwitchingMaps(this);
    this.healthBar.update(this);
    calibrateUICamera(this);
}
