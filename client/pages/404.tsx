import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  ArrowLeft,
  Zap,
  Target,
  Star,
  Trophy,
  RefreshCw,
  Search,
  Gamepad2,
  Shield,
  Sparkles,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface GameState {
  score: number;
  lives: number;
  level: 1 | 2 | 3;
  playerPosition: { x: number; y: number };
  collectibles: Array<{ x: number; y: number; id: number; collected: boolean }>;
  gameActive: boolean;
  gameWon: boolean;
}

const FourOhFourPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [timeSpent, setTimeSpent] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [konami, setKonami] = useState<string[]>([]);
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  const quotes = [
    "404: Page not found, but your potential is infinite.",
    "Error 404: This page is in another castle.",
    "404: The page you seek is in another universe.",
    "404: Lost in cyberspace? We'll guide you home.",
    "404: Page not found, but great adventures await.",
  ];

  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
  ];

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    level: 1,
    playerPosition: { x: 5, y: 5 },
    collectibles: [],
    gameActive: false,
    gameWon: false,
  });

  // Initialize collectibles
  const initializeGame = useCallback(() => {
    const newCollectibles = [];
    for (let i = 0; i < 10; i++) {
      newCollectibles.push({
        x: Math.floor(Math.random() * 10),
        y: Math.floor(Math.random() * 10),
        id: i,
        collected: false,
      });
    }
    setGameState((prev) => ({
      ...prev,
      collectibles: newCollectibles,
      gameActive: true,
      score: 0,
      lives: 3,
      playerPosition: { x: 5, y: 5 },
      gameWon: false,
    }));
  }, []);

  // Timer and quote rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    const quoteTimer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(quoteTimer);
    };
  }, [quotes.length]);

  // Konami code detection
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newKonami = [...konami, e.code].slice(-konamiCode.length);
      setKonami(newKonami);

      if (JSON.stringify(newKonami) === JSON.stringify(konamiCode)) {
        setShowEasterEgg(true);
        setKonami([]);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [konami, konamiCode]);

  // Game controls
  useEffect(() => {
    const handleGameControls = (e: KeyboardEvent) => {
      if (!gameState.gameActive) return;

      e.preventDefault();
      let newX = gameState.playerPosition.x;
      let newY = gameState.playerPosition.y;

      switch (e.key) {
        case "ArrowUp":
        case "w":
          newY = Math.max(0, newY - 1);
          break;
        case "ArrowDown":
        case "s":
          newY = Math.min(9, newY + 1);
          break;
        case "ArrowLeft":
        case "a":
          newX = Math.max(0, newX - 1);
          break;
        case "ArrowRight":
        case "d":
          newX = Math.min(9, newX + 1);
          break;
        default:
          return;
      }

      setGameState((prev) => {
        const newPosition = { x: newX, y: newY };
        const updatedCollectibles = prev.collectibles.map((collectible) => {
          if (
            collectible.x === newX &&
            collectible.y === newY &&
            !collectible.collected
          ) {
            return { ...collectible, collected: true };
          }
          return collectible;
        });

        const newScore =
          updatedCollectibles.filter((c) => c.collected).length * 10;
        const gameWon = updatedCollectibles.every((c) => c.collected);

        return {
          ...prev,
          playerPosition: newPosition,
          collectibles: updatedCollectibles,
          score: newScore,
          gameWon: gameWon,
          gameActive: !gameWon,
        };
      });
    };

    if (gameState.gameActive) {
      window.addEventListener("keydown", handleGameControls);
      return () => window.removeEventListener("keydown", handleGameControls);
    }
  }, [gameState.gameActive, gameState.playerPosition]);

  const renderGameGrid = () => {
    const grid = [];
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        const isPlayer =
          gameState.playerPosition.x === x && gameState.playerPosition.y === y;
        const collectible = gameState.collectibles.find(
          (c) => c.x === x && c.y === y && !c.collected,
        );

        grid.push(
          <div
            key={`${x}-${y}`}
            className={`w-6 h-6 border border-border/20 flex items-center justify-center text-xs transition-all duration-200 ${
              isPlayer
                ? "bg-aethex-500 animate-pulse"
                : collectible
                  ? "bg-yellow-500/50 animate-bounce"
                  : "bg-background/30"
            }`}
          >
            {isPlayer && "🚀"}
            {collectible && "⭐"}
          </div>,
        );
      }
    }
    return grid;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-aethex-gradient py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute text-aethex-400 animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                  fontSize: `${12 + Math.random() * 8}px`,
                }}
              >
                404
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="text-center space-y-8 animate-scale-in relative z-10">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src="https://docs.aethex.tech/~gitbook/image?url=https%3A%2F%2F1143808467-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Forganizations%252FDhUg3jal6kdpG645FzIl%252Fsites%252Fsite_HeOmR%252Flogo%252FqxDYz8Oj2SnwUTa8t3UB%252FAeThex%2520Origin%2520logo.png%3Falt%3Dmedia%26token%3D200e8ea2-0129-4cbe-b516-4a53f60c512b&width=256&dpr=1&quality=100&sign=6c7576ce&sv=2"
                  alt="AeThex Logo"
                  className="h-24 w-24 animate-pulse-glow hover:animate-bounce transition-all duration-500"
                />
              </div>

              <h1 className="text-8xl lg:text-9xl font-bold text-gradient-purple animate-pulse">
                404
              </h1>

              <div className="space-y-2">
                <h2 className="text-2xl lg:text-3xl font-semibold text-gradient">
                  System Anomaly Detected
                </h2>
                <p className="text-lg text-muted-foreground animate-fade-in">
                  {quotes[currentQuote]}
                </p>
              </div>

              <div className="flex justify-center space-x-4">
                <Badge
                  variant="outline"
                  className="border-aethex-400/50 text-aethex-400 animate-pulse"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Time Lost: {timeSpent}s
                </Badge>
                <Badge
                  variant="outline"
                  className="border-neon-blue/50 text-neon-blue animate-bounce-gentle"
                >
                  <Target className="h-3 w-3 mr-1" />
                  Location: {location.pathname}
                </Badge>
              </div>
            </div>

            {/* Interactive Game Section */}
            <Card className="bg-card/50 border-border/50 mx-auto max-w-2xl animate-slide-up">
              <CardHeader>
                <CardTitle className="text-gradient flex items-center justify-center space-x-2">
                  <Gamepad2 className="h-5 w-5" />
                  <span>404 Rescue Mission</span>
                </CardTitle>
                <CardDescription>
                  Help the rocket collect all stars to unlock the way home! Use
                  WASD or arrow keys.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!gameState.gameActive && !gameState.gameWon && (
                  <Button
                    onClick={initializeGame}
                    className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 hover-lift interactive-scale"
                  >
                    <Gamepad2 className="h-4 w-4 mr-2" />
                    Start Mission
                  </Button>
                )}

                {gameState.gameActive && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        Score:{" "}
                        <span className="text-gradient font-bold">
                          {gameState.score}
                        </span>
                      </div>
                      <div className="text-sm">
                        Lives:{" "}
                        <span className="text-red-400">
                          {"❤️".repeat(gameState.lives)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-10 gap-1 mx-auto w-fit p-4 border border-border/50 rounded-lg bg-background/30">
                      {renderGameGrid()}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Collected:{" "}
                      {gameState.collectibles.filter((c) => c.collected).length}{" "}
                      / {gameState.collectibles.length}
                    </div>
                  </div>
                )}

                {gameState.gameWon && (
                  <div className="space-y-4 animate-scale-in">
                    <div className="text-center space-y-2">
                      <Trophy className="h-12 w-12 text-yellow-500 mx-auto animate-bounce" />
                      <h3 className="text-xl font-bold text-gradient">
                        Mission Complete!
                      </h3>
                      <p className="text-muted-foreground">
                        You've rescued the lost page! Final Score:{" "}
                        {gameState.score}
                      </p>
                    </div>
                    <Button
                      onClick={() => navigate("/")}
                      className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 hover-lift interactive-scale"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      Return Home Victorious
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Easter Egg */}
            {showEasterEgg && (
              <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50 animate-scale-in">
                <CardContent className="p-6 text-center">
                  <Sparkles className="h-8 w-8 text-purple-400 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-bold text-gradient-purple mb-2">
                    🎉 Konami Code Activated! 🎉
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You've unlocked the secret developer mode! You're clearly a
                    person of culture.
                  </p>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 hover-lift interactive-scale"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Access Developer Dashboard
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Navigation Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto animate-slide-up">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="hover-lift interactive-scale group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Go Back
              </Button>

              <Button
                onClick={() => navigate("/")}
                className="bg-gradient-to-r from-aethex-500 to-neon-blue hover:from-aethex-600 hover:to-neon-blue/90 hover-lift interactive-scale group"
              >
                <Home className="h-4 w-4 mr-2" />
                Home Base
              </Button>

              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="hover-lift interactive-scale group"
              >
                <RefreshCw className="h-4 w-4 mr-2 transition-transform group-hover:rotate-180" />
                Retry
              </Button>
            </div>

            {/* Help Section */}
            <Card className="bg-background/30 border-border/30 max-w-lg mx-auto animate-fade-in">
              <CardContent className="p-4 text-center">
                <Search className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Lost? Try searching for what you need or{" "}
                  <button
                    onClick={() => navigate("/contact")}
                    className="text-aethex-400 hover:underline"
                  >
                    contact our support team
                  </button>
                </p>
              </CardContent>
            </Card>

            {/* Fun Stats */}
            <div className="text-xs text-muted-foreground animate-fade-in">
              <p>🎮 Try the Konami Code for a surprise!</p>
              <p>⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FourOhFourPage;
