import pygame

class Lemon:
    def __init__(self):
        self.standing_image = pygame.image.load("images/walk1.png")
        self.walking_images = [pygame.image.load("images/walk1.png"), pygame.image.load("images/walk2.png")]
        self.image = self.standing_image
        self.rect = self.image.get_rect(midbottom=(200, 500))
        self.speed = 5
        self.walk_index = 0
        self.facing_right = False  

    def update(self): 
        keys = pygame.key.get_pressed()
        moving = False

        if keys[pygame.K_LEFT] or keys[pygame.K_a]:
            self.rect.x -= self.speed
            self.facing_right = False
            moving = True
        elif keys[pygame.K_RIGHT] or keys[pygame.K_d]:
            self.rect.x += self.speed
            self.facing_right = True
            moving = True

        if moving:
            self.animate_walk()
        else:
            self.image = self.standing_image  # Reset to standing frame when not moving

        # Flip sprite based on direction
        if self.facing_right:
            self.image = pygame.transform.flip(self.image, True, False)

    def animate_walk(self):
        self.walk_index += 0.1
        if self.walk_index >= len(self.walking_images):
            self.walk_index = 0
        self.image = self.walking_images[int(self.walk_index)]

    def draw(self, surface):
        surface.blit(self.image, self.rect)