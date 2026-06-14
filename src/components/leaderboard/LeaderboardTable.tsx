import { useState, useEffect } from 'react';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Player {
  id: string;
  rank: number;
  username: string;
  score: number;
  level: string;
  levelNum?: number;
  mode: 'total' | 'partial';
  completionTime: number;
  achievements: string[];
  character?: string;
}

// Fetch real data from Firestore with comprehensive data extraction
async function fetchLeaderboard(): Promise<Player[]> {
  const players: Player[] = [];

  try {
    // Try to get all users - this may fail due to permissions
    const userIds: string[] = [];
    const usersData: Map<string, any> = new Map();

    try {
      const usersQuery = query(collection(db, 'Users'), limit(100));
      const usersSnapshot = await getDocs(usersQuery);
      usersSnapshot.docs.forEach((doc) => {
        userIds.push(doc.id);
        usersData.set(doc.id, doc.data());
      });
    } catch (usersError: any) {
      // If we can't list users, we'll need another approach
    }

    // Process each user
    for (const userId of userIds) {
      const userData = usersData.get(userId) || {};
      const userName =
        userData.displayName || userData.userName || userData.name || 'Joueur anonyme';

      try {
        // Get Games subcollection for this user
        const gamesQuery = query(collection(db, 'Users', userId, 'Games'));
        const gamesSnapshot = await getDocs(gamesQuery);

        for (const gameDoc of gamesSnapshot.docs) {
          const gameData = gameDoc.data();
          const characterName = gameDoc.id; // "Cécilia (cécité totale)" or "Lum (cécité partielle)"

          let totalScore = 0;
          let levelCount = 0;
          let maxLevel = 'N/A';
          let maxLevelNum = 0;

          // Check if it's Cécilia (cécité totale) or Lum (cécité partielle)
          const charNameLower = characterName.toLowerCase();
          const isCecilia =
            charNameLower.includes('cécilia') ||
            charNameLower.includes('cecilia') ||
            charNameLower.includes('total');

          // Try to get LevelStats
          try {
            const levelStatsQuery = query(
              collection(db, 'Users', userId, 'Games', gameDoc.id, 'LevelStats')
            );
            const levelStatsSnap = await getDocs(levelStatsQuery);

            if (isCecilia) {
              // For Cécilia: sum score_global from each LevelStats document, then average
              let sumScore = 0;
              let validLevels = 0;

              levelStatsSnap.docs.forEach((levelDoc) => {
                const levelData = levelDoc.data();
                // Try multiple field names for score
                const levelScoreRaw =
                  levelData.score_global ??
                  levelData.scoreGlobal ??
                  levelData.globalScore ??
                  levelData.score ??
                  levelData.bestScore ??
                  levelData.totalScore ??
                  0;
                const levelScore = Number(levelScoreRaw) || 0;

                // Only count levels that have a valid score
                if (levelScore > 0) {
                  sumScore += levelScore;
                  validLevels++;
                }

                // Track max level
                if (
                  levelDoc.id.toLowerCase().includes('niveau') ||
                  levelDoc.id.toLowerCase().includes('level')
                ) {
                  maxLevel = levelDoc.id;
                  const m = levelDoc.id.match(/(\d+)/);
                  if (m) {
                    const n = Number(m[1]);
                    if (n > maxLevelNum) maxLevelNum = n;
                  }
                }
              });

              // Average per level
              totalScore = validLevels > 0 ? Math.round(sumScore / validLevels) : 0;

              // Fallback: if no readable LevelStats, try game document aggregate
              if (totalScore === 0) {
                const gameGlobalRaw =
                  gameData.score_global ??
                  gameData.scoreGlobal ??
                  gameData.globalScore ??
                  gameData.score ??
                  0;
                const gameGlobal = Number(gameGlobalRaw) || 0;
                if (gameGlobal > 0) {
                  totalScore = gameGlobal;
                }
              }
              levelCount = validLevels;
            } else {
              // For Lum: use score_global from game document directly
              const gameGlobalRaw =
                gameData.score_global ??
                gameData.scoreGlobal ??
                gameData.globalScore ??
                gameData.score ??
                0;
              const gameGlobalScore = Number(gameGlobalRaw) || 0;
              totalScore = gameGlobalScore;
            }
          } catch (levelError: any) {
            // silently ignore LevelStats fetch errors
          }

          // Determine game mode from character name
          const isTotal =
            characterName.toLowerCase().includes('total') ||
            characterName.toLowerCase().includes('cécité totale');
          const mode: 'total' | 'partial' = isTotal ? 'total' : 'partial';

          // Get completion time
          const completionTime =
            gameData.totalTime ?? gameData.completionTime ?? gameData.elapsedTime ?? 0;

          // Determine if game is finished
          // Lum: visionIndex === 6
          // Cécilia: gameFinished === true
          const isFinished = isCecilia
            ? gameData.gameFinished === true
            : gameData.visionIndex === 6;

          const levelDisplay = isFinished
            ? 'Terminé'
            : maxLevel !== 'N/A'
              ? maxLevel
              : gameData.currentLevel
                ? `Niveau ${gameData.currentLevel}`
                : 'En cours';

          // Numeric level for ranking
          let levelNum = maxLevelNum;
          if (isFinished)
            levelNum = 99; // finished games rank highest
          else if (!levelNum && typeof gameData.currentLevel === 'number')
            levelNum = gameData.currentLevel;
          else if (!levelNum && levelCount > 0) levelNum = levelCount;

          // Always add player if they have any data (even 0 score shows participation)
          if (totalScore >= 0) {
            const player: Player = {
              id: `${userId}-${characterName}`,
              rank: 0,
              username: userName,
              score: totalScore,
              level: levelDisplay,
              levelNum,
              mode: mode,
              completionTime: completionTime,
              achievements: isFinished ? ['🏆', '⭐'] : levelCount > 0 ? ['⭐'] : [],
              character: characterName,
            };
            players.push(player);
          }
        }
      } catch (gameError: any) {
        // silently ignore per-user game fetch errors
      }
    }

    // Sort by level first (desc), then by score (desc)
    players.sort((a, b) => {
      const la = a.levelNum || 0;
      const lb = b.levelNum || 0;
      if (lb !== la) return lb - la;
      return b.score - a.score;
    });
    players.forEach((p, i) => (p.rank = i + 1));
  } catch (error: any) {
    // silently handle leaderboard fetch errors
  }

  return players;
}

