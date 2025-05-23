import { PLAYER_SETTINGS, GAME_SETTINGS } from "../settings.js";

export class HealthBar {
    constructor(scene) {
        this.scene = scene;
        this.health = scene.player.health;
        this.maxHealth = PLAYER_SETTINGS.maxHealth;

        // Position the bar in the top-left corner of the screen
        this.x = 20;
        this.y = 20;

        // Add the bar background
        this.background = scene.add.image(this.x, this.y, 'healthBar')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(GAME_SETTINGS.uiDepth);

        // Add the health bar (foreground)
        this.barWidth = 220;
        this.barHeight = 29;
        this.barOffsetX = 18;
        this.healthBar = scene.add.rectangle(
            this.x + this.barOffsetX,
            this.y + (this.background.height / 2) - (this.barHeight / 2),
            this.barWidth,
            this.barHeight,
            0xff0000 // Red color for the health bar
        )
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(GAME_SETTINGS.uiDepth); // Ensure it's above the background
    }

    // Method to update the health bar
    update(scene) {
        this.health = scene.player.health;
        this.maxHealth = PLAYER_SETTINGS.maxHealth;

        // Scale the health bar width based on the player's health
        const healthPercentage = Phaser.Math.Clamp(this.health / this.maxHealth, 0, 1); // Clamp between 0 and 1
        this.healthBar.width = this.barWidth * healthPercentage;

        if (healthPercentage > 0.5) {
            this.healthBar.setFillStyle(0x00ff00); // Green for healthy
        } else if (healthPercentage > 0.2) {
            this.healthBar.setFillStyle(0xffff00); // Yellow for caution
        } else {
            this.healthBar.setFillStyle(0xff0000); // Red for danger
        }
    }
}