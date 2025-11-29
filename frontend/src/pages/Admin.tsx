import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { TeamsManagement } from "@/components/admin/TeamsManagement";
import { MatchesManagement } from "@/components/admin/MatchesManagement";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { SEOHead } from "@/components/layout/SEOHead";

export default function Admin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "pregled";
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Sync URL with tab state
  useEffect(() => {
    const urlTab = searchParams.get("tab") || "pregled";
    if (urlTab !== activeTab) {
      setActiveTab(urlTab);
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <>
      <SEOHead
        title="Admin Dashboard - District Padel"
        description="Administratorski panel za upravljanje ligom"
        keywords="admin, district padel, liga admin"
        canonicalUrl="https://districtpadel.rs/admin"
      />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Upravljanje ligom, timovima i mecevima</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Odjavi se
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pregled">Pregled lige</TabsTrigger>
            <TabsTrigger value="timovi">Timovi</TabsTrigger>
            <TabsTrigger value="utakmice">Mecevi</TabsTrigger>
          </TabsList>

          <TabsContent value="pregled" className="space-y-4">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="timovi" className="space-y-4">
            <TeamsManagement />
          </TabsContent>

          <TabsContent value="utakmice" className="space-y-4">
            <MatchesManagement />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
