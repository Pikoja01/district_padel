/**
 * Dialog for entering match result
 */
import { useState, useEffect } from "react";
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
import { useEnterMatchResult, useAdminMatch } from "@/hooks/use-admin-matches";
import { useAdminTeams } from "@/hooks/use-admin-teams";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface EnterResultDialogProps {
  matchId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MatchSet {
  set_number: number;
  home_games: number | null;
  away_games: number | null;
}

export function EnterResultDialog({ matchId, open, onOpenChange }: EnterResultDialogProps) {
  const { data: match, isLoading } = useAdminMatch(matchId);
  const { data: teams = [] } = useAdminTeams();
  const enterResult = useEnterMatchResult();
  const [sets, setSets] = useState<MatchSet[]>([
    { set_number: 1, home_games: null, away_games: null },
  ]);

  // Load existing match sets when match data is available
  useEffect(() => {
    if (!open) {
      // Reset form when dialog closes
      setSets([{ set_number: 1, home_games: null, away_games: null }]);
      return;
    }

    if (!match || isLoading) {
      // Wait for match data to load
      return;
    }

    // Match type has homeSets and awaySets arrays (transformed from match_sets)
    if (match.homeSets && match.awaySets && match.homeSets.length > 0) {
      const loadedSets: MatchSet[] = [];
      
      // Reconstruct sets from homeSets and awaySets arrays
      for (let i = 0; i < match.homeSets.length; i++) {
        loadedSets.push({
          set_number: i + 1,
          home_games: match.homeSets[i],
          away_games: match.awaySets[i],
        });
      }
      
      // Add one empty set if we don't have 3 sets already (for adding next set)
      if (loadedSets.length < 3) {
        loadedSets.push({
          set_number: loadedSets.length + 1,
          home_games: null,
          away_games: null,
        });
      }
      
      setSets(loadedSets);
    } else {
      // Start with just 1 set if no existing sets
      setSets([
        { set_number: 1, home_games: null, away_games: null },
      ]);
    }
  }, [match, open, isLoading]); // Reset when dialog opens/closes or match changes

  const getTeamName = (teamId: string) => {
    return teams.find((t) => t.id === teamId)?.name || "Unknown";
  };

  const addSet = () => {
    if (sets.length < 3) {
      setSets([...sets, { set_number: sets.length + 1, home_games: null, away_games: null }]);
    }
  };

  const removeSet = (index: number) => {
    if (sets.length > 1) {
      const updated = sets.filter((_, i) => i !== index).map((s, i) => ({
        ...s,
        set_number: i + 1,
      }));
      setSets(updated);
    }
  };

  const updateSet = (index: number, field: "home_games" | "away_games", value: number | null) => {
    const updated = [...sets];
    updated[index] = { ...updated[index], [field]: value };
    setSets(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out sets that are completely empty (both scores null/0)
    const filledSets = sets.filter(
      (s) =>
        (s.home_games !== null && s.home_games !== undefined && s.home_games >= 0) &&
        (s.away_games !== null && s.away_games !== undefined && s.away_games >= 0) &&
        !(s.home_games === 0 && s.away_games === 0)
    );

    if (filledSets.length < 1) {
      alert("Morate uneti barem jedan set sa rezultatima.");
      return;
    }

    if (filledSets.length > 3) {
      alert("Mec može imati maksimalno 3 seta");
      return;
    }

    // Validate that each filled set has at least one non-zero score
    for (const set of filledSets) {
      if (set.home_games === 0 && set.away_games === 0) {
        alert(`Set ${set.set_number} ne može imati oba rezultata kao 0.`);
        return;
      }
      if (set.home_games < 0 || set.away_games < 0) {
        alert(`Set ${set.set_number}: Rezultati ne mogu biti negativni.`);
        return;
      }
    }

    // Renumber sets sequentially starting from 1
    const setsToSubmit = filledSets.map((s, index) => ({
      set_number: index + 1,
      home_games: s.home_games || 0,
      away_games: s.away_games || 0,
    }));

    try {
      await enterResult.mutateAsync({
        matchId,
        data: {
          sets: setsToSubmit,
        },
      });
      onOpenChange(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (!match) {
    return null;
  }

  const homeTeamName = getTeamName(match.homeTeamId);
  const awayTeamName = getTeamName(match.awayTeamId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Unesi rezultat meca</DialogTitle>
          <DialogDescription>
            {homeTeamName} vs {awayTeamName}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Setovi *</Label>
                {sets.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSet}
                    disabled={enterResult.isPending}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Dodaj set
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {sets.map((set, index) => (
                  <div key={index} className="flex gap-4 items-center p-4 border rounded-lg">
                    <div className="w-16 text-center font-bold">Set {set.set_number}</div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">{homeTeamName} *</Label>
                        <Input
                          type="number"
                          min="0"
                          required
                          value={set.home_games !== null && set.home_games !== undefined ? set.home_games : ""}
                          onChange={(e) => {
                            const value = e.target.value === "" ? null : parseInt(e.target.value);
                            updateSet(index, "home_games", value === null ? null : (isNaN(value) ? null : value));
                          }}
                          disabled={enterResult.isPending}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm">{awayTeamName} *</Label>
                        <Input
                          type="number"
                          min="0"
                          required
                          value={set.away_games !== null && set.away_games !== undefined ? set.away_games : ""}
                          onChange={(e) => {
                            const value = e.target.value === "" ? null : parseInt(e.target.value);
                            updateSet(index, "away_games", value === null ? null : (isNaN(value) ? null : value));
                          }}
                          disabled={enterResult.isPending}
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSet(index)}
                      disabled={enterResult.isPending || (sets.length === 1 && sets[0].home_games === null && sets[0].away_games === null)}
                      title={sets.length === 1 && sets[0].home_games === null && sets[0].away_games === null ? "Morate zadržati barem jedan set" : "Ukloni set"}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="text-sm text-muted-foreground">
                <p>Unesite broj gemova za svaki set. Mec se igra najbolje od 3 seta.</p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={enterResult.isPending}
              >
                Otkaži
              </Button>
              <Button type="submit" className="gradient-hero" disabled={enterResult.isPending}>
                {enterResult.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Unos...
                  </>
                ) : (
                  "Unesi rezultat"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

