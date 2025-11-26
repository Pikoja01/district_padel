import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("timovi");

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Upravljanje ligom, timovima i utakmicama</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timovi">Timovi</TabsTrigger>
          <TabsTrigger value="utakmice">Utakmice</TabsTrigger>
          <TabsTrigger value="pregled">Pregled lige</TabsTrigger>
        </TabsList>

        <TabsContent value="timovi" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Timovi</h2>
            <Button className="gradient-hero">
              <Plus className="w-4 h-4 mr-2" />
              Dodaj tim
            </Button>
          </div>
          <Card className="glass p-8">
            <p className="text-muted-foreground text-center">
              Admin funkcionalnost za upravljanje timovima će biti dostupna uskoro.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="utakmice" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Utakmice</h2>
            <Button className="gradient-hero">
              <Plus className="w-4 h-4 mr-2" />
              Dodaj utakmicu
            </Button>
          </div>
          <Card className="glass p-8">
            <p className="text-muted-foreground text-center">
              Admin funkcionalnost za upravljanje utakmicama će biti dostupna uskoro.
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="pregled" className="space-y-4">
          <h2 className="text-2xl font-bold">Pregled lige</h2>
          <Card className="glass p-8">
            <p className="text-muted-foreground text-center">
              Pregled statistika lige će biti dostupan uskoro.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
