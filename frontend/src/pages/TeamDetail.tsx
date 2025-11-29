import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Trophy, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOHead } from "@/components/layout/SEOHead";
import { useTeam, useTeams } from "@/hooks/use-teams";
import { useTeamStanding } from "@/hooks/use-standings";
import { useMatches } from "@/hooks/use-matches";
import type { Match } from "@/types";

export default function TeamDetail() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const { data: team, isLoading: teamLoading, error: teamError } = useTeam(teamId);
  const { data: teamStanding, isLoading: standingLoading } = useTeamStanding(teamId);
  const { data: allMatches = [], isLoading: matchesIsLoading, error: matchesError } = useMatches({ status: "played" });
  const { data: allTeams = [], isLoading: teamsIsLoading, error: teamsError } = useTeams();

  const teamMatches = allMatches.filter(
    (m) => (m.homeTeamId === teamId || m.awayTeamId === teamId)
  );

  const getOpponentName = (match: Match) => {
    if (teamsError) {
      return "Greška pri učitavanju timova";
    }
    const opponentId = match.homeTeamId === teamId ? match.awayTeamId : match.homeTeamId;
    const opponent = allTeams.find((t) => t.id === opponentId);
    return opponent?.name || "Nepoznat tim";
  };

  const getOpponentId = (match: Match) => {
    return match.homeTeamId === teamId ? match.awayTeamId : match.homeTeamId;
  };

  const getResult = (match: Match) => {
    if (!teamId) return { formatted: "", isWin: false };
    
    const isHome = match.homeTeamId === teamId;
    const teamSets = isHome ? match.homeSets : match.awaySets;
    const opponentSets = isHome ? match.awaySets : match.homeSets;
    
    const setsLength = Math.min(teamSets.length, opponentSets.length);
    
    let teamSetsWon = 0;
    let opponentSetsWon = 0;
    
    for (let i = 0; i < setsLength; i++) {
      if (teamSets[i] > opponentSets[i]) teamSetsWon++;
      else if (opponentSets[i] > teamSets[i]) opponentSetsWon++;
    }
    
    const isWin = teamSetsWon > opponentSetsWon;
    
    return {
      formatted: Array.from({ length: setsLength }, (_, i) => `${teamSets[i]}:${opponentSets[i]}`).join(", "),
      isWin,
    };
  };

  const isLoading = teamLoading || standingLoading || matchesIsLoading || teamsIsLoading;

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="space-y-8">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </main>
    );
  }

  if (teamError || !team) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {teamError ? "Greška pri učitavanju tima." : "Tim nije pronađen"}
          </AlertDescription>
        </Alert>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Tim nije pronađen</h1>
          <Button onClick={() => navigate("/league")}>Nazad na tabelu</Button>
        </div>
      </main>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: team.name,
    sport: "Padel",
    memberOf: {
      "@type": "SportsOrganization",
      name: "District Padel League",
    },
  };

  return (
    <>
      <SEOHead
        title={`${team.name} - District Padel Liga | Tim Profil`}
        description={`Pogledajte profil, statistike i rezultate tima ${team.name} u District Padel Ligi. Igrači, mecevi i plasman u tabeli.`}
        keywords={`${team.name}, padel tim, padel liga, district padel, grupa ${team.group}`}
        canonicalUrl={`https://districtpadel.rs/teams/${teamId}`}
        structuredData={structuredData}
      />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/league")} className="mb-6">
          <ArrowLeft className="mr-2 w-4 h-4" /> Nazad na tabelu
        </Button>

        <div className="space-y-8">
          <div className="glass rounded-lg p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-primary">{team.name}</h1>
                <div className="flex gap-2">
                  <Badge className="bg-primary text-primary-foreground">Grupa {team.group}</Badge>
                  {teamStanding && (
                    <Badge variant="outline">{teamStanding.position}. mesto</Badge>
                  )}
                </div>
              </div>
              {teamStanding && (
                <div className="text-right">
                  <div className="text-5xl font-bold text-primary">{teamStanding.points}</div>
                  <div className="text-sm text-muted-foreground">bodova</div>
                </div>
              )}
            </div>

            {teamStanding && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <Card className="p-4 text-center bg-card/40">
                  <div className="text-2xl font-bold">{teamStanding.matchesPlayed}</div>
                  <div className="text-sm text-muted-foreground">Odigrano</div>
                </Card>
                <Card className="p-4 text-center bg-card/40">
                  <div className="text-2xl font-bold text-win">{teamStanding.matchesWon}</div>
                  <div className="text-sm text-muted-foreground">Pobede</div>
                </Card>
                <Card className="p-4 text-center bg-card/40">
                  <div className="text-2xl font-bold">{teamStanding.setDiff > 0 ? "+" : ""}{teamStanding.setDiff}</div>
                  <div className="text-sm text-muted-foreground">Set razlika</div>
                </Card>
                <Card className="p-4 text-center bg-card/40">
                  <div className="text-2xl font-bold">{teamStanding.gameDiff > 0 ? "+" : ""}{teamStanding.gameDiff}</div>
                  <div className="text-sm text-muted-foreground">Gem razlika</div>
                </Card>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Igrači
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {team.players.map((player) => (
                <Card key={player.id} className="glass p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{player.name}</h3>
                    <Badge variant={player.role === "main" ? "default" : "secondary"}>
                      {player.role === "main" ? "Glavni" : "Rezerva"}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary" />
              Nedavni mecevi
            </h2>
            {matchesError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Greška pri učitavanju meceva. Molimo pokušajte ponovo.
                </AlertDescription>
              </Alert>
            ) : teamMatches.length === 0 ? (
              <Card className="glass p-8 text-center text-muted-foreground">
                Još nema odigranih meceva
              </Card>
            ) : (
              <div className="space-y-4">
                {teamMatches.map((match) => {
                  const result = getResult(match);
                  return (
                    <Card key={match.id} className="glass p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-1">
                            {new Date(match.date).toLocaleString("sr-RS", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className="font-semibold">
                            vs{" "}
                            <Link
                              to={`/teams/${getOpponentId(match)}`}
                              className="text-primary hover:underline transition-colors"
                            >
                              {getOpponentName(match)}
                            </Link>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-lg mb-1">{result.formatted}</div>
                          <Badge variant={result.isWin ? "default" : "destructive"}>
                            {result.isWin ? "Pobeda" : "Poraz"}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
