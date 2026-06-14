import { useState } from 'react';

interface Stats {
  activePlayers: number;
  totalSessions: number;
  avgCompletionTime: number;
  successRate: number;
}

interface RecentActivity {
  id: string;
  username: string;
  action: string;
  timestamp: string;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'data' | 'settings'>(
    'overview'
  );

  // Mock data
  const stats: Stats = {
    activePlayers: 1247,
    totalSessions: 15893,
    avgCompletionTime: 52,
    successRate: 78.5,
  };

  const recentActivity: RecentActivity[] = [
    {
      id: '1',
      username: 'SoundMaster',
      action: 'Completed level: Supermarché',
      timestamp: 'Il y a 2 min',
    },
    {
      id: '2',
      username: 'EchoNavigator',
      action: 'New high score: 2,450,000',
      timestamp: 'Il y a 5 min',
    },
    { id: '3', username: 'AudioExplorer', action: 'Started session', timestamp: 'Il y a 8 min' },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock authentication - replace with real auth
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Mot de passe incorrect');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="display-text text-3xl mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Les Ombres du Son</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Entrez le mot de passe"
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Se connecter
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-500 text-center">
            Demo: utilisez "admin123" pour vous connecter
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container-custom px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="display-text text-2xl">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Les Ombres du Son</p>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="btn bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom px-4">
          <nav className="flex gap-8">
            {(['overview', 'analytics', 'data', 'settings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'overview' && "Vue d'ensemble"}
                {tab === 'analytics' && 'Analytics'}
                {tab === 'data' && 'Données'}
                {tab === 'settings' && 'Paramètres'}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card">
                <p className="text-sm text-gray-600 mb-2">Joueurs actifs</p>
                <p className="stat-number text-4xl text-primary mb-1">
                  {stats.activePlayers.toLocaleString('fr-FR')}
                </p>
                <p className="text-xs text-green-600">↑ +12% cette semaine</p>
              </div>

              <div className="card">
                <p className="text-sm text-gray-600 mb-2">Sessions totales</p>
                <p className="stat-number text-4xl text-secondary mb-1">
                  {stats.totalSessions.toLocaleString('fr-FR')}
                </p>
                <p className="text-xs text-green-600">↑ +8% cette semaine</p>
              </div>

              <div className="card">
                <p className="text-sm text-gray-600 mb-2">Temps moyen</p>
                <p className="stat-number text-4xl text-accent mb-1">{stats.avgCompletionTime}s</p>
                <p className="text-xs text-gray-600">Par niveau</p>
              </div>

              <div className="card">
                <p className="text-sm text-gray-600 mb-2">Taux de réussite</p>
                <p className="stat-number text-4xl text-success mb-1">{stats.successRate}%</p>
                <p className="text-xs text-green-600">↑ +3% cette semaine</p>
              </div>
            </div>

            {/* Recent activity */}
            <div className="card">
              <h2 className="display-text text-xl mb-6">Activité récente</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{activity.username}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button className="card text-center hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="font-semibold mb-2">Exporter les données</h3>
                <p className="text-sm text-gray-600">CSV, JSON, Excel</p>
              </button>

              <button className="card text-center hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-3">📧</div>
                <h3 className="font-semibold mb-2">Notifications</h3>
                <p className="text-sm text-gray-600">Envoyer aux joueurs</p>
              </button>

              <button className="card text-center hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-3">⚙️</div>
                <h3 className="font-semibold mb-2">Configuration</h3>
                <p className="text-sm text-gray-600">Paramètres du jeu</p>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="card">
            <h2 className="display-text text-2xl mb-6">Analytics détaillées</h2>
            <p className="text-gray-600">
              Graphiques et visualisations de données (à implémenter avec Chart.js ou D3.js)
            </p>
            <div className="mt-8 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Graphiques à venir</p>
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="card">
            <h2 className="display-text text-2xl mb-6">Gestion des données</h2>
            <p className="text-gray-600 mb-6">Export et modération des données des joueurs</p>
            <div className="space-y-4">
              <button className="btn-primary">Exporter toutes les données (CSV)</button>
              <button className="btn-secondary ml-4">Exporter les statistiques (JSON)</button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="card">
            <h2 className="display-text text-2xl mb-6">Paramètres</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulté par défaut
                </label>
                <select className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg">
                  <option>Facile</option>
                  <option>Moyen</option>
                  <option>Difficile</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temps limite (secondes)
                </label>
                <input
                  type="number"
                  defaultValue={60}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <button className="btn-primary">Sauvegarder les modifications</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
