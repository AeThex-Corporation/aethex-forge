import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Search } from "lucide-react";
import { useState, useMemo } from "react";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  role: "owner" | "admin" | "founder" | "staff" | "employee";
  avatar?: string;
}

export default function AdminStaffDirectory() {
  const [searchQuery, setSearchQuery] = useState("");

  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Alex Chen",
      position: "CEO & Founder",
      department: "Executive",
      email: "alex@aethex.dev",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      role: "owner",
    },
    {
      id: "2",
      name: "Jordan Martinez",
      position: "CTO",
      department: "Engineering",
      email: "jordan@aethex.dev",
      phone: "+1 (555) 234-5678",
      location: "Austin, TX",
      role: "admin",
    },
    {
      id: "3",
      name: "Sam Patel",
      position: "Community Manager",
      department: "Community",
      email: "sam@aethex.dev",
      phone: "+1 (555) 345-6789",
      location: "Remote",
      role: "staff",
    },
    {
      id: "4",
      name: "Taylor Kim",
      position: "Operations Lead",
      department: "Operations",
      email: "taylor@aethex.dev",
      phone: "+1 (555) 456-7890",
      location: "New York, NY",
      role: "staff",
    },
  ];

  const filteredMembers = useMemo(() => {
    return teamMembers.filter(
      (member) =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const getRoleBadgeColor = (role: TeamMember["role"]) => {
    const colors: Record<TeamMember["role"], string> = {
      owner: "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-200",
      admin: "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-200",
      founder: "bg-pink-100 text-pink-900 dark:bg-pink-900/30 dark:text-pink-200",
      staff: "bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-200",
      employee: "bg-gray-100 text-gray-900 dark:bg-gray-900/30 dark:text-gray-200",
    };
    return colors[role];
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Team Directory</h2>
        <p className="text-muted-foreground">
          AeThex staff members and contractors
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, position, or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-lg transition">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription className="font-medium mt-1">
                    {member.position}
                  </CardDescription>
                </div>
                <Badge className={getRoleBadgeColor(member.role)}>
                  {member.role}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {member.department}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-blue-500" />
                <a href={`mailto:${member.email}`} className="hover:underline break-all">
                  {member.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-green-500" />
                <a href={`tel:${member.phone}`} className="hover:underline">
                  {member.phone}
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>{member.location}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <Card className="text-center py-8">
          <p className="text-muted-foreground">
            No team members match your search
          </p>
        </Card>
      )}
    </div>
  );
}
