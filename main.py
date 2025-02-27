import pygame, sys
from lemon import Lemon
from settings import SCREEN_HEIGHT, SCREEN_WIDTH

class Game:
    def __init__(self):
        # Setup
        pygame.init()
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        pygame.display.set_caption('Stay Lemon')
        self.clock = pygame.time.Clock()
        self.lemon = Lemon()
    
    def run(self):
        while True:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    pygame.quit()
                    sys.exit()

            self.screen.fill((255, 255, 255))  # Clear screen with white background
            self.lemon.update()
            self.lemon.draw(self.screen)
            
            pygame.display.update()
            self.clock.tick(60)

if __name__ == "__main__":
    game = Game()
    game.run()