/**
 * Matches management component for admin panel
 */
import { useState, useMemo } from "react";
import { Plus, Edit, Trash2, Calendar, Trophy, Search, Filter, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { EditMatchDialog } from "./EditMatchDialog";
import { EnterResultDialog } from "./EnterResultDialog";
import { format } from "date-fns";

export function MatchesManagement() {
  const { data: matches = [], isLoading, error } = useAdminMatches();
  const { data: teams = [] } = useAdminTeams();
  const deleteMatch = useDeleteMatch();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogMatchId, setEditDialogMatchId] = useState<string | null>(null);
  const [resultDialogMatchId, setResultDialogMatchId] = useState<string | null>(null);
  const [deleteDialogMatchId, setDeleteDialogMatchId] = useState<string | null>(null);
  const [deleteDialogMatchName, setDeleteDialogMatchName] = useState<string | null>(null);
  
  // Filter states
  const [dateFilter, setDateFilter] = useState<string>("");
  const [koloFilter, setKoloFilter] = useState<string>("");
  const [teamFilter, setTeamFilter] = useState<string>("");

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
        <AlertDescription>Greška pri učitavanju meceva</AlertDescription>
      </Alert>
    );
  }

  // Filter matches
  const filteredMatches = useMemo(() => {
    return matches.filter((match) => {
      // Date filter
      if (dateFilter) {
        const matchDate = new Date(match.date);
        const filterDate = new Date(dateFilter);
        const matchDateStr = format(matchDate, "yyyy-MM-dd");
        const filterDateStr = format(filterDate, "yyyy-MM-dd");
        if (matchDateStr !== filterDateStr) {
          return false;
        }
      }
      
      // Kolo filter
      if (koloFilter && match.kolo !== koloFilter) {
        return false;
      }
      
      // Team filter - search by team name and player names
      if (teamFilter) {
        const homeTeam = teams.find((t) => t.id === match.homeTeamId);
        const awayTeam = teams.find((t) => t.id === match.awayTeamId);
        const searchTerm = teamFilter.toLowerCase();
        
        // Check team names
        const homeTeamName = homeTeam?.name.toLowerCase() || "";
        const awayTeamName = awayTeam?.name.toLowerCase() || "";
        
        // Check player names
        const homePlayerNames = homeTeam?.players.map(p => p.name.toLowerCase()).join(" ") || "";
        const awayPlayerNames = awayTeam?.players.map(p => p.name.toLowerCase()).join(" ") || "";
        
        if (!homeTeamName.includes(searchTerm) && 
            !awayTeamName.includes(searchTerm) &&
            !homePlayerNames.includes(searchTerm) &&
            !awayPlayerNames.includes(searchTerm)) {
          return false;
        }
      }
      
      return true;
    });
  }, [matches, dateFilter, koloFilter, teamFilter, teams]);

  // Get unique kolo values for filter dropdown - sort numerically
  const uniqueKolos = useMemo(() => {
    const kolos = new Set<string>();
    matches.forEach((match) => {
      if (match.kolo) {
        kolos.add(match.kolo);
      }
    });
    return Array.from(kolos).sort((a, b) => {
      // Try to parse as numbers for numeric sorting
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      // Fallback to string sort if not numeric
      return a.localeCompare(b);
    });
  }, [matches]);

  // Sort matches by status priority (scheduled → in_progress → played), then by date within each status
  const statusPriority: Record<string, number> = {
    scheduled: 1,
    in_progress: 2,
    played: 3,
    cancelled: 4,
  };

  const sortedMatches = [...filteredMatches].sort((a, b) => {
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
        <h2 className="text-2xl font-bold">Mecevi</h2>
        <Button className="gradient-hero" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Zakazi mec
        </Button>
      </div>

      {/* Filters */}
      <Card className="glass p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Datum</label>
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Filtriraj po datumu"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Kolo</label>
            <Select value={koloFilter || "all"} onValueChange={(v) => setKoloFilter(v === "all" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Sva kola" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Sva kola</SelectItem>
                {uniqueKolos.map((kolo) => (
                  <SelectItem key={kolo} value={kolo}>
                    Kolo {kolo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Tim</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value)}
                placeholder="Pretraži po timu..."
                className="pl-10"
              />
              {teamFilter && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setTeamFilter("")}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          {(dateFilter || koloFilter || teamFilter) && (
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setDateFilter("");
                  setKoloFilter("");
                  setTeamFilter("");
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Obriši filtere
              </Button>
            </div>
          )}
        </div>
      </Card>

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
          Nema zakazanih meceva. Zakazite prvi mec.
        </Card>
      ) : (
        <div className="rounded-lg border border-border overflow-x-auto glass">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Datum</TableHead>
                <TableHead>Kolo</TableHead>
                <TableHead>Grupa</TableHead>
                <TableHead>Mec</TableHead>
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
                      {format(new Date(match.date), "dd.MM.yyyy HH:mm")}
                    </div>
                  </TableCell>
                  <TableCell>
                    {match.kolo ? (
                      <Badge variant="secondary">Kolo {match.kolo}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-primary text-primary">Grupa {match.group}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      <Link 
                        to={`/teams/${match.homeTeamId}`}
                        className="hover:underline text-primary"
                      >
                        {getTeamName(match.homeTeamId)}
                      </Link>
                      {" vs "}
                      <Link 
                        to={`/teams/${match.awayTeamId}`}
                        className="hover:underline text-primary"
                      >
                        {getTeamName(match.awayTeamId)}
                      </Link>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditDialogMatchId(match.id)}
                        title="Izmeni mec"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
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
                        title="Obriši mec"
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
      {editDialogMatchId && (
        <EditMatchDialog
          matchId={editDialogMatchId}
          open={!!editDialogMatchId}
          onOpenChange={(open) => !open && setEditDialogMatchId(null)}
        />
      )}
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
            <AlertDialogTitle>Potvrda brisanja meca</AlertDialogTitle>
            <AlertDialogDescription>
              Da li ste sigurni da želite da obrišete mec <strong>{deleteDialogMatchName}</strong>?
              <br />
              <br />
              Ova akcija je nepovratna i svi podaci o ovom mecu će biti trajno obrisani.
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

