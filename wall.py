import pygame
from settings import TILE_SIZE

class Wall:
    def __init__(self, positions):
        self.walls = []
        for x, y in positions:
            wall_rect = pygame.Rect(x, y, TILE_SIZE, TILE_SIZE)
            self.walls.append(wall_rect)

        self.image = pygame.image.load("images/pinkWall.png")

    def draw(self, surface):
        for wall in self.walls:
            surface.blit(self.image, wall)
