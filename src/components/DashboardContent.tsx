import { useState, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';
import { ref, onValue } from 'firebase/database';
import { auth, googleProvider, db, rtdb } from '../lib/firebase';

// Cloud Function URL for secure APK download
const CLOUD_FUNCTION_URL =
  'https://europe-west1-les-ombres-du-son-483614.cloudfunctions.net/getApkDownloadUrl';
const FALLBACK_APK_URL =
  'https://storage.googleapis.com/les-ombres-du-son-483614-mobile-releases/releases/les-ombres-du-son-latest.apk';

// Download button component that calls Cloud Function
function DownloadButton({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call Cloud Function to get signed URL
      const response = await fetch(CLOUD_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get download URL');
      }

      // Force file download using anchor element
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = 'les-ombres-du-son-latest.apk';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Erreur de téléchargement. Tentative alternative...');

      // Fallback: direct download with force
      try {
        const link = document.createElement('a');
        link.href = FALLBACK_APK_URL;
        link.download = 'les-ombres-du-son-latest.apk';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (fallbackErr) {
        // fallback failed silently
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className="block w-full bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg text-center transition-all hover:scale-105 shadow-lg disabled:opacity-50"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
            Préparation du téléchargement...
          </span>
        ) : (
          "📥 Télécharger l'APK"
        )}
      </button>
    </div>
  );
}

interface LeaderboardEntry {
  userId: string;
  displayName: string;
  score: number;
  completedAt: string;
  character?: string;
  levelsCompleted?: string;
}

interface CharacterProgress {
  character: string;
  globalScore: number;
  levelScores: Record<string, number>;
  currentLevel?: number;
  gameFinished?: boolean;
  visionIndex?: number;
  lastUpdated?: string;
}

interface GameProgress {
  character?: string;
  introFinished?: boolean;
  introCurrentStep?: number;
  niveau1Score?: number;
  niveau2Score?: number;
  niveau3Score?: number;
  niveau4Score?: number;
  niveau5Score?: number;
  globalScore?: number;
  profil?: string;
  lastUpdated?: string;
  levelScores?: Record<string, number>;
  currentLevel?: number;
  gameFinished?: boolean;
}

export default function DashboardContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [gameProgress, setGameProgress] = useState<GameProgress | null>(null);
  const [characterProgress, setCharacterProgress] = useState<CharacterProgress[]>([]);
  const [loadingGameProgress, setLoadingGameProgress] = useState(false);
  const [finalQuizScore, setFinalQuizScore] = useState<number | null>(null);
  const [quizComparison, setQuizComparison] = useState<{
    startScore: number | null;
    endScore: number | null;
    endQuizFound: boolean;
    improvement: number;
  }>({ startScore: null, endScore: null, endQuizFound: false, improvement: 0 });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await checkQuizCompletion(currentUser.uid, currentUser.email);
        await loadGameProgress(currentUser.uid);
        loadLeaderboard();

        // Clear quiz completion flags after checking
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('quizJustCompleted');
          sessionStorage.removeItem('quizSaved');
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const checkQuizCompletion = async (userId: string, userEmail?: string | null) => {
    try {
      // Direct lookup - document ID = userId
      const quizRef = doc(db, 'quiz_pre_installation', userId);
      const quizSnap = await getDoc(quizRef);

      if (quizSnap.exists()) {
        const data = quizSnap.data();
        setHasCompletedQuiz(true);
        setQuizScore(data.score || 0);
        return;
      }

      // Fallback: search all documents by email if uid doesn't match
      if (userEmail) {
        const allQuizQuery = query(collection(db, 'quiz_pre_installation'), limit(100));
        const snapshot = await getDocs(allQuizQuery);

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          if (data.email === userEmail || data.userId === userId) {
            setHasCompletedQuiz(true);
            setQuizScore(data.score || 0);
            return;
          }
        }
      }

      setHasCompletedQuiz(false);
      setQuizScore(null);
    } catch (error) {
      setHasCompletedQuiz(false);
    }
  };

  const loadLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const usersQuery = query(collection(db, 'Users'), limit(100));
      const usersSnapshot = await getDocs(usersQuery);
      let entries: LeaderboardEntry[] = [];

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userId = userDoc.id;

        // Get Games subcollection for this user
        const gamesQuery = query(collection(db, 'Users', userId, 'Games'));
        const gamesSnapshot = await getDocs(gamesQuery);

        if (!gamesSnapshot.empty) {
          // For each character (Cécilia, Lum, etc.)
          for (const gameDoc of gamesSnapshot.docs) {
            const gameData = gameDoc.data();
            const characterName = gameDoc.id; // "Cécilia (cécité totale)"

            // Get LevelStats subcollection
            const levelStatsQuery = query(
              collection(db, 'Users', userId, 'Games', gameDoc.id, 'LevelStats')
            );
            const levelStatsSnap = await getDocs(levelStatsQuery);

            let totalScore = 0;
            let maxScore = 0;
            let completedLevels = 0;
            let totalLevels = 0;

            // Calculate score from each level
            levelStatsSnap.docs.forEach((levelDoc) => {
              const levelData = levelDoc.data();
              const levelScore =
                levelData.score || levelData.totalScore || levelData.bestScore || 0;
              const levelMax = levelData.maxScore || levelData.possibleScore || 100;

              totalScore += levelScore;
              maxScore += levelMax;
              completedLevels++;
              totalLevels++;
            });

            // Also add any global score if available
            const globalScore = gameData.globalScore || gameData.totalScore || 0;
            if (globalScore > totalScore) {
              totalScore = globalScore;
            }

            if (totalScore > 0 || completedLevels > 0) {
              entries.push({
                userId: userId,
                displayName: userData.displayName || userData.userName || 'Joueur anonyme',
                score: totalScore,
                character: characterName,
                levelsCompleted: `${completedLevels}/${levelStatsSnap.docs.length}`,
                completedAt:
                  gameData.lastUpdate?.toDate?.()?.toLocaleDateString('fr-FR') ||
                  gameData.lastUpdated?.toDate?.()?.toLocaleDateString('fr-FR') ||
                  'N/A',
              });
            }
          }
        }
      }

      // Sort by score desc
      entries.sort((a, b) => b.score - a.score);
      entries = entries.slice(0, 10);

      setLeaderboard(entries);
    } catch (error) {
      // silently handle leaderboard errors
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const loadGameProgress = async (userId: string) => {
    setLoadingGameProgress(true);
    try {
      // Charger le quiz final (score après le jeu)
      const finalQuizRef = doc(db, 'quiz_final', userId);
      const finalQuizSnap = await getDoc(finalQuizRef);

      if (finalQuizSnap.exists()) {
        setFinalQuizScore(finalQuizSnap.data().score || 0);
      }

      // Chercher dans Users/{userId}/Games avec LevelStats
      const gamesQuery = query(collection(db, 'Users', userId, 'Games'));
      const gamesSnap = await getDocs(gamesQuery);

      if (!gamesSnap.empty) {
        const allCharacters: CharacterProgress[] = [];
        let bestGame: any = null;
        let bestScore = 0;

        for (const gameDoc of gamesSnap.docs) {
          const gameData = gameDoc.data();
          const characterName = gameDoc.id;

          // Get LevelStats for this character
          const levelStatsQuery = query(
            collection(db, 'Users', userId, 'Games', gameDoc.id, 'LevelStats')
          );
          const levelStatsSnap = await getDocs(levelStatsQuery);

          let totalScore = 0;
          const levelScores: Record<string, number> = {};

          // Check if it's Cécilia (cécité totale) or Lum (cécité partielle)
          const charNameLower = characterName.toLowerCase();
          const isCecilia =
            charNameLower.includes('cécilia') ||
            charNameLower.includes('cecilia') ||
            charNameLower.includes('total');

          if (isCecilia) {
            // For Cécilia: sum score_global from each LevelStats document, then average
            let sumScore = 0;
            let validLevels = 0;

            levelStatsSnap.docs.forEach((levelDoc) => {
              const levelData = levelDoc.data();
              const levelScore =
                levelData.score_global ??
                levelData.scoreGlobal ??
                levelData.globalScore ??
                levelData.score ??
                levelData.bestScore ??
                levelData.totalScore ??
                0;

              if (levelScore > 0) {
                sumScore += levelScore;
                validLevels++;
                levelScores[levelDoc.id] = levelScore;
              }
            });

            // Average per level
            totalScore = validLevels > 0 ? Math.round(sumScore / validLevels) : 0;
          } else {
            // For Lum: use score_global from game document
            const gameGlobalScore =
              gameData.score_global ??
              gameData.scoreGlobal ??
              gameData.globalScore ??
              gameData.score ??
              0;
            totalScore = gameGlobalScore;
          }

          // Add to character list
          const charProgress: CharacterProgress = {
            character: characterName,
            globalScore: totalScore,
            levelScores: levelScores,
            currentLevel: gameData.currentLevel,
            gameFinished: gameData.gameFinished,
            visionIndex: gameData.visionIndex,
            lastUpdated: gameData.lastUpdate || gameData.lastUpdated,
          };
          allCharacters.push(charProgress);

          // Track best game for backward compatibility
          if (totalScore > bestScore) {
            bestScore = totalScore;
            bestGame = {
              character: characterName,
              globalScore: totalScore,
              profil: characterName.replace(/\s*\([^)]*\)/, ''),
              lastUpdated: gameData.lastUpdate || gameData.lastUpdated,
              levelScores: levelScores,
              currentLevel: gameData.currentLevel,
              gameFinished: gameData.gameFinished,
            };
          }
        }

        setCharacterProgress(allCharacters);
        setGameProgress(bestGame);

        // Look for Niveau5_Quiz in any character's LevelStats to get final quiz score
        let endQuizScore: number | null = null;
        for (const char of allCharacters) {
          try {
            const quizDocRef = doc(
              db,
              'Users',
              userId,
              'Games',
              char.character,
              'LevelStats',
              'Niveau5_Quiz'
            );
            const quizSnap = await getDoc(quizDocRef);

            if (quizSnap.exists()) {
              const quizData = quizSnap.data();
              // Try to get score from metriques or directly
              const metriques = quizData.metriques || quizData.metrics || {};
              endQuizScore =
                metriques.reponses_correctes ?? quizData.score ?? quizData.score_global ?? null;

              if (endQuizScore !== null) {
                break; // Found it, no need to check other characters
              }
            }
          } catch (err) {
            // quiz not found for this character
          }
        }

        // Calculate comparison
        const startScore = quizScore; // This is set from checkQuizCompletion
        if (startScore !== null) {
          let improvement = 0;
          if (endQuizScore !== null && startScore > 0) {
            improvement = Math.round(((endQuizScore - startScore) / startScore) * 100);
          }

          setQuizComparison({
            startScore,
            endScore: endQuizScore,
            endQuizFound: endQuizScore !== null,
            improvement,
          });
        }
      }
    } catch (error) {
      // silently handle game progress errors
    } finally {
      setLoadingGameProgress(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      // Gestion spécifique des erreurs Firebase Auth
      let errorMessage = 'Erreur lors de la connexion.';

      if (error.code === 'auth/popup-blocked') {
        errorMessage =
          'Le popup de connexion a été bloqué. Veuillez autoriser les popups pour ce site.';
      } else if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Vous avez fermé la fenêtre de connexion.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = "Ce domaine n'est pas autorisé. Contactez l'administrateur.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Une autre tentative de connexion est en cours.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage + ' Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      // silently handle sign out errors
    }
  };

  // Page de connexion
  if (!user) {
    // Check if we have a pending quiz completion to redirect after login
    const pendingQuiz =
      typeof window !== 'undefined' && sessionStorage.getItem('quizJustCompleted') === 'true';

    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl text-center">
            <div className="mb-8">
              <img src="/logo.png" alt="Les Ombres du Son" className="w-32 h-32 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-white mb-4">Bienvenue !</h1>
              <p className="text-gray-300">
                Connectez-vous pour accéder au téléchargement de l'application et voir le classement
                des joueurs.
              </p>
            </div>

            {pendingQuiz && (
              <div className="mb-6 p-4 bg-green-900/30 border border-green-500 rounded-lg">
                <p className="text-green-300 text-sm text-center">
                  ✓ Quiz complété ! Connectez-vous pour télécharger l'application.
                </p>
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <span>Connexion en cours...</span>
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Se connecter avec Google
                </>
              )}
            </button>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400">
                En vous connectant, vous acceptez notre{' '}
                <a href="/politique-confidentialite" className="text-blue-400 hover:underline">
                  Politique de Confidentialité
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard utilisateur connecté
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <img
            src={user.photoURL || '/logo.png'}
            alt={user.displayName || 'User'}
            className="w-16 h-16 rounded-full border-4 border-primary"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">
              Bonjour, {user.displayName?.split(' ')[0] || 'Joueur'} !
            </h1>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Déconnexion
        </button>
      </div>

      {/* Progression du jeu (si disponible) */}
      {finalQuizScore !== null && (
        <div className="mb-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            🎮 Votre Progression
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700/50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-400 mb-1">Quiz Pré-installation</p>
              <p className="text-2xl font-bold text-primary">{quizScore}/6</p>
              <p className="text-xs text-gray-500">Avant le jeu</p>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-400 mb-1">Score Final</p>
              <p className="text-2xl font-bold text-green-400">{finalQuizScore}/6</p>
              <p className="text-xs text-gray-500">Après le jeu</p>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-400 mb-1">Progression</p>
              <p
                className={`text-2xl font-bold ${finalQuizScore > (quizScore || 0) ? 'text-green-400' : 'text-yellow-400'}`}
              >
                {finalQuizScore > (quizScore || 0) ? '↗ +' : '→ '}
                {Math.abs(finalQuizScore - (quizScore || 0))} pts
              </p>
              <p className="text-xs text-gray-500">
                {finalQuizScore > (quizScore || 0) ? 'Vous avez progressé !' : 'Stable'}
              </p>
            </div>
          </div>
          {gameProgress?.profil && (
            <div className="mt-4 p-3 bg-primary/10 rounded-lg">
              <p className="text-sm text-center">
                <span className="text-gray-400">Profil détecté :</span>{' '}
                <span className="text-primary font-semibold">{gameProgress.profil}</span>
              </p>
            </div>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Téléchargement APK */}
        <div className="bg-gradient-to-br from-primary via-accent to-secondary rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-6">Télécharger l'Application</h2>

          {!hasCompletedQuiz ? (
            // Quiz non complété - Afficher le CTA
            <>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-white font-semibold text-lg mb-2">
                    Quiz de sensibilisation requis
                  </p>
                  <p className="text-white/70 text-sm">
                    Avant de télécharger l'application, nous vous invitons à répondre à 6 questions
                    sur le handicap visuel.
                  </p>
                </div>
              </div>

              <a
                href="/quiz-pre-installation"
                className="block w-full bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg text-center transition-all hover:scale-105 shadow-lg"
              >
                🎯 Commencer le Quiz
              </a>

              <p className="text-white/70 text-sm mt-4 text-center">Durée estimée : 3-5 minutes</p>
            </>
          ) : (
            // Quiz complété - Afficher le téléchargement
            <>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-lg">Android APK</p>
                    <p className="text-white/70 text-sm">Version compatible Android 8.0+</p>
                  </div>
                  <div className="text-right">
                    <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      ✓ Quiz complété
                    </div>
                    <p className="text-white/70 text-xs mt-1">Score: {quizScore}/6</p>
                  </div>
                </div>
              </div>

              <DownloadButton userId={user.uid} />
            </>
          )}
        </div>

        {/* Ma Progression */}
        <div className="bg-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">📊 Ma Progression</h2>
            <button
              onClick={loadLeaderboard}
              disabled={loadingLeaderboard}
              className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loadingLeaderboard ? '⟳' : '🔄'}
            </button>
          </div>

          {loadingLeaderboard ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="text-gray-400 mt-4">Chargement...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Quiz Score */}
              <div className="bg-gray-700/50 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-1">Quiz de sensibilisation</p>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-white">
                    {quizScore !== null ? `${quizScore}/6` : 'Non complété'}
                  </p>
                  {hasCompletedQuiz && (
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                      ✓ Complété
                    </span>
                  )}
                </div>
              </div>

              {/* Comparaison Quiz - Évolution de la compréhension */}
              {quizComparison.startScore !== null && (
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-4">
                  <p className="text-green-400 text-sm mb-3 font-medium">
                    📈 Évolution de la compréhension
                  </p>

                  <div className="flex items-center justify-between mb-3">
                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-1">Quiz de départ</p>
                      <p className="text-xl font-bold text-white">{quizComparison.startScore}/6</p>
                    </div>

                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-500 to-green-500 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.max(0, quizComparison.improvement)}%` }}
                        />
                      </div>
                      {quizComparison.endScore !== null ? (
                        <p className="text-center text-green-400 text-xs mt-2">
                          +{quizComparison.improvement}% d'amélioration
                        </p>
                      ) : (
                        <p className="text-center text-gray-400 text-xs mt-2">
                          Continuez le jeu pour le quiz final
                        </p>
                      )}
                    </div>

                    <div className="text-center">
                      <p className="text-gray-400 text-xs mb-1">Quiz de fin</p>
                      {quizComparison.endScore !== null ? (
                        <p className="text-xl font-bold text-green-400">
                          {quizComparison.endScore}/6
                        </p>
                      ) : (
                        <p className="text-xl font-bold text-gray-500">-</p>
                      )}
                    </div>
                  </div>

                  {quizComparison.endScore !== null &&
                    quizComparison.endScore > (quizComparison.startScore || 0) && (
                      <div className="bg-green-500/20 rounded-lg p-2 text-center">
                        <p className="text-green-400 text-sm">
                          🎉 Votre compréhension de l'accessibilité s'est améliorée !
                        </p>
                      </div>
                    )}
                </div>
              )}

              {/* Scores par personnage */}
              {characterProgress.length > 0 ? (
                characterProgress.map((char) => {
                  const isTotal = char.character.toLowerCase().includes('total');
                  const isCecilia =
                    char.character.toLowerCase().includes('cécilia') ||
                    char.character.toLowerCase().includes('cecilia') ||
                    isTotal;
                  const modeColor = isTotal
                    ? 'bg-purple-500/20 border-purple-500/30'
                    : 'bg-blue-500/20 border-blue-500/30';
                  const modeText = isTotal ? 'text-purple-400' : 'text-blue-400';
                  const modeLabel = isTotal ? 'Cécité totale' : 'Cécité partielle';

                  // Determine if finished: Cecilia uses gameFinished, Lum uses visionIndex === 6
                  const isFinished = isCecilia ? char.gameFinished : char.visionIndex === 6;

                  return (
                    <div key={char.character} className={`${modeColor} border rounded-xl p-4`}>
                      <div className="flex items-center justify-between mb-2">
                        <p className={`${modeText} text-sm font-medium`}>{modeLabel}</p>
                        {isFinished && <span className="text-green-400 text-xs">✓ Terminé</span>}
                      </div>
                      <p className="text-white font-semibold mb-1">
                        {char.character.replace(/\s*\([^)]*\)/, '')}
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {char.globalScore.toLocaleString()} pts
                      </p>
                      {(isCecilia ? char.currentLevel : char.visionIndex) && (
                        <p className="text-gray-400 text-xs mt-1">
                          Niveau {isCecilia ? char.currentLevel : char.visionIndex}
                        </p>
                      )}
                    </div>
                  );
                })
              ) : gameProgress?.character ? (
                // Fallback for backward compatibility
                <div className="bg-primary/10 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Score total dans le jeu</p>
                  <p className="text-2xl font-bold text-primary">
                    {gameProgress.globalScore?.toLocaleString() || '0'} pts
                  </p>
                  {gameProgress.gameFinished && (
                    <span className="text-green-400 text-sm">✓ Jeu terminé</span>
                  )}
                </div>
              ) : null}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-700 space-y-3">
            <a
              href="/leaderboard"
              className="block text-center text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              🏆 Voir le classement global →
            </a>
            <a
              href="/"
              className="block text-center text-gray-400 hover:text-white transition-colors"
            >
              ← Retour à l'expérience
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
