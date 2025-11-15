import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Search, Phone, Mail, MapPin } from "lucide-react";

export interface DirectoryMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  email?: string;
  phone?: string;
  location?: string;
  avatar_url?: string;
  employment_type: "employee" | "contractor";
}

interface DirectoryWidgetProps {
  members: DirectoryMember[];
  title?: string;
  description?: string;
  showEmployeeOnly?: boolean;
  showContractorOnly?: boolean;
}

export function DirectoryWidget({
  members,
  title = "Team Directory",
  description = "Find team members and contact information",
  showEmployeeOnly = false,
  showContractorOnly = false,
}: DirectoryWidgetProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department?.toLowerCase().includes(searchQuery.toLowerCase());

    if (showEmployeeOnly) {
      return matchesSearch && member.employment_type === "employee";
    }
    if (showContractorOnly) {
      return matchesSearch && member.employment_type === "contractor";
    }
    return matchesSearch;
  });

  const employeeCount = members.filter(
    (m) => m.employment_type === "employee",
  ).length;
  const contractorCount = members.filter(
    (m) => m.employment_type === "contractor",
  ).length;

  return (
    <Card className="bg-gradient-to-br from-purple-950/40 to-purple-900/20 border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-black/20 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-gray-400">Employees</p>
            <p className="text-lg font-bold text-white">{employeeCount}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-400">Contractors</p>
            <p className="text-lg font-bold text-orange-400">
              {contractorCount}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name, role, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-black/30 border-gray-500/20"
          />
        </div>

        {/* Members List */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-8 w-8 mx-auto text-gray-500 opacity-50 mb-2" />
            <p className="text-gray-400 text-sm">No members found</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="p-3 bg-black/30 rounded-lg border border-gray-500/10 hover:border-gray-500/30 transition space-y-2"
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={member.name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-white">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white truncate">
                      {member.name}
                    </h4>
                    <p className="text-xs text-gray-400">{member.role}</p>
                    {member.department && (
                      <p className="text-xs text-gray-500">
                        {member.department}
                      </p>
                    )}
                  </div>

                  <Badge
                    className={
                      member.employment_type === "employee"
                        ? "bg-blue-600/50 text-blue-100 text-xs"
                        : "bg-orange-600/50 text-orange-100 text-xs"
                    }
                  >
                    {member.employment_type}
                  </Badge>
                </div>

                {/* Contact Info */}
                <div className="space-y-1 text-xs text-gray-400 pt-2 border-t border-gray-500/10">
                  {member.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  {member.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>{member.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DirectoryWidget;
