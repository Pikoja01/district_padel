import { Team, Match, TeamStanding } from "@/types";

export function calculateStandings(teams: Team[], matches: Match[]): TeamStanding[] {
  const playedMatches = matches.filter((m) => m.status === "played");

  const standings: TeamStanding[] = teams
    .filter((t) => t.active)
    .map((team) => {
      const teamMatches = playedMatches.filter(
        (m) => m.homeTeamId === team.id || m.awayTeamId === team.id
      );

      let matchesWon = 0;
      let matchesLost = 0;
      let setsFor = 0;
      let setsAgainst = 0;
      let gamesFor = 0;
      let gamesAgainst = 0;
      let points = 0;

      teamMatches.forEach((match) => {
        const isHome = match.homeTeamId === team.id;
        const homeSetsWon = match.homeSets.filter(
          (s, i) => s > match.awaySets[i]
        ).length;
        const awaySetsWon = match.awaySets.filter(
          (s, i) => s > match.homeSets[i]
        ).length;

        const teamSetsWon = isHome ? homeSetsWon : awaySetsWon;
        const opponentSetsWon = isHome ? awaySetsWon : homeSetsWon;

        if (teamSetsWon > opponentSetsWon) {
          matchesWon++;
        } else {
          matchesLost++;
        }

        if (teamSetsWon === 2 && opponentSetsWon === 0) {
          points += 3; // Win 2-0
        } else if (teamSetsWon === 2 && opponentSetsWon === 1) {
          points += 2; // Win 2-1
        } else if (teamSetsWon === 1 && opponentSetsWon === 2) {
          points += 1; // Lose 1-2 (got 1 set)
        }
        // Note: 0-2 losses automatically get 0 points (no action needed)

        const teamGamesFor = isHome
          ? match.homeSets.reduce((a, b) => a + b, 0)
          : match.awaySets.reduce((a, b) => a + b, 0);
        const teamGamesAgainst = isHome
          ? match.awaySets.reduce((a, b) => a + b, 0)
          : match.homeSets.reduce((a, b) => a + b, 0);

        setsFor += teamSetsWon;
        setsAgainst += opponentSetsWon;
        gamesFor += teamGamesFor;
        gamesAgainst += teamGamesAgainst;
      });

      const setDiff = setsFor - setsAgainst;
      const gameDiff = gamesFor - gamesAgainst;

      return {
        teamId: team.id,
        teamName: team.name,
        group: team.group,
        matchesPlayed: teamMatches.length,
        matchesWon,
        matchesLost,
        setsFor,
        setsAgainst,
        gamesFor,
        gamesAgainst,
        points,
        setDiff,
        gameDiff,
        position: 0,
      };
    });

  standings.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.matchesWon !== a.matchesWon) return b.matchesWon - a.matchesWon;
    if (b.setDiff !== a.setDiff) return b.setDiff - a.setDiff;
    if (b.gameDiff !== a.gameDiff) return b.gameDiff - a.gameDiff;
    return a.teamName.localeCompare(b.teamName);
  });

  standings.forEach((s, i) => {
    s.position = i + 1;
  });

  return standings;
}
