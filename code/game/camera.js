import { GAME_SETTINGS } from "./settings.js";

export function setupCamera(scene, roomLayout) {
    scene.cameras.main.startFollow(scene.player);
    scene.cameras.main.setZoom(5);
    scene.cameras.main.setBounds(0, 0, roomLayout[0].length * 16, roomLayout.length * 16);
}

export function setupUICamera(scene) {
    const uiCamera = scene.cameras.add(0, 0, scene.scale.width, scene.scale.height);
    uiCamera.setName('uiCamera');
    uiCamera.ignore(scene.collidableTiles);
    uiCamera.ignore(scene.player);
    uiCamera.ignore(scene.children.list.filter(obj => obj.depth < GAME_SETTINGS.uiDepth));

    if (scene.rainGroup) {
        uiCamera.ignore(scene.rainGroup.getChildren());
    }
    if (scene.rainFloorGroup) {
        uiCamera.ignore(scene.rainFloorGroup.getChildren());
    }

    // Ensure the UI camera doesn't move or zoom
    uiCamera.setScroll(0, 0);
    uiCamera.setZoom(1);
}

export function calibrateUICamera(scene) {
    const uiCamera = scene.cameras.getCamera('uiCamera');
    uiCamera.ignore(scene.collidableTiles);
    uiCamera.ignore(scene.player);
    uiCamera.ignore(scene.children.list.filter(obj => obj.depth < GAME_SETTINGS.uiDepth));
}