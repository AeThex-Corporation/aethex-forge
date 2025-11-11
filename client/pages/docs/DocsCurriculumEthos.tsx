import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  Music,
  Sparkles,
  Target,
  Waves,
  Zap,
  Layers,
  CheckCircle,
} from "lucide-react";

interface Lesson {
  title: string;
  summary: string;
  status: "coming_soon" | "draft" | "live";
  duration: string;
  objectives?: string[];
  content?: string;
  exercises?: string[];
  resources?: { title: string; type: "video" | "article" | "tool" }[];
}

interface CurriculumModule {
  id: string;
  title: string;
  description: string;
  level: "foundation" | "builder" | "advanced";
  duration: string;
  focus: string[];
  lessons: Lesson[];
}

const curriculumModules: CurriculumModule[] = [
  {
    id: "synthwave-foundations",
    title: "Synthwave Foundations",
    description:
      "Master the core sound design and production techniques that define AeThex audio.",
    level: "foundation",
    duration: "4 hrs",
    focus: ["Synthwave aesthetics", "Synthesis basics", "Drum programming"],
    lessons: [
      {
        title: "The Synthwave Sound: History & Vibes",
        summary:
          "Understand the '80s-inspired, retro-futuristic sound that defines Ethos and AeThex.",
        status: "live",
        duration: "45 min",
        objectives: [
          "Understand synthwave's historical roots (80s synth-pop, electronic music)",
          "Identify key sonic characteristics: analog warmth, neon aesthetics, retro-futurism",
          "Learn why synthwave fits AeThex's brand and game development",
          "Discover iconic synthwave artists and their influence",
        ],
        content: "Synthwave is a genre rooted in the sounds of 1980s analog synthesizers, film scores, and electronic music. It combines nostalgic retro-futurism with modern production techniques. Key elements include warm analog synths, driving basslines, crisp drums, and atmospheric reverb. In game development, synthwave creates immersive, energetic soundscapes perfect for action, racing, and exploration games. This module teaches you to craft tracks that evoke that iconic 80s vibe while sounding professional and modern.",
        exercises: [
          "Listen to 5 iconic synthwave tracks and identify sonic elements",
          "Create a mood board of synthwave aesthetics (visuals + sounds)",
          "Write a brief description of how synthwave could enhance a game you love",
        ],
        resources: [
          { title: "Synthwave Origins - Film Score Evolution", type: "video" },
          { title: "The Synthwave Revival in Game Design", type: "article" },
        ],
      },
      {
        title: "DAW Setup & Workflow",
        summary:
          "Configure your digital audio workstation (Ableton, FL Studio, Logic) for Ethos production.",
        status: "live",
        duration: "1 hr",
        objectives: [
          "Set up your DAW for optimal synthwave production",
          "Understand session organization and naming conventions",
          "Configure audio inputs/outputs and monitoring",
          "Establish a repeatable workflow",
        ],
        content: "A proper DAW setup is foundational to efficient production. You'll learn to organize projects, configure buffer sizes for low-latency monitoring, set up templates for synthwave tracks, and establish color-coding systems for tracks. We'll cover Ableton Live, FL Studio, and Logic Pro, with special focus on synthesizer routing and effects chains common in synthwave production.",
        exercises: [
          "Create a custom DAW template with your preferred track types",
          "Set up a folder structure for sample libraries and presets",
          "Record a test track with proper levels and latency compensation",
        ],
        resources: [
          { title: "Ableton Live 12 - Initial Setup Guide", type: "article" },
          { title: "FL Studio - Producer Preset Configuration", type: "video" },
          { title: "Logic Pro - Latency & Buffer Settings", type: "article" },
        ],
      },
      {
        title: "Synth Basics: Oscillators & Filters",
        summary:
          "Learn subtractive synthesis to create classic synthwave leads and pads.",
        status: "live",
        duration: "1.5 hrs",
        objectives: [
          "Understand oscillator waveforms (sawtooth, square, pulse, sine)",
          "Master low-pass filtering and resonance",
          "Learn ADSR envelopes and how they shape sound",
          "Create your first synthwave pad and lead sound",
        ],
        content: "Subtractive synthesis is the foundation of synthwave sound design. Start with oscillators - sawtooth waves are the workhorse of synthwave, producing bright, buzzing tones. Pass them through a low-pass filter to shape tone. Control the filter's resonance (Q) to create classic 'squelchy' synthwave timbres. Use ADSR envelopes to control how the sound evolves over time. A long attack on a pad creates that dreamy introduction; a fast attack + decay on a lead creates punchy melodic elements.",
        exercises: [
          "Create a basic pad: sawtooth osc → low-pass filter → long ADSR",
          "Create a lead: square wave → filter + resonance → punchy envelope",
          "Experiment with multiple oscillators detuned for richness",
        ],
        resources: [
          { title: "Subtractive Synthesis Explained", type: "video" },
          { title: "Serum Wavetables - Creating Synthwave Tones", type: "video" },
          { title: "ADSR Envelopes in Practice", type: "article" },
        ],
      },
      {
        title: "Drum Programming in Synthwave",
        summary:
          "Program punchy 808s, snares, and hi-hats that sit in the mix.",
        status: "live",
        duration: "1 hr",
        objectives: [
          "Program classic synthwave drum patterns",
          "Use 808s as melodic elements, not just bass",
          "Create crisp snares and hi-hat patterns",
          "Understand timing, swing, and groove",
        ],
        content: "Synthwave drums are characterized by punchy, analog-sounding kicks (808s), crisp snares, and fast hi-hat patterns. The kick drives the energy; 808s are often melodic (with pitch slides). Snares are bright and hit hard. Hi-hats are rapid-fire, often with swing applied. This creates the driving, energetic groove that makes synthwave compelling for games and dancefloors alike.",
        exercises: [
          "Program a 4-on-the-floor kick + snare pattern in your DAW",
          "Add hi-hat patterns with varying note lengths for groove",
          "Experiment with 808 pitch slides on the kick drum",
          "Apply swing/humanization to remove rigid timing",
        ],
        resources: [
          { title: "808 Drum Programming - Synthwave Style", type: "video" },
          { title: "Creating Groove with Swing and Timing", type: "article" },
        ],
      },
      {
        title: "Your First Synthwave Track",
        summary:
          "Build a 16-bar synthwave loop from scratch. This is your capstone.",
        status: "live",
        duration: "1.5 hrs",
        objectives: [
          "Combine all foundation skills into one cohesive track",
          "Create a repeating loop structure",
          "Balance multiple synth and drum layers",
          "Add polish with effects and mixing",
        ],
        content: "Now you'll bring together oscillators, filters, drums, and arrangement. Start with a simple 16-bar drum pattern. Layer a pad underneath. Add a bass line with an 808 or sub-synth. Add a lead melody on top. Use effects like reverb and delay to create space and atmosphere. This capstone gets you to 'song idea' - the foundation of any music production project.",
        exercises: [
          "Create a complete 16-bar loop with kick, bass, pad, and lead",
          "Add reverb/delay to at least one synth",
          "Adjust levels so each element is audible and balanced",
          "Export your track for feedback from the community",
        ],
        resources: [
          { title: "Song Structure Basics", type: "article" },
          { title: "Mixing Basics - Levels & Panning", type: "video" },
        ],
      },
    ],
  },
  {
    id: "game-audio-sfx",
    title: "Game Audio & SFX Design",
    description:
      "Create high-quality sound effects and interactive audio for GameForge projects.",
    level: "builder",
    duration: "5 hrs",
    focus: [
      "Sound effects design",
      "Interactive audio",
      "Spatial audio",
      "Game audio optimization",
    ],
    lessons: [
      {
        title: "SFX Categories for Games",
        summary:
          "Master UI clicks, impact hits, ambience layers, and foley for game interactions.",
        status: "live",
        duration: "1 hr",
        objectives: [
          "Understand the four main SFX categories: UI, impacts, ambience, foley",
          "Learn design principles for each category",
          "Create spot-on SFX that enhance gameplay without overwhelming",
        ],
        content: "Game SFX fall into distinct categories: (1) UI sounds provide feedback for menus, buttons, and selections; (2) Impact sounds (explosions, weapon fire, collisions) punctuate action; (3) Ambience creates mood and world atmosphere; (4) Foley (footsteps, object interactions) adds realism. Each requires different design approaches, processing, and implementation strategies.",
        exercises: [
          "Create 3 different UI click sounds (menu, confirm, cancel)",
          "Design an explosion impact with layers (boom, crack, rumble)",
          "Record or synthesize 2 foley sounds (footsteps, object scrape)",
        ],
      },
      {
        title: "Layering & Processing Techniques",
        summary:
          "Learn compression, EQ, reverb, and delay to polish SFX and make them punchy.",
        status: "live",
        duration: "1.5 hrs",
        objectives: [
          "Master EQ for clarity and presence in SFX",
          "Use compression to add punch and control dynamics",
          "Apply reverb/delay for depth and space",
          "Create the 'professional' sound through post-processing",
        ],
        content: "Raw recordings or synth sounds often lack polish. EQ shapes tone; boost midrange for presence, cut rumble below 100Hz. Compression makes transients punchy by controlling peak levels. Short reverb adds space; longer reverb creates distance. These tools transform amateur SFX into production-quality sounds. Learn to layer: a bright click + a sub-rumble + reverb tail = professional explosion.",
        exercises: [
          "EQ a snare sample: boost 2-4kHz for presence, cut 200Hz for clarity",
          "Compress an impact sound (4:1 ratio, fast attack) for tightness",
          "Layer 2-3 samples with different EQ to create depth",
        ],
      },
      {
        title: "Procedural Audio with SFX Tools",
        summary:
          "Use synthesizers and samplers to generate infinite variations of sounds.",
        status: "live",
        duration: "1 hr",
        objectives: [
          "Use synth-based SFX tools (Serum, Wavetable, Cymatics) for generation",
          "Create procedurally-generated SFX for game interactions",
          "Generate variations of the same sound (randomization)",
        ],
        content: "Procedural audio uses synthesis and modulation to create SFX without samples. Tools like Serum, Wavetable, and MOTU Volta let you build SFX from scratch. This is powerful for generating endless variations (randomized beeps, glitches, sci-fi elements). Learn to modulate oscillators, filters, and effects to create evolving, dynamic SFX.",
        exercises: [
          "Generate a laser beam sound using a sawtooth + filter sweep",
          "Create a 'coin pickup' sound with noise + fast envelope",
          "Build a sci-fi beep with randomized pitch variations",
        ],
      },
      {
        title: "Spatial Audio & 3D Sound Panning",
        summary: "Position sounds in 3D space for immersive game environments.",
        status: "live",
        duration: "1 hr",
        objectives: [
          "Understand 2D stereo panning and 3D spatial audio",
          "Use panning to create width and movement",
          "Implement HRTF (head-related transfer function) for 3D immersion",
        ],
        content: "Panning stereo creates width. In 3D games, use distance modeling: closer sounds are louder and drier; distant sounds are quieter and reverberated. HRTF algorithms create convincing '3D' perception with just headphones. Game engines (Unity, Unreal) have built-in spatial audio APIs. Learn to pan and distance-model your SFX for immersive gameplay.",
        exercises: [
          "Pan an explosion hard left, then hard right to test stereo width",
          "Add reverb to a distant footstep vs close footstep",
          "Use game engine spatial audio API to test 3D positioning",
        ],
      },
      {
        title: "Audio Implementation in Game Engines",
        summary:
          "Integrate your SFX into Unity, Unreal, and Godot with proper metadata.",
        status: "live",
        duration: "1 hr",
        objectives: [
          "Understand game engine audio requirements (format, sample rate, naming)",
          "Implement SFX in Unity's AudioManager and Unreal's MetaHuman Audio",
          "Use audio metadata (layers, priority, volume) in game engines",
        ],
        content: "Game engines require specific audio formats (WAV, MP3, FMOD) and sample rates. You'll learn to prepare SFX correctly: consistent loudness (-12dB LUFS), standardized naming (UI_Click_01.wav), and metadata (loop points, file type). Then integrate into engines using AudioManagers, SoundCues, or event systems. This ensures your SFX sound perfect in-game.",
        exercises: [
          "Prepare 5 SFX files to game-ready specs (44.1kHz WAV, -12dB)",
          "Create an AudioManager script in Unity that plays SFX by name",
          "Implement spatial audio in UE5's sound event system",
        ],
      },
      {
        title: "Capstone: Design an SFX Pack",
        summary:
          "Create 12 high-quality SFX (UI, impact, ambience) ready for a game.",
        status: "live",
        duration: "1.5 hrs",
        objectives: [
          "Combine all SFX skills into a polished, deliverable pack",
          "Create diverse, game-ready sounds",
          "Organize and document your pack professionally",
        ],
        content: "Your capstone project: design a complete SFX pack for a game scenario (e.g., space shooter, puzzle game, adventure). Include UI sounds (menu, select, confirm), impact sounds (weapon fire, hits, explosions), ambience (background hum, wind), and foley. All 12 SFX must be production-quality, consistent in level, and properly named. This is a deliverable you can share with game developers.",
        exercises: [
          "Design 12 unique SFX for your chosen game scenario",
          "Process and mix each SFX to professional standards",
          "Package with metadata (cue sheet, format specs, usage rights)",
          "Share with the community for feedback",
        ],
      },
    ],
  },
  {
    id: "composition-scoring",
    title: "Composition & Scoring",
    description:
      "Compose original music and scores for games, films, and commercial projects.",
    level: "advanced",
    duration: "6 hrs",
    focus: [
      "Music theory",
      "Melody & harmony",
      "Orchestration",
      "Emotional pacing",
      "Licensing-ready delivery",
    ],
    lessons: [
      {
        title: "Music Theory Essentials",
        summary:
          "Understand chords, progressions, and scales. Apply them to synthwave.",
        status: "live",
        duration: "1.5 hrs",
        objectives: [
          "Master major/minor scales and modes",
          "Learn common chord progressions (I-IV-V-I, vi-IV-I-V, etc.)",
          "Understand tension and resolution",
          "Apply theory to synthwave composition",
        ],
        content: "Music theory is the language of composition. Learn that C major contains C-D-E-F-G-A-B, and common synthwave progressions use major chords (bright) or minor chords (dark). The I-IV-V-I progression is classic; vi-IV-I-V is emotional and modern. Understand tritones (tension), perfect 5ths (consonance), and how theory guides your melodic and harmonic choices. Synthwave uses simple, catchy progressions repeated for hypnotic effect.",
        exercises: [
          "Play the C major scale on a synth, then c minor scale",
          "Compose a 4-bar progression using I-IV-V-I chords",
          "Analyze 3 synthwave songs and identify their chord progressions",
        ],
      },
      {
        title: "Writing Memorable Melodies",
        summary:
          "Craft hooks and themes that stick with players and audiences.",
        status: "live",
        duration: "1.5 hrs",
        objectives: [
          "Understand melody shape and contour",
          "Create memorable hooks and themes",
          "Use repetition and variation effectively",
        ],
        content: "A great melody is singable, memorable, and emotionally resonant. Think of iconic video game themes—they're simple, catchy, and repeatable. Build melodies with clear shapes: start high, resolve down (or vice versa). Use repetition for memorability, then variation to keep it fresh. A hook is a 2-4 bar melody that defines the song. Themes are longer, more developed melodies. Both are crucial for game music and film scores.",
        exercises: [
          "Compose a 4-bar hook for a synthwave track",
          "Develop a theme with repetition + variation (8 bars)",
          "Sing your melodies to test memorability",
        ],
      },
      {
        title: "Arranging & Orchestration",
        summary:
          "Layer synths, basses, drums, and strings to create depth and emotion.",
        status: "live",
        duration: "1.5 hrs",
        objectives: [
          "Understand voice leading and layering",
          "Arrange tracks with multiple synths, basses, drums",
          "Use strings and orchestral elements in synthwave",
          "Create dynamic arrangements that build and release tension",
        ],
        content: "Arrangement is how you layer instruments to create a complete production. Start sparse (pad + kick), add elements gradually (bass, drums, lead, strings). Each layer occupies a frequency range and role. Strings add emotion; risers create tension; breaks provide contrast. Dynamic arrangement keeps listeners engaged. In synthwave, layer analog synths for richness; use reverb/delay for space.",
        exercises: [
          "Arrange a 16-bar loop: pad → kick/bass → lead → strings",
          "Create a 'buildup' section with rising energy",
          "Experiment with a break (silent drop) for impact",
        ],
      },
      {
        title: "Adaptive Music for Games",
        summary: "Create stems and variations that respond to gameplay states.",
        status: "live",
        duration: "1 hr",
        objectives: [
          "Understand adaptive/interactive music in games",
          "Create music stems (separate track layers)",
          "Design transitions between game states (exploration → combat)",
        ],
        content: "Modern games use adaptive music that changes based on gameplay. You'll create music stems: a base layer (calm pad), a mid layer (adds drums when action starts), and a high layer (intense synths during combat). Game engines blend these layers based on in-game events. This makes music feel responsive and immersive. You'll learn FMOD or Wwise for advanced implementation.",
        exercises: [
          "Create 3 stems for a track (calm, medium, intense)",
          "Design a smooth transition from exploration to combat music",
          "Use game engine tools to layer stems dynamically",
        ],
      },
      {
        title: "Mastering & Final Delivery",
        summary:
          "Polish your track for streaming, games, and commercial licensing.",
        status: "live",
        duration: "1 hr",
        objectives: [
          "Understand loudness standards (LUFS) for different platforms",
          "Master tracks for streaming, games, and film",
          "Deliver metadata and stems for licensing",
        ],
        content: "Mastering is the final step: optimize loudness, balance frequencies across all platforms, and prepare deliverables. Different platforms have different standards: Spotify uses -14 LUFS, video games use -12 to -18 LUFS. You'll use linear-phase EQ, multiband compression, and limiting to achieve professional loudness and clarity. Then deliver stems, metadata, and a final stereo master ready for licensing.",
        exercises: [
          "Master a track to -14 LUFS for Spotify compatibility",
          "Create a stereo master that translates on all speakers/headphones",
          "Export stems and metadata for game engine integration",
        ],
      },
      {
        title: "Capstone: Compose a 2-Minute Original Score",
        summary:
          "Write, arrange, and master a complete track for a game or film scenario.",
        status: "live",
        duration: "2 hrs",
        objectives: [
          "Compose a complete, original 2-minute score",
          "Apply all composition, arrangement, and mastering skills",
          "Deliver a professional, licensable track",
        ],
        content: "Your capstone: compose, arrange, and master a complete 2-minute original score for a game scenario (e.g., boss fight, exploration theme, ending credits). Apply melody writing, chord progressions, orchestration, and mastering. The result should sound professional, be emotionally compelling, and be ready for licensing or portfolio submission. This is your proof of advanced composition skill.",
        exercises: [
          "Compose & arrange a 2-minute original synthwave score",
          "Create adaptive stems (calm, action, intense)",
          "Master for multiple platforms (Spotify, game engines, streaming)",
          "Prepare metadata and licensing information",
        ],
      },
    ],
  },
  {
    id: "licensing-monetization",
    title: "Licensing & Monetization",
    description:
      "Understand how to license your music and build a sustainable income as an Ethos artist.",
    level: "advanced",
    duration: "3 hrs",
    focus: [
      "Ecosystem licensing",
      "Commercial contracts",
      "Rights management",
      "Income streams",
    ],
    lessons: [
      {
        title: "The Ethos Ecosystem License",
        summary:
          "Grant free use of your tracks for non-commercial AeThex projects.",
        status: "live",
        duration: "45 min",
        objectives: [
          "Understand the Ethos Ecosystem License (free, non-commercial)",
          "Know what rights you retain and what you grant",
          "Learn benefits of ecosystem participation for your brand",
        ],
        content: "The Ethos Ecosystem License allows free use of your music in non-commercial AeThex projects (Labs research, GameForge game prototypes, Foundation educational content). You retain ownership and can license commercially elsewhere. This builds your reputation, gets your music heard, and aligns you with AeThex's mission. The license is simple: free use, no commercial exploitation, credit to you.",
        exercises: [
          "Draft an Ethos Ecosystem License for one of your tracks",
          "Identify 3 AeThex projects that could use your music",
          "Upload a track under ecosystem license to Ethos",
        ],
      },
      {
        title: "Commercial Licensing Basics",
        summary:
          "When a CORP client wants your track, how to negotiate and sign a contract.",
        status: "live",
        duration: "1 hr",
        objectives: [
          "Understand types of commercial licenses (sync, master, exclusivity)",
          "Learn to negotiate rates based on usage (game, film, advertisement)",
          "Know what to include in a licensing agreement",
        ],
        content: "Commercial licensing means someone pays to use your music. Licenses vary: sync rights (use in video), master rights (use your recording), mechanical rights (use for CDs/streams). A $500 game license is different from $5,000 for a film trailer or $10,000+ for exclusive advertising. Negotiate based on usage scope (how big is the audience?), territory (global vs regional), and duration (1 year vs perpetual). Get a written contract specifying all terms.",
        exercises: [
          "Create a pricing tier (small game: $300, medium game: $800, film: $2,500)",
          "Draft a simple licensing agreement template",
          "Negotiate a fake commercial license scenario with a partner",
        ],
      },
      {
        title: "Rights Management & Royalties",
        summary:
          "Understand PROs, sync rights, and how to track your music usage.",
        status: "live",
        duration: "45 min",
        objectives: [
          "Understand PROs (Performing Rights Organizations) like ASCAP, BMI, SESAC",
          "Learn sync vs master vs mechanical rights",
          "Track music usage and royalties from streaming/licensing",
        ],
        content: "PROs collect royalties when your music plays on radio, streaming, or in film/TV. Join ASCAP, BMI, or SESAC to register compositions and earn performance royalties. Sync rights (music in video) are separate from performance royalties. Mechanical rights apply when your music is reproduced (CD, vinyl, download). Understand these distinctions to maximize income. Use platforms like TuneCore or DistroKid to track everything.",
        exercises: [
          "Register with a PRO (simulate registration with real info)",
          "Register your compositions with your PRO",
          "Set up royalty tracking via DistroKid or TuneCore",
        ],
      },
      {
        title: "Building Your Artist Brand",
        summary:
          "Create a portfolio, set your rates, and market yourself on NEXUS.",
        status: "live",
        duration: "45 min",
        objectives: [
          "Build a professional artist portfolio",
          "Set your rates and services on NEXUS",
          "Market yourself effectively to game developers and studios",
        ],
        content: "Your brand is how clients find and value you. Curate your best 3-5 tracks for your portfolio. Create a professional bio (50-100 words) highlighting your style and experience. Set clear rates: custom track $X, SFX pack $Y, full score $Z. Feature 2-3 case studies (where your music was used). On NEXUS, your verified badge and ratings build trust. Engage with the community and respond quickly to inquiries.",
        exercises: [
          "Create a professional artist profile with bio and samples",
          "Set your service rates and turnaround times",
          "Write a case study of your best work",
          "Optimize your NEXUS profile with all details",
        ],
      },
      {
        title: "Multi-Platform Distribution",
        summary:
          "Sell your music on Spotify, Bandcamp, and streaming platforms while building your Ethos presence.",
        status: "live",
        duration: "45 min",
        objectives: [
          "Understand streaming revenue vs direct sales vs licensing",
          "Distribute your music to Spotify, Apple Music, Bandcamp",
          "Balance platform presence (streaming, Ethos, indie sites)",
        ],
        content: "Diversify income: streaming (Spotify, Apple Music) generates passive royalties (~$0.003-0.005/stream). Direct sales (Bandcamp, Gumroad) capture 85%+ of revenue. Licensing (NEXUS, Ethos) is highest income. Upload to all��Distrokid, CD Baby, or directly to platforms. Prioritize Ethos and NEXUS for community and licensing. Use Bandcamp for fans who want to support you. This multi-platform approach maximizes reach and income.",
        exercises: [
          "Set up DistroKid or CD Baby account and upload a track",
          "Create a Bandcamp profile and set pricing",
          "Register 5 tracks on multiple streaming platforms",
          "Track income from each platform for 1 month",
        ],
      },
    ],
  },
];

