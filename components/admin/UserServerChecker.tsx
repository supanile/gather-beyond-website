"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Server, ExternalLink } from "lucide-react";

interface ServerInfo {
  serverId: string;
  serverName: string;
}

interface UserServerResponse {
  discordId: string;
  server: ServerInfo[];
}

interface ApiResponse {
  discordId: string;
  server: ServerInfo[];
}

export function UserServerChecker() {
  const [searchInput, setSearchInput] = useState("");
  const [userData, setUserData] = useState<UserServerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setError("กรุณากรอก Discord ID");
      return;
    }

    setLoading(true);
    setError(null);
    setUserData(null);

    try {
      // ใช้ dynamic route สำหรับ Discord ID
      const url = `/api/discord/checkuser/${encodeURIComponent(searchInput)}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setUserData(data);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการค้นหา");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            เช็ค User ใน Discord Servers
          </CardTitle>
          <CardDescription>
            ค้นหาว่า user อยู่ใน Discord server ไหนบ้างผ่านข้อมูลใน Grist
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="กรอก Discord ID"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? "กำลังค้นหา..." : "ค้นหา"}
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {userData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              ข้อมูล User
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Discord ID</p>
                <p className="text-sm font-mono">{userData.discordId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Servers Joined</p>
                <p className="text-sm">{userData.server.length}</p>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-2 mb-4">
                <Server className="h-5 w-5" />
                <h3 className="text-lg font-semibold">
                  Discord Servers ({userData.server.length})
                </h3>
              </div>

              {userData.server.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Server className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>User ไม่ได้เป็นสมาชิกใน Discord server ใดเลย</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userData.server.map((server: ServerInfo) => (
                    <Card key={server.serverId} className="p-4 border-green-200 bg-green-50">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Server className="h-6 w-6 text-gray-500" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{server.serverName}</h4>
                            <Badge variant="default" className="bg-green-600">
                              ✓ Member
                            </Badge>
                          </div>

                          <p className="text-xs text-muted-foreground mt-2">
                            ID: {server.serverId}
                          </p>
                        </div>

                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={`https://discord.com/channels/${server.serverId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
