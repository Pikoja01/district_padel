/**
 * Dialog for scheduling a new match
 */
import { useState } from "react";
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
import { useCreateMatch } from "@/hooks/use-admin-matches";
import { useAdminTeams } from "@/hooks/use-admin-teams";
import { Loader2 } from "lucide-react";

interface CreateMatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMatchDialog({ open, onOpenChange }: CreateMatchDialogProps) {
  const createMatch = useCreateMatch();
  const { data: teams = [] } = useAdminTeams();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("18:00");
  const [group, setGroup] = useState<"A" | "B">("A");
  const [round, setRound] = useState<string>("");
  const [homeTeamId, setHomeTeamId] = useState<string>("");
  const [awayTeamId, setAwayTeamId] = useState<string>("");

  const groupTeams = teams.filter((t) => t.group === group && t.active);

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
      
      await createMatch.mutateAsync({
        date: matchDateTime.toISOString(),
        group,
        round: round.trim() || null,
        home_team_id: homeTeamId,
        away_team_id: awayTeamId,
      });
      // Reset form
      setDate(new Date());
      setTime("18:00");
      setGroup("A");
      setRound("");
      setHomeTeamId("");
      setAwayTeamId("");
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Zakazi novi Meč</DialogTitle>
          <DialogDescription>
            Izaberite datum, grupu i timove koji će igrati.
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
                    disabled={createMatch.isPending}
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
                disabled={createMatch.isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="match-group">Grupa *</Label>
            <Select value={group} onValueChange={(v) => setGroup(v as "A" | "B")}>
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
              disabled={createMatch.isPending}
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
              disabled={createMatch.isPending}
            >
              Otkaži
            </Button>
            <Button type="submit" className="gradient-hero" disabled={createMatch.isPending}>
              {createMatch.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Zakazivanje...
                </>
              ) : (
                "Zakazi Meč"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


