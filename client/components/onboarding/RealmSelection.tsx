import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface RealmSelectionProps {
  selectedRealm: string;
  onSelect: (realm: string) => void;
  onNext: () => void;
}

const REALMS = [
  {
    id: "labs",
    title: "🧪 Labs",
    description:
      "Research & Development - Cutting-edge innovation and experimentation",
    color: "from-yellow-500/20 to-yellow-600/20",
    borderColor: "border-yellow-400",
  },
  {
    id: "gameforge",
    title: "🎮 GameForge",
    description: "Game Development - Fast shipping cycles and game creation",
    color: "from-green-500/20 to-green-600/20",
    borderColor: "border-green-400",
  },
  {
    id: "corp",
    title: "💼 Corp",
    description: "Enterprise Solutions - Professional services and consulting",
    color: "from-blue-500/20 to-blue-600/20",
    borderColor: "border-blue-400",
  },
  {
    id: "foundation",
    title: "🤝 Foundation",
    description: "Community & Education - Open source and learning",
    color: "from-red-500/20 to-red-600/20",
    borderColor: "border-red-400",
  },
  {
    id: "devlink",
    title: "💻 Dev-Link",
    description: "Professional Networking - Career development platform",
    color: "from-cyan-500/20 to-cyan-600/20",
    borderColor: "border-cyan-400",
  },
];

export default function RealmSelection({
  selectedRealm,
  onSelect,
  onNext,
}: RealmSelectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Choose Your Primary Realm
        </h2>
        <p className="text-gray-400">
          Select the AeThex realm that best matches your primary focus. You can
          always change this later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REALMS.map((realm) => (
          <div
            key={realm.id}
            onClick={() => onSelect(realm.id)}
            className={`cursor-pointer transition-all duration-200 transform hover:scale-105 ${
              selectedRealm === realm.id ? "scale-105" : ""
            }`}
          >
            <Card
              className={`h-full border-2 ${realm.borderColor} ${
                selectedRealm === realm.id
                  ? "ring-2 ring-offset-2 ring-white"
                  : ""
              } hover:shadow-lg transition-shadow`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{realm.title}</CardTitle>
                  </div>
                  {selectedRealm === realm.id && (
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {realm.description}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-8">
        <div />
        <Button
          onClick={onNext}
          disabled={!selectedRealm}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
