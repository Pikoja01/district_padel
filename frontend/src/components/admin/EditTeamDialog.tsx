/**
 * Dialog for editing a team
 */
import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminTeam, useUpdateTeam } from "@/hooks/use-admin-teams";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface EditTeamDialogProps {
  teamId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TeamPlayer {
  name: string;
  role: "main" | "reserve";
}

export function EditTeamDialog({ teamId, open, onOpenChange }: EditTeamDialogProps) {
  const { data: team, isLoading } = useAdminTeam(teamId);
  const updateTeam = useUpdateTeam();
  const [teamName, setTeamName] = useState("");
  const [group, setGroup] = useState<"A" | "B">("A");
  const [players, setPlayers] = useState<TeamPlayer[]>([
    { name: "", role: "main" },
    { name: "", role: "main" },
  ]);

  useEffect(() => {
    if (team && open) {
      setTeamName(team.name);
      setGroup(team.group);
      // Load existing players
      if (team.players && team.players.length > 0) {
        setPlayers(
          team.players.map((p) => ({
            name: p.name,
            role: p.role as "main" | "reserve",
          }))
        );
      } else {
        setPlayers([
          { name: "", role: "main" },
          { name: "", role: "main" },
        ]);
      }
    }
  }, [team, open]);

  const addPlayer = () => {
    if (players.length < 3) {
      setPlayers([...players, { name: "", role: "reserve" }]);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayer = (index: number, field: keyof TeamPlayer, value: string) => {
    const updated = [...players];
    updated[index] = { ...updated[index], [field]: value };
    setPlayers(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      alert("Ime tima je obavezno");
      return;
    }

    const mainPlayers = players.filter((p) => p.role === "main" && p.name.trim());
    if (mainPlayers.length < 2) {
      alert("Tim mora imati najmanje 2 glavna igrača");
      return;
    }

    const playersToSubmit = players
      .filter((p) => p.name.trim())
      .map((p) => ({
        name: p.name.trim(),
        role: p.role,
      }));

    if (playersToSubmit.length < 2 || playersToSubmit.length > 3) {
      alert("Tim mora imati 2-3 igrača");
      return;
    }
    try {
      await updateTeam.mutateAsync({
        teamId,
        data: {
          name: teamName.trim(),
          group,
          players: playersToSubmit,
        },
      });
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const mainPlayersCount = players.filter((p) => p.role === "main").length;
  const reservePlayersCount = players.filter((p) => p.role === "reserve").length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Izmeni tim</DialogTitle>
          <DialogDescription>
            Izmenite podatke o timu i igračima. Tim mora imati najmanje 2 glavna igrača i može
            imati do 1 rezervnog igrača.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="edit-team-name">Ime tima *</Label>
              <Input
                id="edit-team-name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                disabled={updateTeam.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-group">Grupa *</Label>
              <Select value={group} onValueChange={(v) => setGroup(v as "A" | "B")}>
                <SelectTrigger id="edit-group">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Grupa A</SelectItem>
                  <SelectItem value="B">Grupa B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Igrači *</Label>
                {players.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPlayer}
                    disabled={updateTeam.isPending}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Dodaj igrača
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {players.map((player, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Input
                        placeholder={`Ime igrača ${index + 1}`}
                        value={player.name}
                        onChange={(e) => updatePlayer(index, "name", e.target.value)}
                        disabled={updateTeam.isPending}
                      />
                    </div>
                    <Select
                      value={player.role}
                      onValueChange={(v) => updatePlayer(index, "role", v as "main" | "reserve")}
                      disabled={updateTeam.isPending}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main">Glavni</SelectItem>
                        <SelectItem value="reserve">Rezerva</SelectItem>
                      </SelectContent>
                    </Select>
                    {players.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removePlayer(index)}
                        disabled={updateTeam.isPending}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  Glavni igrači: {mainPlayersCount} / 2 (minimum) | Rezervni: {reservePlayersCount}{" "}
                  / 1 (maksimum)
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateTeam.isPending}
              >
                Otkaži
              </Button>
              <Button type="submit" className="gradient-hero" disabled={updateTeam.isPending}>
                {updateTeam.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Čuvanje...
                  </>
                ) : (
                  "Sačuvaj izmene"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
