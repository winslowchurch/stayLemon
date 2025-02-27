import pygame

class Lemon:
    def __init__(self):
        self.standing_image = pygame.image.load("images/walk1.png")
        self.walking_images = [pygame.image.load("images/walk1.png"), pygame.image.load("images/walk2.png")]
        self.image = self.standing_image
        self.rect = self.image.get_rect(midbottom=(200, 300))
        self.speed = 5
        self.walk_index = 0
    
    def update(self):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_LEFT]:
            self.rect.x -= self.speed
            self.animate_walk()
        elif keys[pygame.K_RIGHT]:
            self.rect.x += self.speed
            self.animate_walk()
        else:
            self.image = self.standing_image  # Reset to standing frame when not moving

    def animate_walk(self):
        self.walk_index += 0.1
        if self.walk_index >= len(self.walking_images):
            self.walk_index = 0
        self.image = self.walking_images[int(self.walk_index)]
    
    def draw(self, surface):
        surface.blit(self.image, self.rect)
