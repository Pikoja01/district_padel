/**
 * Teams management component for admin panel
 */
import { useState } from "react";
import { Plus, Edit, Archive, ArchiveRestore, Users } from "lucide-react";
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
import { useAdminTeams, useDeleteTeam, useActivateTeam } from "@/hooks/use-admin-teams";
import { CreateTeamDialog } from "./CreateTeamDialog";
import { EditTeamDialog } from "./EditTeamDialog";

export function TeamsManagement() {
  const { data: teams = [], isLoading, error } = useAdminTeams();
  const deleteTeam = useDeleteTeam();
  const activateTeam = useActivateTeam();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editTeamId, setEditTeamId] = useState<string | null>(null);

  const handleArchive = async (teamId: string) => {
    if (confirm("Da li ste sigurni da želite da arhivirate ovaj tim?")) {
      await deleteTeam.mutateAsync(teamId);
    }
  };

  const handleActivate = async (teamId: string) => {
    await activateTeam.mutateAsync(teamId);
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Greška pri učitavanju timova</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Timovi</h2>
        <Button className="gradient-hero" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Dodaj tim
        </Button>
      </div>

      {isLoading ? (
        <Card className="glass p-8">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </Card>
      ) : teams.length === 0 ? (
        <Card className="glass p-8 text-center text-muted-foreground">
          Nema timova. Kreirajte prvi tim.
        </Card>
      ) : (
        <div className="rounded-lg border border-border overflow-x-auto glass">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tim</TableHead>
                <TableHead className="text-center">Grupa</TableHead>
                <TableHead>Igrači</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Akcije</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.id} className={team.active ? "" : "opacity-60"}>
                  <TableCell className="font-medium">{team.name}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">Grupa {team.group}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        {team.players.filter((p) => p.role === "main").length} glavna
                        {team.players.filter((p) => p.role === "reserve").length > 0 && (
                          <>, {team.players.filter((p) => p.role === "reserve").length} rezerva</>
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {team.active ? (
                      <Badge className="bg-green-500">Aktivan</Badge>
                    ) : (
                      <Badge variant="secondary">Arhiviran</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditTeamId(team.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {team.active ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleArchive(team.id)}
                          disabled={deleteTeam.isPending}
                        >
                          <Archive className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleActivate(team.id)}
                          disabled={activateTeam.isPending}
                        >
                          <ArchiveRestore className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateTeamDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      {editTeamId && (
        <EditTeamDialog
          teamId={editTeamId}
          open={!!editTeamId}
          onOpenChange={(open) => !open && setEditTeamId(null)}
        />
      )}
    </div>
  );
}