type TimeFilter = 'daily' | 'weekly' | 'monthly' | 'all-time';
type ModeFilter = 'all' | 'total' | 'partial';

// Component to render a single leaderboard section
function LeaderboardSection({
  title,
  players,
  mode,
  formatTime,
  getRankColor,
}: {
  title: string;
  players: Player[];
  mode: 'total' | 'partial';
  formatTime: (s: number) => string;
  getRankColor: (r: number) => string;
}) {
  const modeColor =
    mode === 'total'
      ? 'bg-purple-100 text-purple-800 border-purple-200'
      : 'bg-blue-100 text-blue-800 border-blue-200';
  const modeIcon = mode === 'total' ? '👁️' : '👀';

  if (players.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className={`inline-block p-4 rounded-full ${modeColor} mb-4`}>
          <span className="text-4xl">{modeIcon}</span>
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-500">Aucun joueur pour ce mode</p>
      </div>
    );
  }

  // Re-rank players for this specific mode: level first then score
  const rankedPlayers = [...players]
    .sort((a, b) => {
      const la = a.levelNum || 0;
      const lb = b.levelNum || 0;
      if (lb !== la) return lb - la;
      return b.score - a.score;
    })
    .map((p, i) => ({ ...p, rank: i + 1 }));

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div
        className={`p-6 border-b-2 ${mode === 'total' ? 'border-purple-200 bg-purple-50' : 'border-blue-200 bg-blue-50'}`}
      >
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">{modeIcon}</span>
          <h3 className="text-2xl font-bold">{title}</h3>
        </div>
        <p className="text-center text-gray-600 mt-2">
          {players.length} joueur{players.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Top 3 */}
      {rankedPlayers.length > 0 && (
        <div className="p-6 bg-gray-50">
          <div
            className={`grid gap-4 ${rankedPlayers.length >= 3 ? 'grid-cols-3' : rankedPlayers.length === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}
          >
            {rankedPlayers.slice(0, 3).map((player, idx) => (
              <div
                key={player.id}
                className={`text-center p-4 rounded-xl ${
                  player.rank === 1
                    ? 'bg-yellow-100 border-2 border-yellow-400 scale-110'
                    : player.rank === 2
                      ? 'bg-gray-100 border-2 border-gray-400'
                      : 'bg-orange-50 border-2 border-orange-400'
                }`}
              >
                <div className={`text-3xl font-bold mb-1 ${getRankColor(player.rank)}`}>
                  #{player.rank}
                </div>
                <p className="font-semibold text-sm truncate">{player.username}</p>
                <p className="text-primary font-bold">{player.score.toLocaleString()} pts</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full List */}
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Joueur</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Score</th>
              <th className="px-4 py-3 text-center text-sm font-semibold">Badges</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rankedPlayers.map((player) => (
              <tr key={player.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className={`font-bold ${getRankColor(player.rank)}`}>#{player.rank}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900">{player.username}</span>
                  <p className="text-xs text-gray-500">{player.level}</p>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="font-bold text-primary">{player.score.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm">{player.achievements.slice(0, 2).join(' ')}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function LeaderboardTable() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      setLoading(true);
      const data = await fetchLeaderboard();
      setPlayers(data);
      setLoading(false);
    };

    loadLeaderboard();
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankColor = (rank: number): string => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-600';
  };

  // Separate players by mode
  const totalPlayers = players.filter((p) => p.mode === 'total');
  const partialPlayers = players.filter((p) => p.mode === 'partial');

  // Count unique users (extract userId from player.id which is "userId-characterName")
  const uniqueUserIds = new Set(players.map((p) => p.id.split('-')[0]));
  const uniqueTotalUserIds = new Set(totalPlayers.map((p) => p.id.split('-')[0]));
  const uniquePartialUserIds = new Set(partialPlayers.map((p) => p.id.split('-')[0]));

  return (
    <div className="max-w-7xl mx-auto">
      {/* Loading state */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-600">Chargement des classements...</p>
        </div>
      ) : (
        <>
          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Cécité totale */}
            <LeaderboardSection
              title="Cécité Totale"
              players={totalPlayers}
              mode="total"
              formatTime={formatTime}
              getRankColor={getRankColor}
            />

            {/* Cécité partielle */}
            <LeaderboardSection
              title="Cécité Partielle"
              players={partialPlayers}
              mode="partial"
              formatTime={formatTime}
              getRankColor={getRankColor}
            />
          </div>

          {/* Stats summary - showing unique users */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Joueurs uniques</p>
              <p className="text-3xl font-bold text-primary">{uniqueUserIds.size}</p>
              <p className="text-xs text-gray-400 mt-1">{players.length} parties jouées</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Cécité totale</p>
              <p className="text-3xl font-bold text-purple-600">{uniqueTotalUserIds.size}</p>
              <p className="text-xs text-gray-400 mt-1">{totalPlayers.length} parties</p>
            </div>
            <div className="bg-white rounded-2xl shadow p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Cécité partielle</p>
              <p className="text-3xl font-bold text-blue-600">{uniquePartialUserIds.size}</p>
              <p className="text-xs text-gray-400 mt-1">{partialPlayers.length} parties</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
