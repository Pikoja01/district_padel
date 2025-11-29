/**
 * Dialog for editing an existing match
 */
import { useState, useEffect } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpdateMatch, useAdminMatch } from "@/hooks/use-admin-matches";
import { useAdminTeams } from "@/hooks/use-admin-teams";
import { Loader2 } from "lucide-react";

interface EditMatchDialogProps {
  matchId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMatchDialog({ matchId, open, onOpenChange }: EditMatchDialogProps) {
  const updateMatch = useUpdateMatch();
  const { data: match, isLoading: matchLoading } = useAdminMatch(matchId);
  const { data: teams = [] } = useAdminTeams();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("18:00");
  const [group, setGroup] = useState<"A" | "B">("A");
  const [round, setRound] = useState<string>("");
  const [homeTeamId, setHomeTeamId] = useState<string>("");
  const [awayTeamId, setAwayTeamId] = useState<string>("");

  // Initialize form when match data loads
  useEffect(() => {
    if (match) {
      const matchDate = new Date(match.date);
      setDate(matchDate);
      // Extract time in HH:mm format
      const hours = matchDate.getHours().toString().padStart(2, "0");
      const minutes = matchDate.getMinutes().toString().padStart(2, "0");
      setTime(`${hours}:${minutes}`);
      setGroup(match.group);
      setRound(match.kolo || "");
      setHomeTeamId(match.homeTeamId);
      setAwayTeamId(match.awayTeamId);
    }
  }, [match]);

  const groupTeams = teams.filter((t) => t.group === group && t.active);

  // Reset team IDs when group changes or when selected teams are not in the new group
  useEffect(() => {
    if (homeTeamId && !groupTeams.find((t) => t.id === homeTeamId)) {
      setHomeTeamId("");
    }
    if (awayTeamId && !groupTeams.find((t) => t.id === awayTeamId)) {
      setAwayTeamId("");
    }
  }, [group, groupTeams, homeTeamId, awayTeamId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      alert("Izaberite datum");
      return;
    }

    if (!homeTeamId || !awayTeamId) {
      alert("Izaberite oba tima");
      return;
    }

    if (homeTeamId === awayTeamId) {
      alert("Timovi moraju biti različiti");
      return;
    }

    try {
      // Combine date and time
      const [hours, minutes] = time.split(":").map(Number);
      const matchDateTime = new Date(date);
      matchDateTime.setHours(hours, minutes, 0, 0);
      
      await updateMatch.mutateAsync({
        matchId,
        data: {
          date: matchDateTime.toISOString(),
          group,
          round: round.trim() || null,
          home_team_id: homeTeamId,
          away_team_id: awayTeamId,
        },
      });
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (matchLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Izmeni mec</DialogTitle>
          <DialogDescription>
            Izmenite datum, vreme, grupu i timove za mec.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Datum *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                    disabled={updateMatch.isPending}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd.MM.yyyy") : <span>Izaberi datum</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="match-time">Vreme *</Label>
              <Input
                id="match-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={updateMatch.isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="match-group">Grupa *</Label>
            <Select
              value={group}
              onValueChange={(v) => {
                setGroup(v as "A" | "B");
                // Reset team IDs when group changes
                setHomeTeamId("");
                setAwayTeamId("");
              }}
            >
              <SelectTrigger id="match-group">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Grupa A</SelectItem>
                <SelectItem value="B">Grupa B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="match-round">Kolo (opciono)</Label>
            <Input
              id="match-round"
              type="text"
              value={round}
              onChange={(e) => setRound(e.target.value)}
              placeholder="npr. 1, 2, QF, SF, Final"
              disabled={updateMatch.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="home-team">Domaći tim *</Label>
            <Select value={homeTeamId} onValueChange={setHomeTeamId}>
              <SelectTrigger id="home-team">
                <SelectValue placeholder="Izaberi tim" />
              </SelectTrigger>
              <SelectContent>
                {groupTeams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="away-team">Gostujući tim *</Label>
            <Select value={awayTeamId} onValueChange={setAwayTeamId}>
              <SelectTrigger id="away-team">
                <SelectValue placeholder="Izaberi tim" />
              </SelectTrigger>
              <SelectContent>
                {groupTeams
                  .filter((team) => team.id !== homeTeamId)
                  .map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMatch.isPending}
            >
              Otkaži
            </Button>
            <Button type="submit" className="gradient-hero" disabled={updateMatch.isPending}>
              {updateMatch.isPending ? (
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
      </DialogContent>
    </Dialog>
  );
}


