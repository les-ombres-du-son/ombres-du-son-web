import { useState, useEffect } from 'react';
import { signInWithPopup, onAuthStateChanged, type User } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';

interface QuizResults {
  answers: number[];
  score: number;
  total: number;
  timestamp: number;
}

interface QuizAuthProps {
  quizResults: QuizResults | null;
}

export default function QuizAuth({ quizResults: initialResults }: QuizAuthProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(initialResults);

  useEffect(() => {
    // Listen for quiz completion event
    const handleQuizCompleted = (event: CustomEvent<QuizResults>) => {
      setQuizResults(event.detail);
    };

    window.addEventListener('quizCompleted', handleQuizCompleted as EventListener);

    // Also check sessionStorage on mount
    const storedResults = sessionStorage.getItem('quizResults');
    if (storedResults) {
      setQuizResults(JSON.parse(storedResults));
    }

    return () => {
      window.removeEventListener('quizCompleted', handleQuizCompleted as EventListener);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && quizResults && !saved) {
        saveQuizResults(currentUser);
      }
    });

    return () => unsubscribe();
  }, [quizResults, saved]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      
      if (quizResults) {
        await saveQuizResults(result.user);
      }
    } catch (err: any) {
      console.error('Error signing in:', err);
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const saveQuizResults = async (currentUser: User) => {
    if (!quizResults || saved) return;

    try {
      const quizRef = doc(db, 'quiz_pre_installation', currentUser.uid);
      await setDoc(quizRef, {
        userId: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        answers: quizResults.answers,
        score: quizResults.score,
        total: quizResults.total,
        timestamp: quizResults.timestamp,
        completedAt: serverTimestamp()
      });
      
      setSaved(true);
    } catch (err) {
      console.error('Error saving quiz results:', err);
      setError('Erreur lors de la sauvegarde des résultats');
    }
  };

  if (user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-4 p-4 bg-green-900/30 border border-green-500 rounded-lg">
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-semibold">Connecté en tant que {user.displayName}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>

        {saved && (
          <div className="p-4 bg-blue-900/30 border border-blue-500 rounded-lg text-center">
            <p className="text-blue-300">✓ Vos réponses ont été enregistrées avec succès</p>
          </div>
        )}

        <div className="text-center">
          <a
            href={import.meta.env.PUBLIC_APK_DOWNLOAD_URL || '#'}
            download
            className="inline-block px-8 py-4 bg-green-600 hover:bg-green-500 rounded-lg font-semibold text-xl transition-colors"
          >
            📱 Télécharger l'Application
          </a>
          <p className="text-sm text-gray-400 mt-4">
            Format APK - Compatible Android 8.0+
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Après avoir joué, vous pourrez comparer vos résultats avant/après
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-lg text-center">
        Connectez-vous avec Google pour télécharger l'application
      </p>
      
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-500 rounded-lg text-center">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 rounded-lg font-semibold transition-colors flex items-center justify-center mx-auto gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span>Connexion en cours...</span>
        ) : (
          <>
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Se connecter avec Google
          </>
        )}
      </button>
    </div>
  );
}
