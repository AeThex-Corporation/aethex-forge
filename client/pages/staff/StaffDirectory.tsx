import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { aethexToast } from "@/lib/aethex-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Mail, Phone, Briefcase } from "lucide-react";

interface StaffMember {
  id: string;
  full_name: string;
  email: string;
  role: string;
  department?: string;
  position?: string;
  avatar_url?: string;
  phone?: string;
}

export default function StaffDirectory() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<StaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/staff/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/staff/members");
        if (response.ok) {
          const data = await response.json();
          setStaffMembers(Array.isArray(data) ? data : []);
          setFilteredMembers(Array.isArray(data) ? data : []);
        } else {
          aethexToast.error({
            title: "Failed to load directory",
            description: "Could not fetch staff members",
          });
        }
      } catch (error) {
        console.error("Error fetching staff members:", error);
        aethexToast.error({
          title: "Error",
          description: "Failed to load staff directory",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchMembers();
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMembers(staffMembers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = staffMembers.filter(
        (member) =>
          member.full_name.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query) ||
          member.department?.toLowerCase().includes(query),
      );
      setFilteredMembers(filtered);
    }
  }, [searchQuery, staffMembers]);

  if (loading)
    return (
      <Layout>
        <div className="container py-20">Loading...</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Team Directory
            </h1>
            <p className="text-slate-400">
              Find and connect with AeThex team members
            </p>
          </div>

          {/* Search Bar */}
          <Card className="mb-8 border-slate-700/50 bg-slate-900/50 backdrop-blur">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search by name, email, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {isLoading ? (
            <div className="text-center py-12 text-slate-400">
              Loading team members...
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              No staff members found matching your search
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <Card
                  key={member.id}
                  className="border-slate-700/50 bg-slate-900/50 backdrop-blur hover:border-slate-600/50 transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white">
                          {member.full_name}
                        </CardTitle>
                        <p className="text-sm text-slate-400 mt-1">
                          {member.position || "Team Member"}
                        </p>
                      </div>
                      {member.role && (
                        <Badge className="bg-purple-500/30 text-purple-300 border-purple-500/50 capitalize">
                          {member.role}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <a
                        href={`mailto:${member.email}`}
                        className="hover:text-purple-400"
                      >
                        {member.email}
                      </a>
                    </div>
                    {member.phone && (
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <a
                          href={`tel:${member.phone}`}
                          className="hover:text-purple-400"
                        >
                          {member.phone}
                        </a>
                      </div>
                    )}
                    {member.department && (
                      <div className="flex items-center gap-2 text-slate-400 text-sm">
                        <Briefcase className="h-4 w-4 text-slate-500" />
                        <span>{member.department}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="mt-12 pt-8 border-t border-slate-700/50">
            <p className="text-center text-slate-400">
              Showing {filteredMembers.length} of {staffMembers.length} team
              members
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
