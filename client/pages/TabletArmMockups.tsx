import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ARMS = [
  {
    id: "labs",
    name: "Labs",
    color: "#FBBF24",
    bgColor: "bg-yellow-500/20",
    textColor: "text-yellow-400",
  },
  {
    id: "gameforge",
    name: "GameForge",
    color: "#22C55E",
    bgColor: "bg-green-500/20",
    textColor: "text-green-400",
  },
  {
    id: "corp",
    name: "Corp",
    color: "#3B82F6",
    bgColor: "bg-blue-500/20",
    textColor: "text-blue-400",
  },
  {
    id: "foundation",
    name: "Foundation",
    color: "#EF4444",
    bgColor: "bg-red-500/20",
    textColor: "text-red-400",
  },
  {
    id: "devlink",
    name: "Dev-Link",
    color: "#06B6D4",
    bgColor: "bg-cyan-500/20",
    textColor: "text-cyan-400",
  },
];

const LOGO_URLS: Record<string, string> = {
  labs: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F85fe7910cff6483db1ea99c154684844?format=webp&width=800",
  gameforge:
    "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fcd3534c1caa0497abfd44224040c6059?format=webp&width=800",
  corp: "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fae654ecc18b241bdab273893e8231970?format=webp&width=800",
  foundation:
    "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2Fc02cb1bf5056479bbb3ea4bd91f0d472?format=webp&width=800",
  devlink:
    "https://cdn.builder.io/api/v1/image/assets%2Ffc53d607e21d497595ac97e0637001a1%2F9a96b43cbd7b49bb9d5434580319c793?format=webp&width=800",
};

