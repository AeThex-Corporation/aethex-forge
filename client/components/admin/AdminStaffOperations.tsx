import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

interface Report {
  id: string;
  type: string;
  reporter: string;
  subject: string;
  status: "open" | "in-review" | "resolved";
  severity: "low" | "medium" | "high" | "critical";
  reportedAt: string;
}

interface MentorshipRequest {
  id: string;
  mentee: string;
  mentor: string;
  status: "pending" | "accepted" | "completed";
  topic: string;
  requestedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  joinedAt: string;
  lastActive: string;
}

export default function AdminStaffOperations() {
  const [operationTab, setOperationTab] = useState("overview");

  const reports: Report[] = [
    {
      id: "1",
      type: "Content Violation",
      reporter: "Sam Patel",
      subject: "Inappropriate post in #general",
      status: "in-review",
      severity: "high",
      reportedAt: "2024-01-15 10:30",
    },
    {
      id: "2",
      type: "User Conduct",
      reporter: "Taylor Kim",
      subject: "Harassment in mentorship session",
      status: "open",
      severity: "critical",
      reportedAt: "2024-01-15 14:20",
    },
    {
      id: "3",
      type: "Content Violation",
      reporter: "Jordan Martinez",
      subject: "Spam in #opportunities",
      status: "resolved",
      severity: "low",
      reportedAt: "2024-01-14 11:45",
    },
  ];

  const mentorshipRequests: MentorshipRequest[] = [
    {
      id: "1",
      mentee: "Alex Kim",
      mentor: "Jordan Martinez",
      status: "accepted",
      topic: "Advanced React Patterns",
      requestedAt: "2024-01-10",
    },
    {
      id: "2",
      mentee: "Casey Zhang",
      mentor: "Sam Patel",
      status: "pending",
      topic: "Community Building",
      requestedAt: "2024-01-15",
    },
    {
      id: "3",
      mentee: "Morgan Lee",
      mentor: "Taylor Kim",
      status: "completed",
      topic: "Operations Management",
      requestedAt: "2024-01-01",
    },
  ];

  const users: User[] = [
    {
      id: "1",
      name: "Alex Chen",
      email: "alex@aethex.dev",
      status: "active",
      joinedAt: "2023-01-01",
      lastActive: "2 minutes ago",
    },
    {
      id: "2",
      name: "Jordan Martinez",
      email: "jordan@aethex.dev",
      status: "active",
      joinedAt: "2023-02-15",
      lastActive: "1 hour ago",
    },
    {
      id: "3",
      name: "Sam Patel",
      email: "sam@aethex.dev",
      status: "active",
      joinedAt: "2023-06-01",
      lastActive: "3 hours ago",
    },
    {
      id: "4",
      name: "Casey Zhang",
      email: "casey@aethex.dev",
      status: "pending",
      joinedAt: "2024-01-10",
      lastActive: "Never",
    },
  ];

  const getSeverityColor = (severity: Report["severity"]) => {
    const colors: Record<Report["severity"], string> = {
      low: "bg-green-100 text-green-900 dark:bg-green-900/30",
      medium: "bg-yellow-100 text-yellow-900 dark:bg-yellow-900/30",
      high: "bg-orange-100 text-orange-900 dark:bg-orange-900/30",
      critical: "bg-red-100 text-red-900 dark:bg-red-900/30",
    };
    return colors[severity];
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      open: <AlertCircle className="w-4 h-4 text-red-500" />,
      "in-review": <Clock className="w-4 h-4 text-yellow-500" />,
      resolved: <CheckCircle2 className="w-4 h-4 text-green-500" />,
      pending: <Clock className="w-4 h-4 text-yellow-500" />,
      accepted: <CheckCircle2 className="w-4 h-4 text-green-500" />,
      completed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    };
    return icons[status];
  };

  const stats = [
    { label: "Active Users", value: 3, icon: Users },
    { label: "Open Reports", value: 2, icon: AlertCircle },
    { label: "Pending Requests", value: 1, icon: Clock },
    { label: "Completion Rate", value: "92%", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Operations Dashboard</h2>
        <p className="text-muted-foreground">
          Moderation, mentorship, and user management
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <stat.icon className="w-4 h-4" />
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs
        value={operationTab}
        onValueChange={setOperationTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>
                Overall platform health and activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/10 rounded-lg">
                <p className="font-medium text-green-900 dark:text-green-200">
                  ✓ All systems operational
                </p>
                <p className="text-sm text-green-800 dark:text-green-300 mt-1">
                  API response time: 45ms | Uptime: 99.98%
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 border border-border/40 rounded-lg">
                  <p className="text-muted-foreground">Active Sessions</p>
                  <p className="text-xl font-bold">127</p>
                </div>
                <div className="p-3 border border-border/40 rounded-lg">
                  <p className="text-muted-foreground">Daily Active Users</p>
                  <p className="text-xl font-bold">342</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Moderation Tab */}
        <TabsContent value="moderation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports & Moderation</CardTitle>
              <CardDescription>
                Community reports and moderation actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 border border-border/40 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status)}
                      <div>
                        <p className="font-medium">{report.type}</p>
                        <p className="text-sm text-muted-foreground">
                          Reported by {report.reporter}
                        </p>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(report.severity)}>
                      {report.severity}
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">{report.subject}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{report.reportedAt}</span>
                    <Badge variant="outline">{report.status}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mentorship Tab */}
        <TabsContent value="mentorship" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mentorship Program</CardTitle>
              <CardDescription>
                Track mentorship requests and matches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {mentorshipRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 border border-border/40 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">
                        {req.mentee} → {req.mentor}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {req.topic}
                      </p>
                    </div>
                    <Badge variant="outline">{req.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Requested {req.requestedAt}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Current user status and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="p-3 border border-border/40 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <div className="text-right text-xs">
                      <Badge variant="outline">{user.status}</Badge>
                      <p className="text-muted-foreground mt-1">
                        {user.lastActive}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
