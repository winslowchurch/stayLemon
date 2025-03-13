import pygame
from settings import WALKING_SPEED

class Lemon:
    def __init__(self):
        self.standing_image = pygame.image.load("images/walk1.png")
        self.walking_images = [pygame.image.load("images/walk1.png"), pygame.image.load("images/walk2.png")]
        self.image = self.standing_image
        self.rect = self.image.get_rect(midbottom=(200, 500))
        self.speed = WALKING_SPEED
        self.walk_index = 0
        self.facing_right = False  

    def update(self, walls): 
        keys = pygame.key.get_pressed()
        moving = False
        
        dx, dy = 0, 0
        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            dx = -self.speed
            self.facing_right = True
            moving = True
        elif keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            dx = self.speed
            self.facing_right = False
            moving = True
        if keys[pygame.K_UP] or keys[pygame.K_w]:
            dy = -self.speed
            moving = True
        elif keys[pygame.K_DOWN] or keys[pygame.K_s]:
            dy = self.speed
            moving = True
        
        # Handle collisions
        self.move(dx, dy, walls)
        
        if moving:
            self.animate_walk()
        else:
            self.image = self.standing_image  # Reset to standing frame when not moving
        
        # Flip sprite based on direction
        if not self.facing_right:
            self.image = pygame.transform.flip(self.image, True, False)

    def move(self, dx, dy, walls):
    # Move horizontally and check collisions
        self.rect.x += dx
        for wall in walls:
            if self.rect.colliderect(wall):  # No need for wall.rect
                if dx > 0:  # Moving right
                    self.rect.right = wall.left
                if dx < 0:  # Moving left
                    self.rect.left = wall.right

        # Move vertically and check collisions
        self.rect.y += dy
        for wall in walls:
            if self.rect.colliderect(wall):  # No need for wall.rect
                if dy > 0:  # Moving down
                    self.rect.bottom = wall.top
                if dy < 0:  # Moving up
                    self.rect.top = wall.bottom

    def animate_walk(self):
        self.walk_index += 0.1
        if self.walk_index >= len(self.walking_images):
            self.walk_index = 0
        self.image = self.walking_images[int(self.walk_index)]
    
    def draw(self, surface):
        surface.blit(self.image, self.rect)
