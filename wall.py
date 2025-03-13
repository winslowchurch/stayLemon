import pygame
from settings import TILE_SIZE

class Wall:
    def __init__(self, x, y):
        self.image = pygame.image.load("images/pinkWall.png")
        self.rect = pygame.Rect(x, y, TILE_SIZE, TILE_SIZE)
    
    def draw(self, surface):
        surface.blit(self.image, self.rect)
