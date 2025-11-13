# Introduction to Game Development
**Complete Course Guide | 12 Hours | Beginner Level**

---

## Table of Contents
1. [Chapter 1: Game Development Fundamentals](#chapter-1)
2. [Chapter 2: Understanding Game Loops](#chapter-2)
3. [Chapter 3: Physics & Movement](#chapter-3)
4. [Chapter 4: Input Handling & User Interaction](#chapter-4)
5. [Chapter 5: Graphics & Rendering](#chapter-5)
6. [Chapter 6: Audio in Games](#chapter-6)
7. [Chapter 7: Asset Management](#chapter-7)
8. [Chapter 8: Debugging & Optimization](#chapter-8)
9. [Chapter 9: Your First Game Project](#chapter-9)
10. [Chapter 10: Publishing Your Game](#chapter-10)

---

## Chapter 1: Game Development Fundamentals {#chapter-1}

### What is Game Development?
Game development is the art and science of creating interactive entertainment. It combines:
- **Programming**: Logic and game mechanics
- **Art**: Graphics, animation, UI design
- **Audio**: Music and sound effects
- **Game Design**: Rules, story, and player experience

### Why Learn Game Development?
- High demand in industry
- Creative expression through code
- Growing indie game market
- Skills transfer to other software development
- Potential for passive income through game sales

### Game Development Roles
- **Game Programmer**: Write game logic and mechanics
- **Graphics Programmer**: Optimize rendering and visual effects
- **Game Designer**: Design gameplay and player experience
- **Artist/Animator**: Create visual assets
- **Sound Designer**: Create audio assets
- **Producer**: Manage project timeline and team

### Popular Game Engines
1. **Unity**: Most popular, C#, great 2D/3D support
2. **Unreal Engine**: High-end graphics, C++
3. **Godot**: Open source, Python-like scripting
4. **GameMaker**: 2D specialist, beginner-friendly
5. **Custom Engines**: Full control, steep learning curve

---

## Chapter 2: Understanding Game Loops {#chapter-2}

### The Heart of Every Game
The game loop is the core mechanism that keeps a game running. It executes repeatedly, typically 60 times per second.

### Basic Game Loop Structure
```
Initialize Game
  ↓
While Game Running:
  1. Handle Input
  2. Update Game State
  3. Render Graphics
  4. Control Frame Rate
```

### Detailed Game Loop Components

#### 1. Input Handling
Capture what the player is doing:
```
- Keyboard presses (W, A, S, D for movement)
- Mouse movement and clicks
- Controller buttons and analog sticks
- Touch input on mobile
```

#### 2. Update Game State
Process the game logic:
```
- Update player position
- Check collisions
- Update enemy AI
- Manage timers and counters
- Handle game rules and logic
```

#### 3. Rendering
Display the game world:
```
- Clear the screen
- Draw all game objects
- Update HUD/UI
- Apply camera effects
- Swap frame buffers
```

#### 4. Frame Rate Control
Maintain consistent speed:
```
- Cap framerate (usually 60 FPS)
- Calculate delta time (time since last frame)
- Use delta time to scale movement
```

### Example: Simple Game Loop (Pseudocode)
```
function gameLoop() {
    clock = new Clock()
    
    while (isRunning) {
        // Cap at 60 FPS (16.67 ms per frame)
        deltaTime = min(clock.getDeltaTime(), 0.016)
        
        // Input
        handleInput(deltaTime)
        
        // Update
        updateGameState(deltaTime)
        checkCollisions()
        
        // Render
        clearScreen()
        renderAll()
        updateDisplay()
        
        // Wait for next frame
        clock.tick(60)
    }
}
```

### Why Delta Time Matters
Movement should be independent of frame rate. Always multiply by delta time:

```
// Wrong (frame rate dependent):
position += velocity

// Correct (frame rate independent):
position += velocity * deltaTime
```

---

## Chapter 3: Physics & Movement {#chapter-3}

### Introduction to Game Physics
Physics make games feel realistic and satisfying. You don't need a PhD—just basic concepts.

### Key Physics Concepts

#### 1. Position
Where an object is in the game world.
```
position = (x, y)  // 2D
position = (x, y, z)  // 3D
```

#### 2. Velocity
Speed and direction of movement.
```
velocity = (vx, vy)  // Speed in each direction
// Example: velocity = (100, 0) means moving right at 100 units/sec
```

#### 3. Acceleration
Change in velocity over time.
```
acceleration = (ax, ay)
velocity += acceleration * deltaTime
position += velocity * deltaTime
```

#### 4. Gravity
Constant downward acceleration.
```
gravity = 9.8 m/s²  // Real world
gravity = 500 pixels/s²  // Typical 2D game
```

### Simple Physics Implementation
```python
class GameObject:
    def __init__(self, x, y):
        self.position = [x, y]
        self.velocity = [0, 0]
        self.acceleration = [0, 0]
    
    def applyForce(self, force):
        # F = ma, so a = F/m
        self.acceleration[0] += force[0] / self.mass
        self.acceleration[1] += force[1] / self.mass
    
    def update(self, deltaTime):
        # v = v + a*t
        self.velocity[0] += self.acceleration[0] * deltaTime
        self.velocity[1] += self.acceleration[1] * deltaTime
        
        # p = p + v*t
        self.position[0] += self.velocity[0] * deltaTime
        self.position[1] += self.velocity[1] * deltaTime
        
        # Reset acceleration each frame
        self.acceleration = [0, 0]
```

### Collision Detection

#### Circle Collision
```python
def circlesColliding(circle1, circle2):
    dx = circle2.x - circle1.x
    dy = circle2.y - circle1.y
    distance = sqrt(dx*dx + dy*dy)
    return distance < (circle1.radius + circle2.radius)
```

#### Rectangle Collision (AABB - Axis-Aligned Bounding Box)
```python
def rectanglesColliding(rect1, rect2):
    return (rect1.x < rect2.x + rect2.width and
            rect1.x + rect1.width > rect2.x and
            rect1.y < rect2.y + rect2.height and
            rect1.y + rect1.height > rect2.y)
```

### Common Physics Patterns

#### Jumping
```python
def jump():
    if onGround:
        velocity.y = jumpForce  # Upward velocity
        onGround = False

def updateVertical():
    if not onGround:
        velocity.y += gravity * deltaTime  # Accelerate downward
        position.y += velocity.y * deltaTime
        
        # Check if landed
        if position.y >= groundLevel:
            position.y = groundLevel
            velocity.y = 0
            onGround = True
```

#### Acceleration and Deceleration
```python
# Gradual speed increase
if accelerating:
    velocity += acceleration * deltaTime
    velocity = min(velocity, maxSpeed)

# Friction/deceleration
deceleration = 200  # units/s²
velocity -= deceleration * deltaTime
velocity = max(velocity, 0)
```

---

## Chapter 4: Input Handling & User Interaction {#chapter-4}

### Types of Input

#### Discrete Input
Button presses with clear on/off states.
```
- Keyboard keys (Jump, Attack)
- Mouse clicks
- Controller buttons
```

#### Continuous Input
Values that vary over time.
```
- Mouse position (x, y)
- Analog stick position (-1.0 to 1.0)
- Touch pressure (how hard pressing)
```

#### Events
Special actions.
```
- Key pressed
- Key released
- Mouse moved
- Controller connected/disconnected
```

### Input Handling Best Practices

#### 1. Separate Input from Logic
```python
# Bad: Input mixed with logic
if key_is_pressed('W'):
    player.position.y -= 5

# Good: Separate concerns
input_state = get_input()
player.update(input_state)
```

#### 2. Input Mapping
Allow customization:
```python
input_map = {
    'move_up': ['W', 'UP_ARROW', 'GAMEPAD_Y'],
    'jump': ['SPACE', 'GAMEPAD_A'],
    'attack': ['MOUSE_LEFT', 'GAMEPAD_X']
}

def isActionPressed(action):
    for key in input_map[action]:
        if key_pressed(key):
            return True
    return False
```

#### 3. Input Buffering
Store recent inputs to handle lag:
```python
input_buffer = []

def handleInput():
    if is_pressed('jump'):
        input_buffer.append('jump')
    
    # Execute buffered inputs
    if input_buffer and can_jump():
        input_buffer.pop(0)
        perform_jump()
```

### Implementing Player Control
```python
class Player:
    def handleInput(self, input_state):
        # Horizontal movement
        if input_state['move_left']:
            self.velocity.x = -self.speed
        elif input_state['move_right']:
            self.velocity.x = self.speed
        else:
            self.velocity.x = 0
        
        # Jumping
        if input_state['jump'] and self.on_ground:
            self.velocity.y = self.jump_force
            self.on_ground = False
        
        # Attack
        if input_state['attack']:
            self.attack()
```

---

## Chapter 5: Graphics & Rendering {#chapter-5}

### Display Concepts

#### Resolution
The number of pixels on screen.
```
Common resolutions:
- 1920 x 1080 (1080p)
- 1280 x 720 (720p)
- 3840 x 2160 (4K)
- Mobile varies widely
```

#### Frame Rate
Frames per second (FPS).
```
60 FPS - Smooth, standard for games
30 FPS - Acceptable, uses less power
120+ FPS - Competitive gaming, feels very smooth
```

#### Aspect Ratio
Width:Height ratio.
```
16:9 - Most common (1920:1080)
4:3 - Older standard (1024:768)
21:9 - Ultrawide
```

### Drawing Basics

#### Coordinate System
Origin (0,0) is typically top-left:
```
(0,0) -----> x
  |
  |
  v
  y
```

#### Basic Shapes
```python
drawRectangle(x, y, width, height, color)
drawCircle(x, y, radius, color)
drawLine(x1, y1, x2, y2, color)
drawTriangle(x1, y1, x2, y2, x3, y3, color)
```

#### Colors
RGB format (Red, Green, Blue):
```python
white = (255, 255, 255)
black = (0, 0, 0)
red = (255, 0, 0)
green = (0, 255, 0)
blue = (0, 0, 255)
```

### Sprites
Sprites are 2D images representing game objects.

```python
class Sprite:
    def __init__(self, image_file, x, y):
        self.image = loadImage(image_file)
        self.x = x
        self.y = y
        self.width = self.image.width
        self.height = self.image.height
    
    def draw(self):
        drawImage(self.image, self.x, self.y)
    
    def isClickedOn(self, mouse_x, mouse_y):
        return (self.x <= mouse_x <= self.x + self.width and
                self.y <= mouse_y <= self.y + self.height)
```

### Layering & Depth
Draw in correct order (back to front):
```python
def render():
    drawBackground()      # Layer 0
    drawTerrain()        # Layer 1
    drawEnemies()        # Layer 2
    drawPlayer()         # Layer 3
    drawProjectiles()    # Layer 4
    drawUI()             # Layer 5 (always on top)
```

### Camera & Viewport
Follow the player around the game world:
```python
class Camera:
    def __init__(self, game_width, game_height):
        self.x = 0
        self.y = 0
        self.width = 1920
        self.height = 1080
    
    def follow(self, target):
        # Keep target centered
        self.x = target.x - self.width / 2
        self.y = target.y - self.height / 2
        
        # Keep within world bounds
        self.x = max(0, min(self.x, game_width - self.width))
        self.y = max(0, min(self.y, game_height - self.height))
    
    def getViewport(self):
        return (self.x, self.y, self.width, self.height)
```

---

## Chapter 6: Audio in Games {#chapter-6}

### Types of Audio

#### Background Music (BGM)
- Loops continuously
- Sets mood and atmosphere
- Typically .ogg or .mp3 format

#### Sound Effects (SFX)
- Short, discrete sounds
- Feedback for player actions
- Typically .wav or .ogg format

#### Voice/Dialogue
- Character speech
- Notifications
- Important information

### Audio Implementation
```python
class AudioManager:
    def __init__(self):
        self.music = None
        self.sfx = {}
    
    def playMusic(self, filename):
        if self.music:
            self.music.stop()
        self.music = loadAudio(filename)
        self.music.play(loops=-1)  # Loop forever
    
    def playSound(self, name):
        if name not in self.sfx:
            self.sfx[name] = loadAudio(f'sounds/{name}.wav')
        self.sfx[name].play()
    
    def setMusicVolume(self, volume):
        self.music.set_volume(volume)
    
    def stopMusic(self):
        if self.music:
            self.music.stop()
```

### Audio Best Practices
- Use appropriate formats (compressed for music, uncompressed for SFX)
- Include volume controls
- Mute audio when window loses focus
- Don't overuse sounds (can become annoying)
- Match audio to action (impact sound for collision)

---

## Chapter 7: Asset Management {#chapter-7}

### Asset Types
- **Graphics**: Sprites, backgrounds, UI
- **Audio**: Music, sound effects, voice
- **Data**: Maps, level data, configuration
- **Models**: 3D geometry (for 3D games)
- **Animations**: Sprite sheets, skeletal animation

### Asset Organization
```
assets/
├── graphics/
│   ├── sprites/
│   ├── backgrounds/
│   └── ui/
├── audio/
│   ├── music/
│   └── sfx/
├── data/
│   ├── levels/
│   └── config/
└── models/
```

### Loading Assets
```python
class AssetManager:
    def __init__(self):
        self.assets = {}
    
    def loadImage(self, name, filepath):
        if name not in self.assets:
            self.assets[name] = loadImage(filepath)
        return self.assets[name]
    
    def getImage(self, name):
        return self.assets.get(name)
    
    def preloadAssets(self):
        # Load all assets at startup
        self.loadImage('player', 'assets/player.png')
        self.loadImage('enemy', 'assets/enemy.png')
        # ... load all assets
```

### Memory Optimization
- **Unload unused assets**: Free memory from unneeded assets
- **Compression**: Use compressed image formats
- **Asset pooling**: Reuse objects instead of creating new ones
- **Streaming**: Load assets as needed, not all at once

---

## Chapter 8: Debugging & Optimization {#chapter-8}

### Debugging Techniques

#### Console Logging
```python
print(f"Player position: {player.x}, {player.y}")
print(f"Enemies: {len(enemies)}")
print(f"FPS: {clock.get_fps()}")
```

#### On-Screen Debug Display
```python
def renderDebugInfo():
    drawText(f"FPS: {clock.get_fps()}", 10, 10)
    drawText(f"Objects: {len(all_objects)}", 10, 30)
    drawText(f"Collisions: {collision_count}", 10, 50)
```

#### Breakpoints
Stop execution at specific points to inspect state:
```python
if enemy.health < 0:
    breakpoint()  # Program pauses here
    print(enemy.state)  # Inspect data
```

### Performance Optimization

#### Measuring Performance
```python
import time

def measurePerformance():
    start = time.time()
    updateGameState()
    elapsed = time.time() - start
    print(f"Update took {elapsed*1000:.2f}ms")
```

#### Common Bottlenecks
1. **Collision detection**: Too many checks
2. **Drawing**: Drawing invisible objects
3. **Processing**: Unoptimized algorithms
4. **Memory**: Too many objects in memory

#### Optimization Strategies
- **Spatial partitioning**: Divide world into regions
- **Object pooling**: Reuse objects
- **Frustum culling**: Don't draw off-screen objects
- **Level of detail**: Use simpler models far away
- **Caching**: Store computed values

---

## Chapter 9: Your First Game Project {#chapter-9}

### Project: Simple Platformer

#### Game Design Document
**Title**: Pixel Jumper
**Goal**: Jump across platforms to reach the goal
**Controls**: 
- A/D or Arrow Keys: Move left/right
- Space: Jump
- E: Interact

**Mechanics**:
- Player falls with gravity
- Collides with platforms
- Platforms can be moving
- Collect coins for points
- Reach the goal to win

#### Step 1: Set up Project Structure
```
pixel_jumper/
├── main.py
├── config.py
├── game.py
├── player.py
├── platform.py
├── assets/
│   ├── player.png
│   ├── platform.png
│   └���─ goal.png
└── data/
    └── level1.json
```

#### Step 2: Main Game Loop (main.py)
```python
import pygame
from game import Game

pygame.init()

# Configuration
WIDTH = 1280
HEIGHT = 720
FPS = 60

# Create game
game = Game(WIDTH, HEIGHT, FPS)

# Main loop
running = True
clock = pygame.time.Clock()

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        game.handleEvent(event)
    
    deltaTime = clock.tick(FPS) / 1000.0
    game.update(deltaTime)
    game.render()

pygame.quit()
```

#### Step 3: Player Class (player.py)
```python
import pygame

class Player(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((32, 32))
        self.image.fill((255, 0, 0))
        self.rect = self.image.get_rect()
        self.rect.x = x
        self.rect.y = y
        
        self.velocity_x = 0
        self.velocity_y = 0
        self.speed = 200
        self.jump_force = 500
        self.gravity = 800
        self.on_ground = False
    
    def handleInput(self, keys):
        if keys[pygame.K_a] or keys[pygame.K_LEFT]:
            self.velocity_x = -self.speed
        elif keys[pygame.K_d] or keys[pygame.K_RIGHT]:
            self.velocity_x = self.speed
        else:
            self.velocity_x = 0
    
    def jump(self):
        if self.on_ground:
            self.velocity_y = -self.jump_force
            self.on_ground = False
    
    def update(self, deltaTime, platforms):
        # Apply gravity
        self.velocity_y += self.gravity * deltaTime
        
        # Update position
        self.rect.x += self.velocity_x * deltaTime
        self.rect.y += self.velocity_y * deltaTime
        
        # Check collision with platforms
        self.on_ground = False
        for platform in platforms:
            if self.rect.colliderect(platform.rect):
                if self.velocity_y >= 0:  # Falling
                    self.rect.bottom = platform.rect.top
                    self.velocity_y = 0
                    self.on_ground = True
    
    def draw(self, screen):
        screen.blit(self.image, self.rect)
```

---

## Chapter 10: Publishing Your Game {#chapter-10}

### Platforms for Distribution

#### PC
- **Steam**: Largest PC platform, 30% cut
- **Itch.io**: Indie-friendly, no minimum, your cut
- **Epic Games Store**: 12% cut, growing platform
- **GOG**: DRM-free games

#### Console
- **Xbox**: Apply for development kit
- **PlayStation**: Application required
- **Nintendo Switch**: Requires licensing agreement

#### Mobile
- **Apple App Store**: 30% cut, requires Apple Developer account
- **Google Play Store**: 30% cut
- **itch.io**: Support for HTML5 and Android games

### Preparing for Release

#### 1. Polish
- Fix bugs
- Optimize performance
- Improve UI/UX
- Balance difficulty

#### 2. Testing
- QA testing
- Beta testing with players
- Cross-platform testing

#### 3. Marketing
- Create trailer video
- Write game description
- Design promotional images
- Build social media presence

#### 4. Create Store Listing
- Game title and description
- Screenshots and trailer
- System requirements
- Genre and tags
- Price

### Post-Launch Support
- Monitor reviews and feedback
- Fix reported bugs
- Consider content updates
- Engage with community

---

## Summary

You now have the fundamentals of game development! Key takeaways:

1. **Game Loop**: Input → Update → Render
2. **Physics**: Use delta time for frame-rate independence
3. **Collisions**: Check when objects overlap
4. **Input**: Separate input from game logic
5. **Assets**: Organize and manage efficiently
6. **Optimization**: Measure before optimizing

### Next Steps
1. Create a simple game project (platformer, puzzle, etc.)
2. Publish to itch.io
3. Join game development communities
4. Learn an engine (Unity, Unreal, Godot)
5. Specialize in an area (graphics, physics, AI, etc.)

### Resources
- Game Development Stack Exchange
- r/gamedev on Reddit
- GameDev.net forums
- YouTube channels: Brackeys, GameMaker's Toolkit
- Books: Game Engine Architecture, Programming Game AI

Happy game developing! 🎮
