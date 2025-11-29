import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOHead } from "@/components/layout/SEOHead";
import { useStandings } from "@/hooks/use-standings";

export default function League() {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState<"A" | "B" | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: standings = [],
    isLoading,
    error,
  } = useStandings();

  const filteredStandings = useMemo(() => {
    return standings.filter((s) => {
      const matchesGroup = selectedGroup === "all" || s.group === selectedGroup;
      const matchesSearch = s.teamName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGroup && matchesSearch;
    });
  }, [standings, selectedGroup, searchQuery]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "District Padel League",
    description: "Naša lokalna padel liga u Srbiji",
    sport: "Padel",
  };

  return (
    <>
      <SEOHead
        title="Padel Liga Srbija - District Padel League | Tabela i Rezultati"
        description="Pratite najuzbudljiviju padel ligu u Srbiji. Pogledajte tabelu, rezultate, timove i statistike. District Padel League - gde se rađaju šampioni."
        keywords="padel liga srbija, padel liga, padel turnir, padel tabela, padel rezultati, district padel liga"
        canonicalUrl="https://districtpadel.rs/league"
        structuredData={structuredData}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">District Padel Liga</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Pratite tabelu, rezultate i statistike najboljih padel timova u Srbiji.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Pretraži timove..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedGroup === "all" ? "default" : "outline"}
              onClick={() => setSelectedGroup("all")}
            >
              Sve
            </Button>
            <Button
              variant={selectedGroup === "A" ? "default" : "outline"}
              onClick={() => setSelectedGroup("A")}
            >
              Grupa A
            </Button>
            <Button
              variant={selectedGroup === "B" ? "default" : "outline"}
              onClick={() => setSelectedGroup("B")}
            >
              Grupa B
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Greška pri učitavanju tabele. Molimo pokušajte ponovo.
            </AlertDescription>
          </Alert>
        )}

        <div className="rounded-lg border border-border overflow-x-auto glass">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Poz</TableHead>
                <TableHead>Tim</TableHead>
                <TableHead className="text-center">Grupa</TableHead>
                <TableHead className="text-center">Mecevi</TableHead>
                <TableHead className="text-center">Pobede</TableHead>
                <TableHead className="text-center">Porazi</TableHead>
                <TableHead className="text-center">Set razlika</TableHead>
                <TableHead className="text-center">Gem razlika</TableHead>
                <TableHead className="text-center font-bold">Bodovi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-8 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-8 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-8 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-8 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-12 mx-auto" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-8 mx-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredStandings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Nema timova za prikaz
                  </TableCell>
                </TableRow>
              ) : (
                filteredStandings.map((standing) => (
                  <TableRow 
                    key={standing.teamId} 
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => navigate(`/teams/${standing.teamId}`)}
                  >
                    <TableCell className="font-bold">{standing.position}</TableCell>
                    <TableCell>
                      <Link
                        to={`/teams/${standing.teamId}`}
                        className="text-primary hover:opacity-80 transition-opacity font-medium"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {standing.teamName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-block px-2 py-1 rounded bg-primary/20 text-primary text-xs font-semibold">
                        {standing.group}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">{standing.matchesPlayed}</TableCell>
                    <TableCell className="text-center text-win">{standing.matchesWon}</TableCell>
                    <TableCell className="text-center text-lose">{standing.matchesLost}</TableCell>
                    <TableCell className="text-center">
                      {standing.setDiff > 0 ? "+" : ""}
                      {standing.setDiff}
                    </TableCell>
                    <TableCell className="text-center">
                      {standing.gameDiff > 0 ? "+" : ""}
                      {standing.gameDiff}
                    </TableCell>
                    <TableCell className="text-center font-bold text-primary text-lg">
                      {standing.points}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" size="lg" asChild>
            <Link to="/league/grupa-a">Pogledaj Grupu A →</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/league/grupa-b">Pogledaj Grupu B →</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
