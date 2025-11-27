/**
 * Dashboard overview component showing league statistics
 */
import { useDashboardStats } from "@/hooks/use-admin-dashboard";
import { useStandings } from "@/hooks/use-standings";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Users, Calendar, Trophy, TrendingUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DashboardOverview() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: standings = [], isLoading: standingsLoading } = useStandings();

  if (statsError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Greška pri učitavanju statistika</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pregled lige</h2>

      {/* Statistics Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Aktivni timovi</p>
                <p className="text-3xl font-bold">{stats?.teams?.active || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Ukupno: {stats?.teams?.total || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary/50" />
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Odigrane utakmice</p>
                <p className="text-3xl font-bold">{stats?.matches?.played || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Zakazane: {stats?.matches?.scheduled || 0}
                </p>
              </div>
              <Trophy className="w-8 h-8 text-primary/50" />
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Grupa A</p>
                <p className="text-3xl font-bold">{stats?.teams?.group_a || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">timova</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary/50" />
            </div>
          </Card>

          <Card className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Grupa B</p>
                <p className="text-3xl font-bold">{stats?.teams?.group_b || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">timova</p>
              </div>
              <Calendar className="w-8 h-8 text-primary/50" />
            </div>
          </Card>
        </div>
      )}

      {/* Standings Table */}
      <div>
        <h3 className="text-xl font-bold mb-4">Trenutna tabela</h3>
        {standingsLoading ? (
          <Card className="glass p-8">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </Card>
        ) : standings.length === 0 ? (
          <Card className="glass p-8 text-center text-muted-foreground">
            Nema podataka o tabeli
          </Card>
        ) : (
          <div className="rounded-lg border border-border overflow-x-auto glass">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Poz</TableHead>
                  <TableHead>Tim</TableHead>
                  <TableHead className="text-center">Grupa</TableHead>
                  <TableHead className="text-center">Utakmice</TableHead>
                  <TableHead className="text-center">Pobede</TableHead>
                  <TableHead className="text-center">Porazi</TableHead>
                  <TableHead className="text-center">Bodovi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {standings.slice(0, 10).map((standing) => (
                  <TableRow key={standing.teamId}>
                    <TableCell className="font-bold">{standing.position}</TableCell>
                    <TableCell className="font-medium">{standing.teamName}</TableCell>
                    <TableCell className="text-center">
                      <span className="inline-block px-2 py-1 rounded bg-primary/20 text-primary text-xs font-semibold">
                        {standing.group}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">{standing.matchesPlayed}</TableCell>
                    <TableCell className="text-center text-green-600">
                      {standing.matchesWon}
                    </TableCell>
                    <TableCell className="text-center text-red-600">{standing.matchesLost}</TableCell>
                    <TableCell className="text-center font-bold text-primary">
                      {standing.points}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}


