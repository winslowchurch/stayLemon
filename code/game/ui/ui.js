import { Inventory } from "./inventory.js";
import { HealthBar } from "./healthBar.js";
import { TextBox } from "./textBox.js";

export function setupUI(scene) {
    scene.inventory = new Inventory(scene);
    // scene.healthBar = new HealthBar(scene);
    scene.textBox = new TextBox(
        scene,
        'Use the WASD keys to move around. Left click to attack, right click to use item.',
    );
}