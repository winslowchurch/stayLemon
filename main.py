import pygame, sys
from lemon import Lemon
from settings import SCREEN_HEIGHT, SCREEN_WIDTH, TILE_SIZE
from wall import Wall

class Game:
    def __init__(self):
        # Setup
        pygame.init()
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption('Stay Lemon')
        self.clock = pygame.time.Clock()
        self.lemon = Lemon()
        
        # Load textures
        self.background = pygame.image.load("images/woodFloor.png")
        
        # Create walls (now handled in Wall class)
        wall_positions = [(100, 100), (200, 100), (300, 100)]
        self.walls = Wall(wall_positions)
    
    def run(self):
        while True:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    sys.exit()

            # Draw tiled background
            for y in range(0, SCREEN_HEIGHT, TILE_SIZE):
                for x in range(0, SCREEN_WIDTH, TILE_SIZE):
                    self.screen.blit(self.background, (x, y))  # Tile the background
            
            # Draw walls
            self.walls.draw(self.screen)
            
            self.lemon.update(self.walls.walls)  # Pass walls for collision detection
            self.lemon.draw(self.screen)
            
            pygame.display.update()
            self.clock.tick(60)

if __name__ == "__main__":
    game = Game()
    game.run()
