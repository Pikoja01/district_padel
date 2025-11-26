import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/layout/SEOHead";
import { teams } from "@/data/teams";
import { matches } from "@/data/matches";
import { calculateStandings } from "@/utils/calculateStandings";

export default function LeagueGroupB() {
  const standings = useMemo(
    () => calculateStandings(teams, matches).filter((s) => s.group === "B"),
    []
  );

  return (
    <>
      <SEOHead
        title="Grupa B - District Padel Liga | Tabela i Rezultati"
        description="Tabela i rezultati Grupe B u District Padel Ligi. Pratite najbolje timove u drugoj grupi padel lige Srbije."
        keywords="padel liga grupa b, padel tabela grupa b, district padel grupa b"
        canonicalUrl="https://districtpadel.rs/league/grupa-b"
      />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Grupa B</span>
          </h1>
          <p className="text-lg text-muted-foreground">Tabela i statistika Grupe B</p>
        </div>

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
              {standings.map((standing, idx) => (
                <TableRow key={standing.teamId} className="hover:bg-muted/50">
                  <TableCell className="font-bold">{idx + 1}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link to="/league">← Sve grupe</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/league/grupa-a">← Grupa A</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
