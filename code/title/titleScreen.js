export class TitleScreen extends Phaser.Scene {
    constructor() {
        super({ key: 'titleScreen' });
    }

    preload() {
        this.load.bitmapFont('pixelFont', '../../assets/fonts/round_6x6.png', '../../assets/fonts/round_6x6.xml');
    }

    create() {
        const COLORS = {
            darkRed: 0x4f000b,
            lightOrange: 0xff9b54,
            darkPurple: 0x7552f6,
            lightGrey: 0xd4d4fc,
            limeGreen: 0x54e454,
        };

        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Function to add layered text
        const addLayeredText = (x, y, text, fontSize, shadowColor, foregroundColor, offset = 10) => {
            this.add.bitmapText(x, y, 'pixelFont', text, fontSize)
                .setOrigin(0.5)
                .setTint(shadowColor);

            this.add.bitmapText(x + offset, y + offset, 'pixelFont', text, fontSize)
                .setOrigin(0.5)
                .setTint(foregroundColor);
        };

        // Add "Stay Lemon" with shadow and foreground layers
        addLayeredText(centerX, centerY - 150, 'Stay', 180, COLORS.darkRed, COLORS.lightOrange);
        addLayeredText(centerX, centerY, 'Lemon', 180, COLORS.darkRed, COLORS.lightOrange);

        // Add "START" button with shadow and foreground layers
        this.add.bitmapText(centerX, this.scale.height - 130, 'pixelFont', 'START', 120)
            .setOrigin(0.5)
            .setTint(COLORS.darkPurple);

        const startButtonForeground = this.add.bitmapText(centerX + 10, this.scale.height - 120, 'pixelFont', 'START', 120)
            .setOrigin(0.5)
            .setTint(COLORS.lightGrey)
            .setInteractive();

        // Add hover and click effects to the foreground layer
        startButtonForeground.on('pointerover', () => {
            startButtonForeground.setTint(COLORS.limeGreen);
            this.input.setDefaultCursor('pointer');
        });
        startButtonForeground.on('pointerout', () => {
            startButtonForeground.setTint(COLORS.lightGrey);
            this.input.setDefaultCursor('default');
        });
        startButtonForeground.on('pointerdown', () => {
            this.input.setDefaultCursor('default');
            this.scene.start('mainScene'); // Transition to the main game scene
        });

        // Bottom-right corner
        this.add.bitmapText(this.scale.width - 15, this.scale.height - 15, 'pixelFont', 'By: WinsloW', 30)
            .setOrigin(1) // Align to the bottom-right corner
            .setTint(COLORS.lightGrey);
    }
}