// Mockup 1: Vertical Sidebar
function VerticalSidebarMockup() {
  return (
    <div className="flex h-[600px] gap-0 border border-border/40 rounded-xl overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-24 bg-gray-900/50 border-r border-border/40 flex flex-col items-center py-4 gap-3">
        {ARMS.map((arm) => (
          <button
            key={arm.id}
            className={`h-12 w-12 rounded-lg ${arm.bgColor} flex items-center justify-center hover:scale-110 transition-transform duration-200 group`}
          >
            <img
              src={LOGO_URLS[arm.id]}
              alt={arm.name}
              className="h-8 w-8 object-contain"
            />
            <div className="absolute left-24 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {arm.name}
            </div>
          </button>
        ))}
      </div>
      {/* Content Area */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        <h3 className="text-2xl font-bold mb-4">Vertical Sidebar</h3>
        <p className="text-muted-foreground max-w-xs">
          Fixed sidebar with arm icons on the left. Tooltips appear on hover. Good for consistent access but takes up screen width.
        </p>
      </div>
    </div>
  );
}

// Mockup 2: Horizontal Scrollable Carousel
function HorizontalCarouselMockup() {
  const [scrollPosition, setScrollPosition] = useState(0);

  return (
    <div className="flex flex-col h-[600px] border border-border/40 rounded-xl overflow-hidden bg-background">
      {/* Header with carousel */}
      <div className="bg-gray-900/50 border-b border-border/40 p-4 flex items-center gap-2">
        <button
          onClick={() =>
            setScrollPosition(Math.max(0, scrollPosition - 100))
          }
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex gap-3 pb-2" style={{ transform: `translateX(-${scrollPosition}px)` }}>
            {ARMS.map((arm) => (
              <button
                key={arm.id}
                className={`flex-shrink-0 h-12 w-12 rounded-lg ${arm.bgColor} flex items-center justify-center hover:scale-110 transition-transform duration-200`}
              >
                <img
                  src={LOGO_URLS[arm.id]}
                  alt={arm.name}
                  className="h-8 w-8 object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setScrollPosition(scrollPosition + 100)}
          className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      {/* Content Area */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        <h3 className="text-2xl font-bold mb-4">Horizontal Scrollable Carousel</h3>
        <p className="text-muted-foreground max-w-xs">
          Carousel with scroll arrows. Good use of horizontal space. Can show all arms at once on wider tablets.
        </p>
      </div>
    </div>
  );
}

// Mockup 3: Compact Horizontal Bar
function CompactHorizontalMockup() {
  return (
    <div className="flex flex-col h-[600px] border border-border/40 rounded-xl overflow-hidden bg-background">
      {/* Header with compact bar */}
      <div className="bg-gray-900/50 border-b border-border/40 p-4 flex items-center justify-center gap-2">
        {ARMS.map((arm) => (
          <button
            key={arm.id}
            className={`h-10 w-10 rounded-lg ${arm.bgColor} flex items-center justify-center hover:scale-110 transition-transform duration-200 group relative`}
          >
            <img
              src={LOGO_URLS[arm.id]}
              alt={arm.name}
              className="h-6 w-6 object-contain"
            />
            <div className="absolute top-full mt-2 px-2 py-1 bg-gray-900 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              {arm.name}
            </div>
          </button>
        ))}
      </div>
      {/* Content Area */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        <h3 className="text-2xl font-bold mb-4">Compact Horizontal Bar</h3>
        <p className="text-muted-foreground max-w-xs">
          Minimalist horizontal bar in header. All arms visible at once. Takes minimal vertical space. Best for standard tablet widths.
        </p>
      </div>
    </div>
  );
}

// Mockup 4: Grid Layout
function GridLayoutMockup() {
  return (
    <div className="flex flex-col h-[600px] border border-border/40 rounded-xl overflow-hidden bg-background">
      {/* Header with grid toggle */}
      <div className="bg-gray-900/50 border-b border-border/40 p-6">
        <div className="grid grid-cols-5 gap-4 max-w-sm mx-auto">
          {ARMS.map((arm) => (
            <button
              key={arm.id}
              className={`aspect-square rounded-lg ${arm.bgColor} flex flex-col items-center justify-center gap-2 hover:scale-110 transition-transform duration-200 group`}
            >
              <img
                src={LOGO_URLS[arm.id]}
                alt={arm.name}
                className="h-6 w-6 object-contain"
              />
              <span className="text-xs font-semibold text-white truncate">
                {arm.name}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Content Area */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        <h3 className="text-2xl font-bold mb-4">Grid Layout</h3>
        <p className="text-muted-foreground max-w-xs">
          Grid display for arm selection. Shows labels below each icon. Works well for modal or expandable menu.
        </p>
      </div>
    </div>
  );
}

// Mockup 5: Segmented Control
function SegmentedControlMockup() {
  const [active, setActive] = useState("labs");

  return (
    <div className="flex flex-col h-[600px] border border-border/40 rounded-xl overflow-hidden bg-background">
      {/* Header with segmented control */}
      <div className="bg-gray-900/50 border-b border-border/40 p-4 flex items-center justify-center">
        <div className="flex items-center gap-1 bg-gray-900 rounded-lg p-1">
          {ARMS.map((arm) => (
            <button
              key={arm.id}
              onClick={() => setActive(arm.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                active === arm.id
                  ? `${arm.bgColor} text-white border border-white/20`
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {arm.name}
            </button>
          ))}
        </div>
      </div>
      {/* Content Area */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        <h3 className="text-2xl font-bold mb-4">Segmented Control</h3>
        <p className="text-muted-foreground max-w-xs">
          Mobile-style segmented picker. Clearly shows active arm. Clean and familiar pattern. May overflow on smaller tablets.
        </p>
      </div>
    </div>
  );
}

// Mockup 6: Floating Pill Button
function FloatingPillMockup() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col h-[600px] border border-border/40 rounded-xl overflow-hidden bg-background relative">
      {/* Content Area */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
        <h3 className="text-2xl font-bold mb-4">Floating Pill Button</h3>
        <p className="text-muted-foreground max-w-xs">
          FAB-style floating button. Minimalist. Expands when clicked to show options. Doesn't take up header space.
        </p>
      </div>

      {/* Floating Pill */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center hover:scale-110 transition-transform duration-200 shadow-lg"
        >
          <span className="text-white font-bold text-xl">A</span>
        </button>

        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            {/* Pill Menu */}
            <div className="absolute bottom-20 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-full px-4 py-3 flex gap-2 shadow-2xl animate-in fade-in zoom-in-95">
              {ARMS.map((arm) => (
                <button
                  key={arm.id}
                  className={`h-10 w-10 rounded-full ${arm.bgColor} flex items-center justify-center hover:scale-110 transition-transform duration-200 group`}
                >
                  <img
                    src={LOGO_URLS[arm.id]}
                    alt={arm.name}
                    className="h-6 w-6 object-contain"
                  />
                  <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-900 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    {arm.name}
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function TabletArmMockups() {
  const mockups = [
    {
      id: 1,
      title: "Vertical Sidebar",
      component: VerticalSidebarMockup,
      pros: [
        "Always visible",
        "Takes minimal horizontal space",
        "Tooltips for labels",
      ],
      cons: ["Uses vertical header space", "Reduced content area"],
    },
    {
      id: 2,
      title: "Horizontal Scrollable Carousel",
      component: HorizontalCarouselMockup,
      pros: ["Scrollable", "All arms accessible", "Clean header"],
      cons: ["Needs scroll controls", "Not all visible at once"],
    },
    {
      id: 3,
      title: "Compact Horizontal Bar",
      component: CompactHorizontalMockup,
      pros: [
        "All arms visible",
        "Minimal space",
        "Clean aesthetic",
        "Works like desktop",
      ],
      cons: ["May crowd on very narrow tablets"],
    },
    {
      id: 4,
      title: "Grid Layout",
      component: GridLayoutMockup,
      pros: ["Shows labels", "Visual clarity", "Expandable"],
      cons: ["Takes more space", "Requires menu or modal"],
    },
    {
      id: 5,
      title: "Segmented Control",
      component: SegmentedControlMockup,
      pros: ["Familiar pattern", "Clear active state", "Mobile-friendly"],
      cons: ["May overflow on small tablets", "Less visual variety"],
    },
    {
      id: 6,
      title: "Floating Pill Button",
      component: FloatingPillMockup,
      pros: [
        "Doesn't take header space",
        "Minimalist",
        "Always accessible",
      ],
      cons: ["Hidden by default", "Overlaps content when open"],
    },
  ];

  return (
    <div className="min-h-screen bg-aethex-gradient py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Tablet Arm Switcher Mockups
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Six different navigation patterns for the arm switcher on tablet screens. Click through each mockup to see how they interact.
          </p>
        </div>

        <div className="space-y-12">
          {mockups.map((mockup) => {
            const Component = mockup.component;
            return (
              <div key={mockup.id} className="space-y-6">
                {/* Mockup Title */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">
                    {mockup.id}. {mockup.title}
                  </h2>
                </div>

                {/* Mockup Display */}
                <div className="flex justify-center">
                  <Component />
                </div>

                {/* Pros & Cons */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                    <h3 className="font-semibold text-green-400 mb-3">Pros</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {mockup.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                    <h3 className="font-semibold text-red-400 mb-3">Cons</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {mockup.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-400 mt-1">✗</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border/20" />
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-16 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-border/40 rounded-lg p-8 space-y-4">
          <h2 className="text-2xl font-bold">Recommendation</h2>
          <p className="text-muted-foreground">
            <strong className="text-white">Mockup #3: Compact Horizontal Bar</strong> is recommended for tablet sizes. It provides:
          </p>
          <ul className="space-y-2 text-muted-foreground list-disc list-inside">
            <li>All arm logos visible at once without scrolling</li>
            <li>Minimal header height (perfect for tablets in landscape)</li>
            <li>Consistent experience with desktop version</li>
            <li>Smooth transition between breakpoints</li>
            <li>Touch-friendly spacing and interactions</li>
          </ul>
          <p className="text-muted-foreground">
            This creates a natural progression: Mobile expandable logo → Tablet compact bar → Desktop full horizontal spacing.
          </p>
        </div>
      </div>
    </div>
  );
}
