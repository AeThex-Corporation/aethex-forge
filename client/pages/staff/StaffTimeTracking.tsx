import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Clock,
  Play,
  Square,
  Plus,
  Loader2,
  Calendar,
  Timer,
  DollarSign,
  Trash2,
  Edit,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { aethexToast } from "@/components/ui/aethex-toast";

interface Project {
  id: string;
  name: string;
}

interface TimeEntry {
  id: string;
  description: string;
  date: string;
  start_time?: string;
  end_time?: string;
  duration_minutes: number;
  is_billable: boolean;
  status: string;
  notes?: string;
  project?: Project;
  task?: { id: string; title: string };
}

interface Stats {
  totalHours: number;
  billableHours: number;
  entriesCount: number;
  avgHoursPerDay: number;
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const formatTime = (time?: string) => {
  if (!time) return "-";
  return time.substring(0, 5);
};

export default function StaffTimeTracking() {
  const { session } = useAuth();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Stats>({ totalHours: 0, billableHours: 0, entriesCount: 0, avgHoursPerDay: 0 });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("week");
  const [activeTimer, setActiveTimer] = useState<TimeEntry | null>(null);

  // Dialog states
  const [createDialog, setCreateDialog] = useState(false);
  const [editEntry, setEditEntry] = useState<TimeEntry | null>(null);

  // Form state
  const [newEntry, setNewEntry] = useState({
    project_id: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    start_time: "",
    end_time: "",
    duration_minutes: 0,
    is_billable: true,
    notes: ""
  });

  useEffect(() => {
    if (session?.access_token) {
      fetchEntries();
    }
  }, [session?.access_token, view]);

  // Check for running timer
  useEffect(() => {
    const running = entries.find(e => e.start_time && !e.end_time && e.duration_minutes === 0);
    setActiveTimer(running || null);
  }, [entries]);

  const fetchEntries = async () => {
    try {
      const res = await fetch(`/api/staff/time-tracking?view=${view}`, {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setEntries(data.entries || []);
        setProjects(data.projects || []);
        setStats(data.stats || { totalHours: 0, billableHours: 0, entriesCount: 0, avgHoursPerDay: 0 });
      }
    } catch (err) {
      aethexToast.error("Failed to load time entries");
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async () => {
    if (!newEntry.description && !newEntry.project_id) {
      aethexToast.error("Please add a description or project");
      return;
    }

    // Calculate duration from times if provided
    let duration = newEntry.duration_minutes;
    if (newEntry.start_time && newEntry.end_time) {
      const [sh, sm] = newEntry.start_time.split(":").map(Number);
      const [eh, em] = newEntry.end_time.split(":").map(Number);
      duration = (eh * 60 + em) - (sh * 60 + sm);
    }

    try {
      const res = await fetch("/api/staff/time-tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          action: "create_entry",
          ...newEntry,
          duration_minutes: duration
        }),
      });
      if (res.ok) {
        aethexToast.success("Time entry created!");
        setCreateDialog(false);
        resetForm();
        fetchEntries();
      }
    } catch (err) {
      aethexToast.error("Failed to create entry");
    }
  };

  const startTimer = async () => {
    try {
      const res = await fetch("/api/staff/time-tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          action: "start_timer",
          description: "Time tracking"
        }),
      });
      if (res.ok) {
        aethexToast.success("Timer started!");
        fetchEntries();
      }
    } catch (err) {
      aethexToast.error("Failed to start timer");
    }
  };

  const stopTimer = async () => {
    if (!activeTimer) return;
    try {
      const res = await fetch("/api/staff/time-tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          action: "stop_timer",
          entry_id: activeTimer.id
        }),
      });
      if (res.ok) {
        aethexToast.success("Timer stopped!");
        fetchEntries();
      }
    } catch (err) {
      aethexToast.error("Failed to stop timer");
    }
  };

  const deleteEntry = async (entryId: string) => {
    if (!confirm("Delete this time entry?")) return;
    try {
      const res = await fetch(`/api/staff/time-tracking?id=${entryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (res.ok) {
        aethexToast.success("Entry deleted");
        fetchEntries();
      }
    } catch (err) {
      aethexToast.error("Failed to delete entry");
    }
  };

  const resetForm = () => {
    setNewEntry({
      project_id: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      start_time: "",
      end_time: "",
      duration_minutes: 0,
      is_billable: true,
      notes: ""
    });
  };

  // Group entries by date
  const groupedEntries = entries.reduce((groups, entry) => {
    const date = entry.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, TimeEntry[]>);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO title="Time Tracking" description="Track your work hours and projects" />

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10">
          <div className="container mx-auto max-w-6xl px-4 py-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
                  <Clock className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold text-blue-100">Time Tracking</h1>
                  <p className="text-blue-200/70 text-sm sm:text-base">Track your work hours and projects</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeTimer ? (
                  <Button
                    className="bg-red-600 hover:bg-red-700 flex-1 sm:flex-none"
                    onClick={stopTimer}
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop Timer
                  </Button>
                ) : (
                  <Button
                    className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
                    onClick={startTimer}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Timer
                  </Button>
                )}
                <Button
                  className="bg-blue-600 hover:bg-blue-700 flex-1 sm:flex-none"
                  onClick={() => setCreateDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-blue-950/30 border-blue-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-200/70">Total Hours</p>
                      <p className="text-3xl font-bold text-blue-100">{stats.totalHours}</p>
                    </div>
                    <Timer className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-950/30 border-blue-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-200/70">Billable</p>
                      <p className="text-3xl font-bold text-blue-100">{stats.billableHours}h</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-950/30 border-blue-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-200/70">Entries</p>
                      <p className="text-3xl font-bold text-blue-100">{stats.entriesCount}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-950/30 border-blue-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-200/70">Avg/Day</p>
                      <p className="text-3xl font-bold text-blue-100">{stats.avgHoursPerDay}h</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 mb-8">
              {["week", "month", "all"].map((v) => (
                <Button
                  key={v}
                  variant={view === v ? "default" : "outline"}
                  size="sm"
                  onClick={() => setView(v)}
                  className={view === v ? "bg-blue-600 hover:bg-blue-700" : "border-blue-500/30 text-blue-300"}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Button>
              ))}
            </div>

            {/* Active Timer Banner */}
            {activeTimer && (
              <Card className="bg-green-950/30 border-green-500/30 mb-8">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Clock className="h-8 w-8 text-green-400" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      </div>
                      <div>
                        <p className="text-green-100 font-semibold">Timer Running</p>
                        <p className="text-green-200/70 text-sm">
                          Started at {formatTime(activeTimer.start_time)} • {activeTimer.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      className="bg-red-600 hover:bg-red-700"
                      onClick={stopTimer}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Stop
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Time Entries by Date */}
            <div className="space-y-6">
              {Object.entries(groupedEntries).map(([date, dayEntries]) => (
                <div key={date}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-blue-100">
                      {new Date(date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                    </h3>
                    <span className="text-sm text-blue-300">
                      {formatDuration(dayEntries.reduce((sum, e) => sum + e.duration_minutes, 0))}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {dayEntries.map((entry) => (
                      <Card key={entry.id} className="bg-slate-800/50 border-slate-700/50 hover:border-blue-500/50 transition-all">
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="text-center w-20">
                                <p className="text-xl font-bold text-blue-300">
                                  {formatDuration(entry.duration_minutes)}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                                </p>
                              </div>
                              <div className="flex-1">
                                <p className="text-slate-200">{entry.description || "No description"}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {entry.project && (
                                    <Badge className="bg-blue-500/20 text-blue-300 text-xs">
                                      {entry.project.name}
                                    </Badge>
                                  )}
                                  {entry.is_billable && (
                                    <Badge className="bg-green-500/20 text-green-300 text-xs">
                                      Billable
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            {entry.status === "draft" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                onClick={() => deleteEntry(entry.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {entries.length === 0 && (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No time entries for this period</p>
                <Button
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={() => setCreateDialog(true)}
                >
                  Add Your First Entry
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Entry Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-blue-100">Add Time Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="What did you work on?"
              value={newEntry.description}
              onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
            <Select
              value={newEntry.project_id}
              onValueChange={(v) => setNewEntry({ ...newEntry, project_id: v })}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-100">
                <SelectValue placeholder="Select project (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No project</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Date</label>
                <Input
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Start Time</label>
                <Input
                  type="time"
                  value={newEntry.start_time}
                  onChange={(e) => setNewEntry({ ...newEntry, start_time: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">End Time</label>
                <Input
                  type="time"
                  value={newEntry.end_time}
                  onChange={(e) => setNewEntry({ ...newEntry, end_time: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Duration (minutes)</label>
                <Input
                  type="number"
                  placeholder="Or enter duration directly"
                  value={newEntry.duration_minutes || ""}
                  onChange={(e) => setNewEntry({ ...newEntry, duration_minutes: parseInt(e.target.value) || 0 })}
                  className="bg-slate-700 border-slate-600 text-slate-100"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newEntry.is_billable}
                    onChange={(e) => setNewEntry({ ...newEntry, is_billable: e.target.checked })}
                    className="w-4 h-4"
                  />
                  Billable
                </label>
              </div>
            </div>
            <Textarea
              placeholder="Notes (optional)"
              value={newEntry.notes}
              onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
              className="bg-slate-700 border-slate-600 text-slate-100"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setCreateDialog(false); resetForm(); }}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={createEntry}>
                Add Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
