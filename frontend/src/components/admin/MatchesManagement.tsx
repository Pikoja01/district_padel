/**
 * Matches management component for admin panel
 */
import { useState } from "react";
import { Plus, Edit, Trash2, Calendar, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAdminMatches, useDeleteMatch } from "@/hooks/use-admin-matches";
import { useAdminTeams } from "@/hooks/use-admin-teams";
import { CreateMatchDialog } from "./CreateMatchDialog";
import { EnterResultDialog } from "./EnterResultDialog";
import { format } from "date-fns";

export function MatchesManagement() {
  const { data: matches = [], isLoading, error } = useAdminMatches();
  const { data: teams = [] } = useAdminTeams();
  const deleteMatch = useDeleteMatch();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [resultDialogMatchId, setResultDialogMatchId] = useState<string | null>(null);
  const [deleteDialogMatchId, setDeleteDialogMatchId] = useState<string | null>(null);
  const [deleteDialogMatchName, setDeleteDialogMatchName] = useState<string | null>(null);

  const getTeamName = (teamId: string) => {
    return teams.find((t) => t.id === teamId)?.name || "Unknown";
  };

  const handleDeleteClick = (matchId: string) => {
    const match = matches.find((m) => m.id === matchId);
    if (match) {
      const homeTeamName = getTeamName(match.homeTeamId);
      const awayTeamName = getTeamName(match.awayTeamId);
      setDeleteDialogMatchId(matchId);
      setDeleteDialogMatchName(`${homeTeamName} vs ${awayTeamName}`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialogMatchId) {
      await deleteMatch.mutateAsync(deleteDialogMatchId);
      setDeleteDialogMatchId(null);
      setDeleteDialogMatchName(null);
    }
  };

  const formatMatchScore = (match: any) => {
    if ((match.status !== "played" && match.status !== "in_progress") || !match.homeSets || !match.awaySets || match.homeSets.length === 0) {
      return "-";
    }

    // Match type has homeSets and awaySets arrays (transformed from match_sets)
    const scores: string[] = [];
    for (let i = 0; i < match.homeSets.length; i++) {
      scores.push(`${match.homeSets[i]}-${match.awaySets[i]}`);
    }
    return scores.join(", ");
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Greška pri učitavanju mečeva</AlertDescription>
      </Alert>
    );
  }

  // Sort matches by status priority (scheduled → in_progress → played), then by date within each status
  const statusPriority: Record<string, number> = {
    scheduled: 1,
    in_progress: 2,
    played: 3,
    cancelled: 4,
  };

  const sortedMatches = [...matches].sort((a, b) => {
    // First sort by status priority
    const statusDiff = (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99);
    if (statusDiff !== 0) {
      return statusDiff;
    }
    // Then sort by date (most recent first within same status)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meč</h2>
        <Button className="gradient-hero" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Zakazi Meč
        </Button>
      </div>

      {isLoading ? (
        <Card className="glass p-8">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </Card>
      ) : sortedMatches.length === 0 ? (
        <Card className="glass p-8 text-center text-muted-foreground">
          Nema zakazanih mečeva. Zakazite prvi meč.
        </Card>
      ) : (
        <div className="rounded-lg border border-border overflow-x-auto glass">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Grupa</TableHead>
                <TableHead>Meč</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Rezultat</TableHead>
                <TableHead className="text-right">Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMatches.map((match) => (
                <TableRow key={match.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {format(new Date(match.date), "dd.MM.yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Grupa {match.group}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {getTeamName(match.homeTeamId)} vs {getTeamName(match.awayTeamId)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {match.status === "played" ? (
                      <Badge className="bg-green-500">
                        <Trophy className="w-3 h-3 mr-1" />
                        Odigrano
                      </Badge>
                    ) : match.status === "in_progress" ? (
                      <Badge className="bg-yellow-500">
                        U toku
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Zakazano</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {(match.status === "played" || match.status === "in_progress") ? (
                      <span className="font-mono">{formatMatchScore(match)}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {(match.status === "scheduled" || match.status === "in_progress") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setResultDialogMatchId(match.id)}
                        >
                          {match.status === "in_progress" ? "Ažuriraj rezultat" : "Unesi rezultat"}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(match.id)}
                        disabled={deleteMatch.isPending}
                        title="Obriši Meč"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateMatchDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      {resultDialogMatchId && (
        <EnterResultDialog
          matchId={resultDialogMatchId}
          open={!!resultDialogMatchId}
          onOpenChange={(open) => !open && setResultDialogMatchId(null)}
        />
      )}

      <AlertDialog open={!!deleteDialogMatchId} onOpenChange={(open) => !open && setDeleteDialogMatchId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Potvrda brisanja meča</AlertDialogTitle>
            <AlertDialogDescription>
              Da li ste sigurni da želite da obrišete meč <strong>{deleteDialogMatchName}</strong>?
              <br />
              <br />
              Ova akcija je nepovratna i svi podaci o ovom meču će biti trajno obrisani.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Otkaži</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMatch.isPending}
            >
              {deleteMatch.isPending ? "Brisanje..." : "Obriši"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

