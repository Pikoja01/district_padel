/**
 * Dialog for editing a team
 */
import { useEffect, useState } from "react";
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

export function EditTeamDialog({ teamId, open, onOpenChange }: EditTeamDialogProps) {
  const { data: team, isLoading } = useAdminTeam(teamId);
  const updateTeam = useUpdateTeam();
  const [teamName, setTeamName] = useState("");
  const [group, setGroup] = useState<"A" | "B">("A");

  useEffect(() => {
    if (team) {
      setTeamName(team.name);
      setGroup(team.group);
    }
  }, [team]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      alert("Ime tima je obavezno");
      return;
    }

    try {
      await updateTeam.mutateAsync({
        teamId,
        data: {
          name: teamName.trim(),
          group,
        },
      });
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Izmeni tim</DialogTitle>
          <DialogDescription>
            Izmenite podatke o timu. Za izmenu igrača, izbrišite tim i kreirajte novi.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
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

            {team && (
              <div className="text-sm text-muted-foreground">
                <p>Igrači: {team.players.map((p) => p.name).join(", ")}</p>
              </div>
            )}

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

