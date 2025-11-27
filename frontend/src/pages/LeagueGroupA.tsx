import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOHead } from "@/components/layout/SEOHead";
import { useStandings } from "@/hooks/use-standings";

export default function LeagueGroupA() {
  const { data: standings = [], isLoading, error } = useStandings({ group: "A" });

  return (
    <>
      <SEOHead
        title="Grupa A - District Padel Liga | Tabela i Rezultati"
        description="Tabela i rezultati Grupe A u District Padel Ligi. Pratite najbolje timove u prvoj grupi padel lige Srbije."
        keywords="padel liga grupa a, padel tabela grupa a, district padel grupa a"
        canonicalUrl="https://districtpadel.rs/league/grupa-a"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Grupa A</span>
          </h1>
          <p className="text-lg text-muted-foreground">Tabela i statistika Grupe A</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Greška pri učitavanju tabele. Molimo pokušajte ponovo.
            </AlertDescription>
          </Alert>
        )}

        <div className="rounded-lg border border-border overflow-x-auto glass mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Poz</TableHead>
                <TableHead>Tim</TableHead>
                <TableHead className="text-center">Utakmice</TableHead>
                <TableHead className="text-center">Pobede</TableHead>
                <TableHead className="text-center">Porazi</TableHead>
                <TableHead className="text-center">Set razlika</TableHead>
                <TableHead className="text-center">Gem razlika</TableHead>
                <TableHead className="text-center font-bold">Bodovi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
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
              ) : standings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nema timova u Grupi A
                  </TableCell>
                </TableRow>
              ) : (
                standings.map((standing) => (
                  <TableRow key={standing.teamId} className="hover:bg-muted/50">
                    <TableCell className="font-bold">{standing.position}</TableCell>
                    <TableCell>
                      <Link
                        to={`/teams/${standing.teamId}`}
                        className="hover:text-primary transition-colors font-medium"
                      >
                        {standing.teamName}
                      </Link>
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

        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link to="/league">← Sve grupe</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/league/grupa-b">Grupa B →</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
