import { ITEM_DATA } from "../data/itemData.js";
import { playSwingAnimation } from "../player.js";
import { GAME_SETTINGS } from "../settings.js";

export class Inventory {
    constructor(scene, slots = 8, slotSize = 75) {
        this.scene = scene;
        this.slots = slots;
        this.slotSize = slotSize;
        this.items = [];
        this.selectedIndex = 0; // Start by selecting the first item

        const screenWidth = GAME_SETTINGS.screenWidth;
        const screenHeight = GAME_SETTINGS.screenHeight;

        // Position the inventory at the bottom center of the screen
        const inventoryWidth = slots * slotSize;
        this.x = (screenWidth - inventoryWidth) / 2;
        this.y = screenHeight - slotSize - 30;

        // Add the inventory background
        this.background = scene.add.image(this.x, this.y, 'inventoryBar')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(GAME_SETTINGS.uiDepth);

        // Add the selection box
        this.selectionBox = scene.add.rectangle(
            this.x,
            this.y,
            slotSize,
            slotSize
        )
            .setStrokeStyle(5, 0xFFD700) // Gold border
            .setOrigin(0, 0)
            .setScrollFactor(0) // Make it camera-independent
            .setDepth(GAME_SETTINGS.uiTextDepth); // Ensure it overlays everything
    }

    addItem(itemKey) {
        const existingItem = this.items.find(i => i.key === itemKey);
        if (existingItem) {
            existingItem.count += 1;

            // Update count text
            if (!existingItem.countText) {
                const index = this.items.indexOf(existingItem);
                const itemX = this.x + index * this.slotSize + this.slotSize - 18;
                const itemY = this.y + this.slotSize - 18;

                existingItem.countText = this.scene.add.text(itemX, itemY, existingItem.count.toString(), {
                    font: '16px Arial',
                    fill: '#fff',
                    stroke: '#000',
                    strokeThickness: 3
                }).setScrollFactor(0).setDepth(10001);
            } else {
                existingItem.countText.setText(existingItem.count.toString());
            }

            return;
        }

        // If it's a new item
        const slotIndex = this.items.length;
        if (slotIndex >= this.slots) return; // Inventory full

        const itemX = this.x + slotIndex * this.slotSize + this.slotSize / 2;
        const itemY = this.y + this.slotSize / 2;

        const image = this.scene.add.image(itemX, itemY, itemKey)
            .setOrigin(0.5)
            .setDisplaySize(this.slotSize - 30, this.slotSize - 30)
            .setScrollFactor(0)
            .setDepth(GAME_SETTINGS.uiTextDepth);

        const newItem = {
            key: itemKey,
            count: 1,
            image: image,
            countText: null
        };

        this.items.push(newItem);

        if (this.items.length === 1) {
            this.updateSelectionBox();
        }
        this.scene.sound.play("pop", { volume: 0.5 });
    }


    updateSelectionBox() {
        // Update the position of the selection box to match the selected slot
        const selectedX = this.x + this.selectedIndex * this.slotSize + 2;
        this.selectionBox.setPosition(selectedX, this.y - 1);
    }

    selectItem(index) {
        if (index < 0 || index >= this.slots) return; // Invalid index
        this.selectedIndex = index;
        this.updateSelectionBox();
    }

    // Returns boolean on if user clicked the inventory area
    handleInventoryClick(pointer) {
        // Check if the click is within the inventory bounds
        if (
            pointer.x >= this.x &&
            pointer.x <= this.x + this.slots * this.slotSize &&
            pointer.y >= this.y &&
            pointer.y <= this.y + this.slotSize
        ) {
            // Calculate which slot was clicked
            const clickedSlot = Math.floor((pointer.x - this.x) / this.slotSize);
            this.selectItem(clickedSlot);
            this.scene.sound.play("pop", { volume: 0.5 });
            return true;
        }
        return false;
    }

    // Triggers from right click
    useSelectedItem(pointer) {
        if (pointer.rightButtonDown()) {
            const selectedItem = this.items[this.selectedIndex];
            if (!selectedItem) return false;

            const itemData = ITEM_DATA[selectedItem.key];
            if (!itemData) return false;

            if (itemData.type === 'food') {
                selectedItem.count -= 1;

                if (selectedItem.count <= 0) {
                    this.removeItemAtIndex(this.selectedIndex);
                } else {
                    if (selectedItem.countText) {
                        selectedItem.countText.setText(selectedItem.count.toString());
                    }
                }

                // Apply health effect
                this.scene.player.health = Math.min(this.scene.player.health + itemData.healAmount, this.scene.player.maxHealth);
                this.scene.sound.play("bite");
                return true;
            }
        }
        if (this.scene.player.isSwinging) return false;
        return this.useToolItem();
    }

    useToolItem() {
        const selectedItem = this.items[this.selectedIndex];
        const selectedKey = selectedItem?.key ?? 'fist';
        const itemData = ITEM_DATA[selectedKey];
        if (!itemData) return false;

        const player = this.scene.player;
        const toolRange = itemData.range || 32;

        playSwingAnimation(this.scene);
        // Trigger onHit for any nearby tile
        const nearbyTiles = this.scene.collidableTiles.getChildren().filter(tile => {
            const dist = Phaser.Math.Distance.Between(player.body.x, player.body.y, tile.body.x, tile.body.y);
            return dist <= toolRange && tile.tile && typeof tile.tile.onHit === 'function';
        });

        nearbyTiles.forEach(tile => {
            tile.tile.onHit(this.scene, tile.tile);
        });

        if (itemData.type === 'tool') this.scene.sound.play("swing", { volume: 0.7 });
        return true;
    }

    // Shifts all other items and updates selection
    removeItemAtIndex(index) {
        const item = this.items[index];
        if (!item) return;

        item.image.destroy();
        if (item.countText) item.countText.destroy();
        this.items.splice(index, 1);

        // Shift visuals for remaining items
        this.items.forEach((item, i) => {
            const itemX = this.x + i * this.slotSize + this.slotSize / 2;
            item.image.setX(itemX);
            if (item.countText) {
                item.countText.setX(this.x + i * this.slotSize + this.slotSize - 18);
            }
        });

        // Adjust selection index
        if (this.selectedIndex >= this.items.length) {
            this.selectedIndex = Math.max(0, this.items.length - 1);
        }

        this.updateSelectionBox();
    }

    handleNumberPress(number) {
        if (number >= 0 && number <= this.slots) {
            this.selectedIndex = number - 1;
            this.updateSelectionBox();
            this.scene.sound.play("pop", { volume: 0.5 });
        }
    }
    clearInventory() {
        // Destroy all item visuals and clear the items array
        this.items.forEach(item => {
            item.image.destroy(); // Destroy the item's image
            if (item.countText) item.countText.destroy(); // Destroy the item's count text
        });
        this.items = []; // Clear the items array
        this.selectedIndex = 0; // Reset the selected index
        this.updateSelectionBox(); // Update the selection box position
    }
}