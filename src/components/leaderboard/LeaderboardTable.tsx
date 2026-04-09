import { useState, useEffect } from 'react';

interface Player {
    id: string;
    rank: number;
    username: string;
    score: number;
    level: string;
    mode: 'total' | 'partial';
    completionTime: number; // in seconds
    achievements: string[];
}

// Mock data - will be replaced with API call
const mockPlayers: Player[] = [
    {
        id: '1',
        rank: 1,
        username: 'SoundMaster',
        score: 2500000,
        level: 'Supermarché',
        mode: 'total',
        completionTime: 45,
        achievements: ['🏆', '⭐', '🎯'],
    },
    {
        id: '2',
        rank: 2,
        username: 'EchoNavigator',
        score: 2450000,
        level: 'Rue',
        mode: 'total',
        completionTime: 52,
        achievements: ['🏆', '⭐'],
    },
    {
        id: '3',
        rank: 3,
        username: 'AudioExplorer',
        score: 2400000,
        level: 'École',
        mode: 'partial',
        completionTime: 48,
        achievements: ['🏆', '🎯'],
    },
    // Add more mock players...
    ...Array.from({ length: 17 }, (_, i) => ({
        id: `${i + 4}`,
        rank: i + 4,
        username: `Player${i + 4}`,
        score: 2400000 - (i + 1) * 50000,
        level: ['Rue', 'Maison', 'École', 'Supermarché'][i % 4],
        mode: i % 2 === 0 ? 'total' as const : 'partial' as const,
        completionTime: 50 + i * 2,
        achievements: i % 3 === 0 ? ['🏆'] : ['⭐'],
    })),
];

type TimeFilter = 'daily' | 'weekly' | 'monthly' | 'all-time';
type ModeFilter = 'all' | 'total' | 'partial';

export default function LeaderboardTable() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [timeFilter, setTimeFilter] = useState<TimeFilter>('all-time');
    const [modeFilter, setModeFilter] = useState<ModeFilter>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            let filtered = [...mockPlayers];

            if (modeFilter !== 'all') {
                filtered = filtered.filter(p => p.mode === modeFilter);
            }

            setPlayers(filtered);
            setLoading(false);
        }, 500);
    }, [timeFilter, modeFilter]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getModeLabel = (mode: 'total' | 'partial'): string => {
        return mode === 'total' ? 'Cécité totale' : 'Cécité partielle';
    };

    const getRankColor = (rank: number): string => {
        if (rank === 1) return 'text-yellow-500';
        if (rank === 2) return 'text-gray-400';
        if (rank === 3) return 'text-orange-600';
        return 'text-gray-600';
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Filters */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                {/* Time filter */}
                <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-700 self-center mr-2">
                        Période :
                    </span>
                    {(['daily', 'weekly', 'monthly', 'all-time'] as TimeFilter[]).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setTimeFilter(filter)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${timeFilter === filter
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {filter === 'daily' && 'Quotidien'}
                            {filter === 'weekly' && 'Hebdomadaire'}
                            {filter === 'monthly' && 'Mensuel'}
                            {filter === 'all-time' && 'Tout temps'}
                        </button>
                    ))}
                </div>

                {/* Mode filter */}
                <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-medium text-gray-700 self-center mr-2">
                        Mode :
                    </span>
                    {(['all', 'total', 'partial'] as ModeFilter[]).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setModeFilter(filter)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${modeFilter === filter
                                    ? 'bg-secondary text-white'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {filter === 'all' && 'Tous'}
                            {filter === 'total' && 'Cécité totale'}
                            {filter === 'partial' && 'Cécité partielle'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading state */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="mt-4 text-gray-600">Chargement des classements...</p>
                </div>
            ) : (
                <>
                    {/* Top 3 podium */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {players.slice(0, 3).map((player) => (
                            <div
                                key={player.id}
                                className={`card text-center ${player.rank === 1 ? 'md:order-2 md:scale-110' : ''
                                    } ${player.rank === 2 ? 'md:order-1' : ''} ${player.rank === 3 ? 'md:order-3' : ''
                                    }`}
                            >
                                {/* Rank */}
                                <div className={`text-6xl font-bold mb-2 ${getRankColor(player.rank)}`}>
                                    #{player.rank}
                                </div>

                                {/* Username */}
                                <h3 className="display-text text-xl mb-2">{player.username}</h3>

                                {/* Score */}
                                <p className="stat-number text-2xl text-primary mb-2">
                                    {player.score.toLocaleString('fr-FR')} pts
                                </p>

                                {/* Details */}
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>Niveau : {player.level}</p>
                                    <p>Temps : {formatTime(player.completionTime)}</p>
                                    <p className="text-xs">{getModeLabel(player.mode)}</p>
                                </div>

                                {/* Achievements */}
                                <div className="mt-4 flex justify-center gap-2">
                                    {player.achievements.map((achievement, i) => (
                                        <span key={i} className="text-2xl">
                                            {achievement}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Full leaderboard table */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Rang
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Joueur
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Score
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Niveau
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Temps
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Mode
                                        </th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                                            Badges
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {players.map((player) => (
                                        <tr
                                            key={player.id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <span className={`font-bold ${getRankColor(player.rank)}`}>
                                                    #{player.rank}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-gray-900">
                                                    {player.username}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="stat-number text-primary">
                                                    {player.score.toLocaleString('fr-FR')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{player.level}</td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {formatTime(player.completionTime)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${player.mode === 'total'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                        }`}
                                                >
                                                    {getModeLabel(player.mode)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-1">
                                                    {player.achievements.map((achievement, i) => (
                                                        <span key={i} className="text-lg">
                                                            {achievement}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Stats summary */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card text-center">
                            <p className="text-sm text-gray-600 mb-2">Total de joueurs</p>
                            <p className="stat-number text-3xl text-primary">
                                {players.length.toLocaleString('fr-FR')}
                            </p>
                        </div>
                        <div className="card text-center">
                            <p className="text-sm text-gray-600 mb-2">Meilleur temps</p>
                            <p className="stat-number text-3xl text-accent">
                                {formatTime(Math.min(...players.map((p) => p.completionTime)))}
                            </p>
                        </div>
                        <div className="card text-center">
                            <p className="text-sm text-gray-600 mb-2">Score moyen</p>
                            <p className="stat-number text-3xl text-secondary">
                                {Math.floor(
                                    players.reduce((sum, p) => sum + p.score, 0) / players.length
                                ).toLocaleString('fr-FR')}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
