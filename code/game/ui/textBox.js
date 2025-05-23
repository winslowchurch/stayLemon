import { GAME_SETTINGS } from "../settings.js";

export class TextBox {
    constructor(scene, inputText = '', onCloseCallback = null) {
        this.scene = scene;
        this.onCloseCallback = onCloseCallback;

        const screenWidth = scene.scale.width;
        const screenHeight = scene.scale.height;

        const boxWidth = 450;
        const boxHeight = 250;

        this.x = (screenWidth - boxWidth) / 2;
        this.y = (screenHeight - boxHeight) / 2;

        // Background box
        this.background = scene.add.image(this.x, this.y, 'textBox')
            .setOrigin(0, 0)
            .setDisplaySize(boxWidth, boxHeight)
            .setScrollFactor(0)
            .setDepth(GAME_SETTINGS.uiDepth);

        scene.cameras.main.ignore(this.background);

        // Add the input text
        const textPadding = 25; // Padding inside the text box
        const textWidth = boxWidth - textPadding * 2;
        const textX = this.x + textPadding;
        const textY = this.y + textPadding;

        this.text = scene.add.bitmapText(textX, textY, 'pixelFont', '', 35)
            .setScrollFactor(0)
            .setDepth(GAME_SETTINGS.uiTextDepth);

        scene.cameras.main.ignore(this.text);

        this.typewriterText(inputText);

        // "X" button to close the text box
        this.closeButton = scene.add.image(this.x + boxWidth - 48, this.y + boxHeight - 50, 'closeButton')
            .setOrigin(0, 0)
            .setInteractive()
            .setScrollFactor(0)
            .setDepth(GAME_SETTINGS.uiTextDepth);

        scene.cameras.main.ignore(this.closeButton);

        // Add hover effect to make the button bigger and adjust its position
        this.closeButton.on('pointerover', () => {
            this.closeButton.setDisplaySize(32, 32);
            this.closeButton.setPosition(
                this.x + boxWidth - 48 - 2,
                this.y + boxHeight - 50 - 2
            );
            this.scene.input.setDefaultCursor('pointer');
        });

        this.closeButton.on('pointerout', () => {
            this.closeButton.setDisplaySize(28, 28);
            this.closeButton.setPosition(
                this.x + boxWidth - 48, // Reset to original position
                this.y + boxHeight - 50
            );
            this.scene.input.setDefaultCursor('default');
        });

        // When the "X" button is clicked, call the close function
        this.closeButton.on('pointerdown', () => {
            this.scene.input.setDefaultCursor('default');
            this.close();
        });
    }

    // Method to set and wrap text
    setText(inputText, maxWidth) {
        const words = inputText.split(' ');
        let line = '';
        let wrappedText = '';

        words.forEach(word => {
            const testLine = line + word + ' ';
            // Create a temporary bitmapText to measure the width
            const tempText = this.scene.add.bitmapText(0, 0, 'pixelFont', testLine, 35); // Match the font size
            const testWidth = tempText.getTextBounds().local.width;
            tempText.destroy(); // Destroy the temporary text object

            if (testWidth > maxWidth && line !== '') {
                wrappedText += line + '\n';
                line = word + ' ';
            } else {
                line = testLine;
            }
        });

        wrappedText += line; // Add the last line
        this.text.setText(wrappedText);
    }

    close() {
        // Destroy the text box and its components
        this.background.destroy();
        this.closeButton.destroy();
        this.text.destroy();

        // Clear the typewriter timer if it exists
        if (this.typewriterTimer) {
            this.typewriterTimer.remove(false); // Stop the timer without calling its callback
            this.typewriterTimer = null;
        }

        if (this.onCloseCallback) {
            this.scene.sound.play("pop", { volume: 0.5 });
            this.onCloseCallback();
        }
    }

    typewriterText(fullText, chunkDelay = 30) {
        const maxWidth = this.background.displayWidth - 50; // Padding
        const words = fullText.split(' ');

        let line = '';
        const wrappedLines = [];

        // Pre-wrap the full text
        words.forEach(word => {
            const testLine = line + word + ' ';
            const tempText = this.scene.add.bitmapText(0, 0, 'pixelFont', testLine, 35);
            const testWidth = tempText.getTextBounds().local.width;
            tempText.destroy();

            if (testWidth > maxWidth && line !== '') {
                wrappedLines.push(line.trim());
                line = word + ' ';
            } else {
                line = testLine;
            }
        });
        if (line !== '') wrappedLines.push(line.trim());

        const wrappedText = wrappedLines.join('\n');
        const characters = wrappedText.split('');

        let currentText = '';
        let index = 0;

        // Clear text before typing
        this.text.setText('');

        // Store the timer reference
        this.typewriterTimer = this.scene.time.addEvent({
            delay: chunkDelay, // milliseconds between chunks
            repeat: characters.length - 1,
            callback: () => {
                currentText += characters[index];
                this.text.setText(currentText);
                index++;

                // Optional: Play a blip sound if not a space or newline
                const char = characters[index - 1];
                if (char.trim() !== '') {
                    this.scene.sound.play('textBlip', { volume: 0.4 });
                }
            }
        });
    }
}

export function showFailureBox(scene) {
    scene.physics.pause();
    const failureText = "You died. Click 'X' to restart.";
    scene.textBox = new TextBox(scene, failureText, () => {
        scene.physics.resume();
        restartGame(scene);
    });
}

export function showSuccessBox(scene) {
    const successText = "You did it! Please enjoy your prize.";
    scene.textBox = new TextBox(scene, successText, () => {
        scene.inventory.addItem('trophy');
    });
}

export function restartGame(scene) {
    scene.player.health = scene.player.maxHealth;

    // Reset inventory
    scene.inventory.clearInventory();
    scene.inventory.addItem('rustyHatchet');

    // Reset the map
    scene.mapManager.resetMap();
}