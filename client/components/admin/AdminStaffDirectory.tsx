import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Search,
  Edit2,
  X,
  Trash2,
  Sparkles,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { aethexToast } from "@/lib/aethex-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// API Base URL for fetch requests
const API_BASE = import.meta.env.VITE_API_BASE || "";

interface TeamMember {
  id: string;
  user_id?: string;
  email: string;
  full_name: string;
  position?: string;
  department?: string;
  phone?: string;
  avatar_url?: string;
  role: "owner" | "admin" | "founder" | "staff" | "employee";
  is_active?: boolean;
  hired_date?: string;
  created_at?: string;
  updated_at?: string;
}

export default function AdminStaffDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState<TeamMember | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Fetch staff members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/api/staff/members`);
        if (!response.ok) throw new Error("Failed to fetch staff members");
        const data = await response.json();
        setTeamMembers(data || []);
      } catch (error) {
        console.error("Error fetching staff members:", error);
        aethexToast.error({
          title: "Failed to load staff members",
          description: error instanceof Error ? error.message : "Unknown error",
        });
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const response = await fetch(`${API_BASE}/api/staff/members/seed`);

      if (!response.ok) {
        throw new Error("Failed to seed data: " + response.statusText);
      }

      // Read response body as text first to avoid stream issues
      const text = await response.text();
      if (!text) {
        throw new Error("No response from server");
      }

      const result = JSON.parse(text);

      setTeamMembers(result.members || []);

      aethexToast.success({
        title: "Sample data created",
        description: `Added ${result.count} staff members. You can now edit them with your actual data.`,
      });
    } catch (error) {
      console.error("Error seeding data:", error);
      aethexToast.error({
        title: "Failed to seed data",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const filteredMembers = useMemo(() => {
    return teamMembers.filter(
      (member) =>
        member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member.position &&
          member.position.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (member.department &&
          member.department
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, teamMembers]);

  const getRoleBadgeColor = (role: TeamMember["role"]) => {
    const colors: Record<TeamMember["role"], string> = {
      owner:
        "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-200",
      admin: "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200",
      founder:
        "bg-pink-100 text-pink-900 dark:bg-pink-900/30 dark:text-pink-200",
      staff:
        "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-200",
      employee:
        "bg-gray-100 text-gray-900 dark:bg-gray-900/30 dark:text-gray-200",
    };
    return colors[role];
  };

  const handleEditClick = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({ ...member });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!formData || !editingMember) return;

    try {
      setIsSaving(true);
      const response = await fetch(
        `${API_BASE}/api/staff/members-detail?id=${editingMember.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            full_name: formData.full_name,
            email: formData.email,
            position: formData.position,
            department: formData.department,
            phone: formData.phone,
            location: formData.location,
            role: formData.role,
          }),
        },
      );

      const updatedMember = await response.json();

      if (!response.ok) {
        throw new Error(
          updatedMember.details || updatedMember.error || "Failed to save",
        );
      }

      setTeamMembers(
        teamMembers.map((m) => (m.id === updatedMember.id ? updatedMember : m)),
      );

      aethexToast.success({
        title: "Member updated",
        description: `${formData.full_name} has been saved.`,
      });

      setIsEditDialogOpen(false);
      setEditingMember(null);
      setFormData(null);
    } catch (error) {
      console.error("Error saving staff member:", error);
      aethexToast.error({
        title: "Failed to save",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (memberId: string, memberName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete ${memberName}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      const response = await fetch(
        `${API_BASE}/api/staff/members-detail?id=${memberId}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || result.error || "Failed to delete");
      }

      setTeamMembers(teamMembers.filter((m) => m.id !== memberId));

      aethexToast.success({
        title: "Member deleted",
        description: `${memberName} has been removed.`,
      });

      if (isEditDialogOpen && editingMember?.id === memberId) {
        setIsEditDialogOpen(false);
        setEditingMember(null);
      }
    } catch (error) {
      console.error("Error deleting staff member:", error);
      aethexToast.error({
        title: "Failed to delete",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormChange = (field: keyof TeamMember, value: string) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Team Directory</h2>
          <p className="text-muted-foreground">Loading staff members...</p>
        </div>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Team Directory</h2>
        <p className="text-muted-foreground">
          {teamMembers.length} staff members · Manage team information
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, position, department, or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {teamMembers.length === 0 && !loading ? (
        <Card className="text-center py-12">
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              No staff members yet. Start with sample data to get started.
            </p>
            <Button
              onClick={handleSeedData}
              disabled={isSeeding}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isSeeding
                ? "Creating sample data..."
                : "Initialize with Sample Data"}
            </Button>
            <p className="text-xs text-muted-foreground">
              This creates 8 sample team members that you can edit to match your
              actual team.
            </p>
          </CardContent>
        </Card>
      ) : filteredMembers.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <Card
              key={member.id}
              className="hover:shadow-lg transition flex flex-col"
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {member.full_name}
                    </CardTitle>
                    <CardDescription className="font-medium mt-1">
                      {member.position || "Position not set"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Badge className={getRoleBadgeColor(member.role)}>
                      {member.role}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleEditClick(member)}
                      title="Edit member"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {member.department || "Department not set"}
                </div>
              </CardHeader>
              <CardContent className="space-y-3 flex-1">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <a
                    href={`mailto:${member.email}`}
                    className="hover:underline break-all"
                  >
                    {member.email}
                  </a>
                </div>
                {member.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <a href={`tel:${member.phone}`} className="hover:underline">
                      {member.phone}
                    </a>
                  </div>
                )}
                {member.location && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    <span>{member.location}</span>
                  </div>
                )}
                {member.hired_date && (
                  <div className="text-xs text-muted-foreground">
                    Hired: {new Date(member.hired_date).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : teamMembers.length > 0 ? (
        <Card className="text-center py-8">
          <p className="text-muted-foreground">
            No team members match your search
          </p>
        </Card>
      ) : null}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update member information and save changes
            </DialogDescription>
          </DialogHeader>

          {formData && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={formData.full_name}
                  onChange={(e) =>
                    handleFormChange("full_name", e.target.value)
                  }
                  placeholder="Full name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Position</label>
                <Input
                  value={formData.position || ""}
                  onChange={(e) => handleFormChange("position", e.target.value)}
                  placeholder="Job title"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <Input
                  value={formData.department || ""}
                  onChange={(e) =>
                    handleFormChange("department", e.target.value)
                  }
                  placeholder="Department name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={formData.phone || ""}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                  placeholder="Phone number"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={formData.location || ""}
                  onChange={(e) => handleFormChange("location", e.target.value)}
                  placeholder="City, State or office location"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    handleFormChange(
                      "role",
                      e.target.value as TeamMember["role"],
                    )
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                >
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                  <option value="founder">Founder</option>
                  <option value="staff">Staff</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="destructive"
              onClick={() => {
                if (editingMember) {
                  handleDelete(editingMember.id, editingMember.full_name);
                }
              }}
              disabled={isSaving || isDeleting}
              className="mr-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSaving}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