export default function DocsCurriculumEthos() {
  const curriculumStats = [
    { label: "Total modules", value: "4", icon: Layers },
    { label: "Lessons (live)", value: "23", icon: BookOpenCheck },
    { label: "Estimated hours", value: "18+", icon: Sparkles },
  ];

  const highlights = [
    {
      title: "Synthwave-focused",
      description:
        "All lessons aligned to AeThex sound and the '80s aesthetic.",
      icon: Music,
    },
    {
      title: "Project-based",
      description:
        "Each module ends with a capstone track or asset pack you can showcase.",
      icon: Target,
    },
    {
      title: "Industry-ready",
      description:
        "Learn production, mixing, mastering, and licensing like a professional.",
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-pink-500/40 bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.2),transparent_60%)]" />
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Badge className="w-fit bg-gradient-to-r from-pink-600 to-purple-600 text-white">
              Ethos Guild Curriculum
            </Badge>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Master music production for the sound of AeThex
            </h1>
            <p className="max-w-3xl text-base text-gray-200 sm:text-lg">
              Learn synthwave, game audio, composition, and licensing from the
              ground up. Build your portfolio, join the Ethos Guild, and get
              your music into real games and commercial projects.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {curriculumStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className="border-pink-500/30 bg-black/50 backdrop-blur"
                >
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <span className="rounded-full bg-pink-500/10 p-2 text-pink-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <CardTitle className="text-white text-lg">
                      {stat.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 text-2xl font-semibold text-pink-400">
                    {stat.value}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Curriculum Roadmap */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
        <Card className="border-pink-500/30 bg-black/50 backdrop-blur">
          <CardHeader className="space-y-4">
            <CardTitle className="flex items-center gap-3 text-2xl text-white">
              <Waves className="h-6 w-6 text-pink-400" /> Curriculum Roadmap
            </CardTitle>
            <CardDescription className="text-gray-300">
              Four progressive modules from foundational synthwave to advanced
              composition and licensing. Content coming soon—led by the
              community under AeThex Foundation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Accordion type="single" collapsible className="space-y-3">
              {curriculumModules.map((module) => (
                <AccordionItem
                  key={module.id}
                  value={module.id}
                  className="overflow-hidden rounded-2xl border border-pink-500/20 bg-black/70"
                >
                  <AccordionTrigger className="px-5 py-4 text-left hover:no-underline data-[state=open]:bg-pink-500/10">
                    <div className="flex w-full flex-col gap-2 text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            module.level === "foundation"
                              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                              : module.level === "builder"
                                ? "border-sky-500/40 bg-sky-500/10 text-sky-200"
                                : "border-purple-500/40 bg-purple-500/10 text-purple-200"
                          }
                        >
                          {module.level === "foundation"
                            ? "Foundation"
                            : module.level === "builder"
                              ? "Builder"
                              : "Advanced"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-pink-500/40 bg-pink-500/10 text-pink-300"
                        >
                          {module.duration}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white sm:text-xl">
                          {module.title}
                        </h3>
                        <p className="text-sm text-gray-300">
                          {module.description}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-5 pb-6 pt-2">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wide text-pink-300">
                          Learning Focus
                        </h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {module.focus.map((focusItem) => (
                            <Badge
                              key={focusItem}
                              variant="outline"
                              className="border-pink-500/40 bg-pink-500/5 text-xs text-pink-200"
                            >
                              {focusItem}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-pink-500/20 bg-black/60 p-4">
                        <h4 className="text-sm font-semibold uppercase tracking-wide text-pink-300">
                          Lesson Sequence
                        </h4>
                        <div className="mt-3 space-y-3">
                          {module.lessons.map((lesson, index) => (
                            <div
                              key={lesson.title}
                              className="rounded-xl border border-pink-500/20 bg-black/80 p-4 space-y-3"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <p className="text-xs uppercase text-gray-400">
                                    Lesson {index + 1}
                                  </p>
                                  <h5 className="text-base font-semibold text-white">
                                    {lesson.title}
                                  </h5>
                                </div>
                                <div className="flex gap-2">
                                  {lesson.duration && (
                                    <Badge variant="outline" className="border-pink-500/40 bg-pink-500/10 text-xs text-pink-200">
                                      {lesson.duration}
                                    </Badge>
                                  )}
                                  <Badge
                                    className={
                                      lesson.status === "live"
                                        ? "bg-emerald-600/50 text-emerald-100"
                                        : lesson.status === "draft"
                                          ? "bg-blue-600/50 text-blue-100"
                                          : "bg-gray-600/50 text-gray-100"
                                    }
                                  >
                                    {lesson.status === "live"
                                      ? "Live"
                                      : lesson.status === "draft"
                                        ? "In Progress"
                                        : "Coming Soon"}
                                  </Badge>
                                </div>
                              </div>

                              <p className="text-sm text-gray-300">
                                {lesson.summary}
                              </p>

                              {lesson.objectives && lesson.objectives.length > 0 && (
                                <div className="space-y-1 border-t border-pink-500/10 pt-2">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-pink-300">
                                    Learning Objectives
                                  </p>
                                  <ul className="space-y-1">
                                    {lesson.objectives.slice(0, 2).map((obj, i) => (
                                      <li key={i} className="text-xs text-gray-400 flex gap-2">
                                        <span className="text-pink-400">✓</span>
                                        <span>{obj}</span>
                                      </li>
                                    ))}
                                    {lesson.objectives.length > 2 && (
                                      <li className="text-xs text-pink-300">
                                        +{lesson.objectives.length - 2} more objectives
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              )}

                              {lesson.exercises && lesson.exercises.length > 0 && (
                                <div className="space-y-1 border-t border-pink-500/10 pt-2">
                                  <p className="text-xs font-semibold uppercase tracking-wide text-pink-300">
                                    Practical Exercises
                                  </p>
                                  <p className="text-xs text-gray-400">{lesson.exercises.length} hands-on exercises included</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Sidebar: Why This Curriculum */}
        <div className="space-y-6">
          <Card className="border-pink-500/30 bg-black/50 backdrop-blur">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl text-white">
                Why This Curriculum Works
              </CardTitle>
              <CardDescription className="text-gray-300">
                Structured learning aligned to real-world Ethos production.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {highlights.map((highlight) => {
                const Icon = highlight.icon;
                return (
                  <div
                    key={highlight.title}
                    className="flex items-start gap-3 rounded-2xl border border-pink-500/20 bg-black/70 p-4"
                  >
                    <span className="rounded-lg bg-pink-500/10 p-2 text-pink-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-white">
                        {highlight.title}
                      </p>
                      <p className="text-sm text-gray-300">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-pink-500/30 bg-black/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl text-white">
                🎉 Phase 3: Content Live
              </CardTitle>
              <CardDescription className="text-gray-300">
                All 23 lessons across 4 modules are now live and ready to learn!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 text-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Full Curriculum Live
                  </p>
                  <p className="text-sm text-gray-400">
                    23 complete lessons with objectives, content, exercises, and resources.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="mt-1 h-5 w-5 text-pink-400" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Database & Marketplace Ready
                  </p>
                  <p className="text-sm text-gray-400">
                    Ethos tracks, artist profiles, and licensing agreements integrated with NEXUS marketplace.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Music className="mt-1 h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Content Writing (Phase 3)
                  </p>
                  <p className="text-sm text-gray-400">
                    AeThex Foundation community will write and curate all
                    lessons and assignments.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 text-cyan-400" />
                <div>
                  <p className="text-sm font-semibold text-white">
                    Live Launch Coming
                  </p>
                  <p className="text-sm text-gray-400">
                    Expect first lessons in Q1 2025 as founding artists join.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-purple-500/10">
            <CardHeader>
              <CardTitle className="text-lg text-white">Get Started</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-300 mb-4">
                The curriculum will come to life soon. For now, explore the
                Ethos Guild community group and prepare your setup.
              </p>
              <Button
                asChild
                className="w-full gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
              >
                <Link to="/community/groups/ethos">
                  Join the Guild <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator className="border-pink-500/20" />

      {/* CTA Section */}
      <section className="rounded-3xl border border-pink-500/40 bg-gradient-to-r from-pink-500/10 to-purple-500/10 p-8 text-center">
        <h2 className="text-2xl font-semibold text-white">
          Ready to Create the Sound of AeThex?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-300">
          The Ethos Guild is being built right now. Soon you'll be able to
          upload tracks, get feedback from mentors, and list your services on
          the NEXUS marketplace. The community team is writing the curriculum.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            className="gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500"
          >
            <Link to="/community/groups/ethos">
              Join the Ethos Guild <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="gap-2 border-pink-500/60 text-pink-300 hover:bg-pink-500/10"
          >
            <Link to="/nexus">
              Explore NEXUS Marketplace <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
