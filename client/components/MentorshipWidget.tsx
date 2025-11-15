import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  CheckCircle,
  Clock,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

export interface Mentor {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  avatar_url?: string;
  specialties?: string[];
}

export interface MentorshipStatus {
  id: string;
  type: "mentee" | "mentor";
  status: "active" | "paused" | "completed";
  mentee?: Mentor;
  mentor?: Mentor;
  start_date?: string;
  end_date?: string;
  sessions_completed?: number;
  next_session?: string;
}

interface MentorshipWidgetProps {
  mentorship: MentorshipStatus | null;
  title?: string;
  description?: string;
  onRequestMentor?: () => void;
  onScheduleSession?: () => void;
  onViewProfile?: () => void;
  accentColor?: "red" | "blue" | "purple";
}

const colorMap = {
  red: {
    bg: "bg-gradient-to-br from-red-950/40 to-red-900/20",
    border: "border-red-500/20",
  },
  blue: {
    bg: "bg-gradient-to-br from-blue-950/40 to-blue-900/20",
    border: "border-blue-500/20",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-950/40 to-purple-900/20",
    border: "border-purple-500/20",
  },
};

export function MentorshipWidget({
  mentorship,
  title = "My Mentorship",
  description = "Connect with experienced mentors",
  onRequestMentor,
  onScheduleSession,
  onViewProfile,
  accentColor = "red",
}: MentorshipWidgetProps) {
  const colors = colorMap[accentColor];
  const person =
    mentorship?.type === "mentor" ? mentorship.mentor : mentorship?.mentee;

  if (!mentorship) {
    return (
      <Card className={`${colors.bg} border ${colors.border}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <Users className="h-12 w-12 mx-auto text-gray-500 opacity-50" />
            <div>
              <p className="text-gray-400 mb-2">No active mentorship</p>
              <p className="text-sm text-gray-500 mb-4">
                {title.includes("Mentorship")
                  ? "Connect with an experienced mentor or become one yourself"
                  : ""}
              </p>
            </div>
            {onRequestMentor && (
              <Button
                onClick={onRequestMentor}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
              >
                <Users className="h-4 w-4 mr-2" />
                Request a Mentor
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${colors.bg} border ${colors.border}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          {mentorship.type === "mentor"
            ? "Mentoring someone"
            : "Being mentored by"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Badge */}
        <div>
          <Badge
            className={
              mentorship.status === "active"
                ? "bg-green-600/50 text-green-100"
                : mentorship.status === "paused"
                  ? "bg-yellow-600/50 text-yellow-100"
                  : "bg-gray-600/50 text-gray-100"
            }
          >
            {mentorship.status === "active" ? "🟢" : "⏸"}{" "}
            {mentorship.status.charAt(0).toUpperCase() +
              mentorship.status.slice(1)}
          </Badge>
        </div>

        {/* Person Card */}
        {person && (
          <div className="p-4 bg-black/30 rounded-lg border border-gray-500/10 space-y-4">
            {/* Profile */}
            <div className="flex items-start gap-4">
              {person.avatar_url && (
                <img
                  src={person.avatar_url}
                  alt={person.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white">{person.name}</h3>
                {person.title && (
                  <p className="text-sm text-gray-400">{person.title}</p>
                )}
                {person.bio && (
                  <p className="text-xs text-gray-500 mt-2">{person.bio}</p>
                )}
              </div>
            </div>

            {/* Specialties */}
            {person.specialties && person.specialties.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-300 uppercase">
                  Specialties
                </p>
                <div className="flex gap-1 flex-wrap">
                  {person.specialties.slice(0, 4).map((specialty) => (
                    <Badge
                      key={specialty}
                      className="bg-gray-600/30 text-gray-200 text-xs"
                    >
                      {specialty}
                    </Badge>
                  ))}
                  {person.specialties.length > 4 && (
                    <Badge className="bg-gray-600/30 text-gray-200 text-xs">
                      +{person.specialties.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Session Info */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-black/20 rounded-lg">
          {mentorship.sessions_completed !== undefined && (
            <div className="text-center">
              <p className="text-xs text-gray-400">Sessions</p>
              <p className="text-lg font-bold text-white">
                {mentorship.sessions_completed}
              </p>
            </div>
          )}
          {mentorship.next_session && (
            <div className="text-center">
              <p className="text-xs text-gray-400">Next Session</p>
              <p className="text-sm font-semibold text-white">
                {new Date(mentorship.next_session).toLocaleDateString()}
              </p>
            </div>
          )}
          {mentorship.start_date && (
            <div className="text-center">
              <p className="text-xs text-gray-400">Started</p>
              <p className="text-sm font-semibold text-white">
                {new Date(mentorship.start_date).toLocaleDateString()}
              </p>
            </div>
          )}
          {mentorship.end_date && (
            <div className="text-center">
              <p className="text-xs text-gray-400">Ends</p>
              <p className="text-sm font-semibold text-white">
                {new Date(mentorship.end_date).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          {onScheduleSession && (
            <Button
              onClick={onScheduleSession}
              className="bg-blue-600 hover:bg-blue-700 text-sm"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Schedule
            </Button>
          )}
          {onViewProfile && (
            <Button
              onClick={onViewProfile}
              variant="outline"
              className="border-gray-500/20 text-gray-300 hover:bg-gray-500/10 text-sm"
            >
              View Profile
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          )}
          <Button
            variant="outline"
            className="border-gray-500/20 text-gray-300 hover:bg-gray-500/10 text-sm"
          >
            <MessageCircle className="h-3 w-3 mr-1" />
            Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default MentorshipWidget;
