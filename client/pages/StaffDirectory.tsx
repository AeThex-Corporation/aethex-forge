import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

const STAFF_MEMBERS = [
  {
    id: 1,
    name: "John Founder",
    position: "Founder & CEO",
    department: "Executive",
    email: "john@aethex.dev",
    phone: "+1 (555) 123-4567",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
  {
    id: 2,
    name: "Sarah Dev",
    position: "CTO",
    department: "Engineering",
    email: "sarah@aethex.dev",
    phone: "+1 (555) 234-5678",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  },
  {
    id: 3,
    name: "Mike Operations",
    position: "Operations Manager",
    department: "Operations",
    email: "mike@aethex.dev",
    phone: "+1 (555) 345-6789",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
  },
  {
    id: 4,
    name: "Emma Design",
    position: "Design Lead",
    department: "Design",
    email: "emma@aethex.dev",
    phone: "+1 (555) 456-7890",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
  },
  {
    id: 5,
    name: "Alex Product",
    position: "Product Manager",
    department: "Product",
    email: "alex@aethex.dev",
    phone: "+1 (555) 567-8901",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
  },
  {
    id: 6,
    name: "Jordan Analyst",
    position: "Data Analyst",
    department: "Analytics",
    email: "jordan@aethex.dev",
    phone: "+1 (555) 678-9012",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jordan",
  },
];

export default function StaffDirectory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMembers = STAFF_MEMBERS.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900/20 to-slate-950 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Staff Directory
            </h1>
            <p className="text-gray-300 flex items-center gap-2">
              <Users className="w-4 h-4" />
              View and contact AeThex team members
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name, position, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900/50 border-purple-500/20 text-white placeholder:text-gray-500"
            />
          </div>

          {/* Results Summary */}
          <div className="text-sm text-gray-300">
            Showing {filteredMembers.length} of {STAFF_MEMBERS.length} staff
            members
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card
                key={member.id}
                className="bg-slate-900/50 border-purple-500/20 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
              >
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {/* Avatar and Name */}
                    <div className="flex items-start gap-4">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-16 h-16 rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-white">{member.name}</h3>
                        <p className="text-purple-400 text-sm">
                          {member.position}
                        </p>
                        <Badge
                          variant="outline"
                          className="mt-2 border-purple-500/30"
                        >
                          {member.department}
                        </Badge>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 pt-2 border-t border-purple-500/10">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Mail className="w-4 h-4 text-purple-400/50" />
                        <a
                          href={`mailto:${member.email}`}
                          className="text-purple-400 hover:underline"
                        >
                          {member.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Phone className="w-4 h-4 text-purple-400/50" />
                        {member.phone}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <Card className="bg-slate-900/50 border-purple-500/20">
              <CardContent className="pt-6 text-center py-12">
                <Users className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No staff members found</p>
              </CardContent>
            </Card>
          )}

          {/* Back Button */}
          <Button
            onClick={() => navigate("/staff/dashboard")}
            variant="outline"
            className="border-purple-500/30 hover:bg-purple-500/10"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </Layout>
  );
}
