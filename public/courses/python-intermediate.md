# Python for Game Development

## Table of Contents

1. [Introduction to Game Development](#introduction)
2. [Pygame Basics](#pygame)
3. [Game Loop & Architecture](#architecture)
4. [Sprites & Graphics](#sprites)
5. [Collision Detection](#collision)
6. [Audio & Sound](#audio)
7. [Game States & Menus](#states)
8. [Building Complete Games](#complete)

## Introduction to Game Development

Game development with Python is accessible and fun. This course uses Pygame, a popular Python library for creating 2D games.

### Why Python for Games?

**Advantages:**
- Beginner-friendly syntax
- Rapid prototyping
- Active community
- Good documentation
- Perfect for learning concepts

**Limitations:**
- Not ideal for high-performance 3D
- Mobile support limited
- For serious projects, consider C++/UnityUnreal

### Setup & Installation

```bash
# Install Pygame
pip install pygame

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Verify installation
python -c "import pygame; print(pygame.__version__)"
```

## Pygame Basics

### Your First Window

```python
import pygame
import sys

# Initialize Pygame
pygame.init()

# Screen dimensions
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 600

# Create screen
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("My First Game")

# Game loop
clock = pygame.time.Clock()
running = True

while running:
    # Handle events
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
    
    # Clear screen
    screen.fill((255, 255, 255))  # White background
    
    # Update display
    pygame.display.flip()
    
    # Control frame rate (60 FPS)
    clock.tick(60)

pygame.quit()
sys.exit()
```

### Handling Input

```python
import pygame
from enum import Enum

class InputState:
    def __init__(self):
        self.keys_pressed = set()
        self.mouse_pos = (0, 0)
        self.mouse_clicked = False
    
    def update(self, event):
        if event.type == pygame.KEYDOWN:
            self.keys_pressed.add(event.key)
        elif event.type == pygame.KEYUP:
            self.keys_pressed.discard(event.key)
        elif event.type == pygame.MOUSEMOTION:
            self.mouse_pos = event.pos
        elif event.type == pygame.MOUSEBUTTONDOWN:
            self.mouse_clicked = True
        elif event.type == pygame.MOUSEBUTTONUP:
            self.mouse_clicked = False
    
    def is_key_pressed(self, key):
        return key in self.keys_pressed

# Usage in game loop
input_state = InputState()

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        input_state.update(event)
    
    # Check input
    if input_state.is_key_pressed(pygame.K_LEFT):
        player.move_left()
    if input_state.is_key_pressed(pygame.K_RIGHT):
        player.move_right()
```

## Game Loop & Architecture

### Game Loop Pattern

```python
class Game:
    def __init__(self, width=800, height=600):
        pygame.init()
        self.screen = pygame.display.set_mode((width, height))
        pygame.display.set_caption("Game")
        
        self.clock = pygame.time.Clock()
        self.running = True
        self.dt = 0  # Delta time
    
    def handle_events(self):
        """Process input"""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
    
    def update(self, dt):
        """Update game state"""
        pass
    
    def draw(self):
        """Render graphics"""
        self.screen.fill((0, 0, 0))
        pygame.display.flip()
    
    def run(self):
        """Main game loop"""
        while self.running:
            self.dt = self.clock.tick(60) / 1000.0  # Convert to seconds
            
            self.handle_events()
            self.update(self.dt)
            self.draw()
        
        pygame.quit()

# Run game
if __name__ == "__main__":
    game = Game()
    game.run()
```

## Sprites & Graphics

### Sprite Class

```python
import pygame
from dataclasses import dataclass
from typing import Tuple

@dataclass
class Vector2:
    x: float
    y: float
    
    def __add__(self, other):
        return Vector2(self.x + other.x, self.y + other.y)
    
    def __mul__(self, scalar):
        return Vector2(self.x * scalar, self.y * scalar)

class Player(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        
        # Create surface
        self.image = pygame.Surface((50, 50))
        self.image.fill((0, 255, 0))  # Green
        
        # Rect for positioning
        self.rect = self.image.get_rect(center=(x, y))
        
        # Position and velocity
        self.pos = Vector2(x, y)
        self.vel = Vector2(0, 0)
        self.speed = 300  # pixels per second
    
    def update(self, dt, input_state):
        # Handle input
        if input_state.is_key_pressed(pygame.K_LEFT):
            self.vel.x = -self.speed
        elif input_state.is_key_pressed(pygame.K_RIGHT):
            self.vel.x = self.speed
        else:
            self.vel.x = 0
        
        # Update position
        self.pos = self.pos + self.vel.__mul__(dt)
        
        # Update rect for drawing
        self.rect.center = (int(self.pos.x), int(self.pos.y))
    
    def draw(self, surface):
        surface.blit(self.image, self.rect)

# Load and draw image sprites
class Enemy(pygame.sprite.Sprite):
    def __init__(self, x, y, image_path):
        super().__init__()
        self.image = pygame.image.load(image_path)
        self.rect = self.image.get_rect(topleft=(x, y))
    
    def draw(self, surface):
        surface.blit(self.image, self.rect)
```

### Animation

```python
class AnimatedSprite(pygame.sprite.Sprite):
    def __init__(self, frames, x, y, frame_duration=100):
        super().__init__()
        
        self.frames = frames  # List of surface objects
        self.current_frame = 0
        self.frame_duration = frame_duration  # milliseconds
        self.frame_timer = 0
        
        self.image = self.frames[0]
        self.rect = self.image.get_rect(topleft=(x, y))
    
    def update(self, dt):
        self.frame_timer += dt * 1000  # Convert to milliseconds
        
        if self.frame_timer >= self.frame_duration:
            self.frame_timer = 0
            self.current_frame = (self.current_frame + 1) % len(self.frames)
            self.image = self.frames[self.current_frame]

# Load frames from spritesheet
def load_frames(spritesheet_path, frame_width, frame_height, num_frames):
    spritesheet = pygame.image.load(spritesheet_path)
    frames = []
    
    for i in range(num_frames):
        x = (i % (spritesheet.get_width() // frame_width)) * frame_width
        y = (i // (spritesheet.get_width() // frame_width)) * frame_height
        
        frame = spritesheet.subsurface((x, y, frame_width, frame_height))
        frames.append(frame)
    
    return frames

# Usage
frames = load_frames("player_walk.png", 32, 32, 8)
player = AnimatedSprite(frames, 100, 100)
```

## Collision Detection

### Rectangle Collision

```python
class RectCollisionDetector:
    @staticmethod
    def check_collision(sprite1, sprite2):
        """Check if two sprites overlap"""
        return sprite1.rect.colliderect(sprite2.rect)
    
    @staticmethod
    def get_overlapping(sprite, group):
        """Find all sprites in group that overlap with sprite"""
        return pygame.sprite.spritecollide(sprite, group, dokill=False)
    
    @staticmethod
    def resolve_collision(sprite1, sprite2):
        """Simple overlap resolution"""
        if sprite1.rect.colliderect(sprite2.rect):
            # Push sprite1 out of collision
            overlap_rect = sprite1.rect.clip(sprite2.rect)
            
            if sprite1.rect.left < sprite2.rect.left:
                sprite1.rect.right = sprite2.rect.left
            else:
                sprite1.rect.left = sprite2.rect.right
            
            return True
        return False

# Usage in game
class Game:
    def __init__(self):
        self.player_group = pygame.sprite.Group()
        self.enemy_group = pygame.sprite.Group()
        self.bullet_group = pygame.sprite.Group()
    
    def update(self, dt):
        # Check bullet-enemy collisions
        collisions = pygame.sprite.groupcollide(
            self.bullet_group,
            self.enemy_group,
            dokill=True,
            dokill2=True
        )
        
        # Check player-enemy collisions
        player_hit = pygame.sprite.spritecollideany(
            self.player,
            self.enemy_group
        )
        if player_hit:
            self.player.take_damage(10)
```

### Circle Collision

```python
import math

class CircleCollider:
    def __init__(self, x, y, radius):
        self.x = x
        self.y = y
        self.radius = radius
    
    def check_collision(self, other):
        """Check collision with another circle"""
        dx = self.x - other.x
        dy = self.y - other.y
        distance = math.sqrt(dx*dx + dy*dy)
        
        return distance < self.radius + other.radius
    
    def point_in_circle(self, px, py):
        """Check if point is inside circle"""
        dx = px - self.x
        dy = py - self.y
        return (dx*dx + dy*dy) < self.radius * self.radius

class CircleSprite(pygame.sprite.Sprite):
    def __init__(self, x, y, radius, color):
        super().__init__()
        self.collider = CircleCollider(x, y, radius)
        
        self.image = pygame.Surface((radius*2, radius*2), pygame.SRCALPHA)
        pygame.draw.circle(self.image, color, (radius, radius), radius)
        
        self.rect = self.image.get_rect(center=(x, y))
    
    def update(self):
        self.collider.x = self.rect.centerx
        self.collider.y = self.rect.centery
```

## Audio & Sound

### Playing Sounds

```python
import pygame

class AudioManager:
    def __init__(self):
        pygame.mixer.init()
        self.sounds = {}
        self.music = None
    
    def load_sound(self, name, filepath):
        """Load a sound effect"""
        try:
            sound = pygame.mixer.Sound(filepath)
            self.sounds[name] = sound
        except pygame.error as e:
            print(f"Could not load sound {name}: {e}")
    
    def play_sound(self, name, loops=0):
        """Play a sound effect"""
        if name in self.sounds:
            self.sounds[name].play(loops=loops)
    
    def load_music(self, filepath):
        """Load background music"""
        try:
            pygame.mixer.music.load(filepath)
        except pygame.error as e:
            print(f"Could not load music: {e}")
    
    def play_music(self, loops=-1):
        """Play background music (loops=-1 loops forever)"""
        pygame.mixer.music.play(loops=loops)
    
    def stop_music(self):
        pygame.mixer.music.stop()
    
    def set_volume(self, volume):
        """Set music volume (0.0 to 1.0)"""
        pygame.mixer.music.set_volume(volume)

# Usage
audio = AudioManager()
audio.load_sound("jump", "sounds/jump.wav")
audio.load_music("background.mp3")

audio.play_music()
audio.play_sound("jump")
```

## Game States & Menus

### State Management

```python
from enum import Enum, auto

class GameState(Enum):
    MENU = auto()
    PLAYING = auto()
    PAUSED = auto()
    GAME_OVER = auto()

class StateManager:
    def __init__(self):
        self.current_state = GameState.MENU
    
    def change_state(self, new_state):
        self.current_state = new_state

class Game:
    def __init__(self):
        self.state_manager = StateManager()
        self.menu = Menu()
        self.game = GameWorld()
        self.game_over_screen = GameOverScreen()
    
    def update(self, dt, input_state):
        if self.state_manager.current_state == GameState.MENU:
            self.menu.update(input_state)
            if self.menu.start_game():
                self.state_manager.change_state(GameState.PLAYING)
        
        elif self.state_manager.current_state == GameState.PLAYING:
            if input_state.is_key_pressed(pygame.K_ESCAPE):
                self.state_manager.change_state(GameState.PAUSED)
            
            self.game.update(dt, input_state)
            
            if self.game.is_game_over():
                self.state_manager.change_state(GameState.GAME_OVER)
        
        elif self.state_manager.current_state == GameState.PAUSED:
            if input_state.is_key_pressed(pygame.K_ESCAPE):
                self.state_manager.change_state(GameState.PLAYING)
        
        elif self.state_manager.current_state == GameState.GAME_OVER:
            self.game_over_screen.update(input_state)
            if self.game_over_screen.restart():
                self.game = GameWorld()
                self.state_manager.change_state(GameState.MENU)
    
    def draw(self, screen):
        screen.fill((0, 0, 0))
        
        if self.state_manager.current_state == GameState.MENU:
            self.menu.draw(screen)
        elif self.state_manager.current_state == GameState.PLAYING:
            self.game.draw(screen)
        elif self.state_manager.current_state == GameState.GAME_OVER:
            self.game_over_screen.draw(screen)
```

## Building Complete Games

### Simple Game Architecture

```python
import pygame
from enum import Enum, auto

class SimplePlatformer:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((800, 600))
        pygame.display.set_caption("Simple Platformer")
        
        self.clock = pygame.time.Clock()
        self.running = True
        
        # Game objects
        self.player = Player(100, 500)
        self.platforms = pygame.sprite.Group()
        self.enemies = pygame.sprite.Group()
        
        # Create level
        self.create_level()
    
    def create_level(self):
        """Create platforms and enemies"""
        # Create ground
        ground = Platform(0, 550, 800, 50)
        self.platforms.add(ground)
        
        # Create platforms
        platform1 = Platform(150, 400, 200, 20)
        self.platforms.add(platform1)
        
        # Create enemies
        enemy1 = Enemy(300, 450)
        self.enemies.add(enemy1)
    
    def update(self, dt):
        # Update player
        input_state = self.get_input()
        self.player.update(dt, input_state, self.platforms)
        
        # Update enemies
        for enemy in self.enemies:
            enemy.update(dt)
            
            # Check collision with player
            if self.player.rect.colliderect(enemy.rect):
                self.player.take_damage(10)
    
    def draw(self):
        self.screen.fill((135, 206, 235))  # Sky blue
        
        self.platforms.draw(self.screen)
        self.player.draw(self.screen)
        
        for enemy in self.enemies:
            enemy.draw(self.screen)
        
        pygame.display.flip()
    
    def get_input(self):
        input_state = InputState()
        keys = pygame.key.get_pressed()
        
        if keys[pygame.K_LEFT]:
            input_state.keys_pressed.add(pygame.K_LEFT)
        if keys[pygame.K_RIGHT]:
            input_state.keys_pressed.add(pygame.K_RIGHT)
        if keys[pygame.K_SPACE]:
            input_state.keys_pressed.add(pygame.K_SPACE)
        
        return input_state
    
    def run(self):
        while self.running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    self.running = False
            
            dt = self.clock.tick(60) / 1000.0
            self.update(dt)
            self.draw()
        
        pygame.quit()

# Run game
if __name__ == "__main__":
    game = SimplePlatformer()
    game.run()
```

## Conclusion

You now have the foundations for creating games with Python. Key takeaways:

- **Game loop**: The core pattern of all games
- **Sprite management**: Organize visual elements
- **Collision detection**: Trigger game events
- **State management**: Structure complex games
- **Audio & animation**: Enhance game feel

Start with simple projects like Pong or Breakout, then progress to more complex games. Join the Pygame community, study existing games, and keep creating!
