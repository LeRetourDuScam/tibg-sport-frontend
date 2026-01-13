import { HealthCategory, HealthLevel } from './HealthQuestionnaire.model';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  duration?: string;
  repetitions?: string;
  sets?: number;
  restTime?: string;
  videoUrl?: string;
  imageUrl?: string;
  category: ExerciseCategory;
  targetCategories: HealthCategory[]; // Catégories de santé ciblées
  difficulty: ExerciseDifficulty;
  suitableForHealthLevels: HealthLevel[]; // Niveaux de santé pour lesquels l'exercice est adapté
  contraindications?: string[]; // Contre-indications
  benefits: string[];
  equipment?: string[];
  instructions: string[];
}

export type ExerciseCategory =
  | 'cardio'
  | 'strength'
  | 'flexibility'
  | 'balance'
  | 'breathing'
  | 'relaxation'
  | 'core'
  | 'mobility';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * Programme d'exercices personnalisé basé sur le score de santé
 */
export interface ExerciseProgram {
  id: string;
  name: string;
  description: string;
  healthLevel: HealthLevel;
  targetCategories: HealthCategory[];
  exercises: ExerciseSession[];
  durationWeeks: number;
  frequencyPerWeek: number;
  createdAt: Date;
}

export interface ExerciseSession {
  day: number; // Jour de la semaine (1-7)
  exercises: SessionExercise[];
  totalDuration: number; // en minutes
  warmupIncluded: boolean;
  cooldownIncluded: boolean;
}

export interface SessionExercise {
  exercise: Exercise;
  order: number;
  sets: number;
  reps?: number;
  duration?: number; // en secondes
  restBetweenSets?: number; // en secondes
  notes?: string;
}

/**
 * Base de données d'exercices adaptés selon le niveau de santé
 */
export const EXERCISE_DATABASE: Exercise[] = [
  // === EXERCICES CARDIO ===
  {
    id: 'walking',
    name: 'Marche active',
    description: 'Marche à rythme soutenu pour améliorer l\'endurance cardiovasculaire',
    duration: '20-30 min',
    category: 'cardio',
    targetCategories: ['cardiovascular', 'metabolic', 'mental-health'],
    difficulty: 'beginner',
    suitableForHealthLevels: ['at-risk', 'needs-improvement', 'moderate', 'good', 'excellent'],
    benefits: ['Améliore la santé cardiaque', 'Brûle des calories', 'Réduit le stress', 'Accessible à tous'],
    contraindications: ['Douleur articulaire sévère'],
    instructions: [
      'Commencez par un échauffement de 5 minutes à rythme lent',
      'Augmentez progressivement le rythme jusqu\'à être légèrement essoufflé',
      'Maintenez une posture droite, regardez devant vous',
      'Balancez naturellement les bras',
      'Terminez par 5 minutes de marche lente pour récupérer'
    ]
  },
  {
    id: 'light-cycling',
    name: 'Vélo léger',
    description: 'Cyclisme à intensité modérée, idéal pour les articulations',
    duration: '15-25 min',
    category: 'cardio',
    targetCategories: ['cardiovascular', 'musculoskeletal', 'metabolic'],
    difficulty: 'beginner',
    suitableForHealthLevels: ['needs-improvement', 'moderate', 'good', 'excellent'],
    benefits: ['Sans impact sur les articulations', 'Renforce les jambes', 'Améliore l\'endurance'],
    equipment: ['Vélo ou vélo d\'appartement'],
    contraindications: ['Problèmes d\'équilibre sévères'],
    instructions: [
      'Réglez la selle à la bonne hauteur (jambe légèrement fléchie en bas de pédale)',
      'Commencez à faible résistance',
      'Maintenez une cadence confortable (60-80 tours/minute)',
      'Gardez le dos droit',
      'Augmentez progressivement la durée'
    ]
  },
  {
    id: 'swimming',
    name: 'Natation',
    description: 'Exercice complet sans impact, excellent pour tout le corps',
    duration: '20-30 min',
    category: 'cardio',
    targetCategories: ['cardiovascular', 'musculoskeletal', 'respiratory'],
    difficulty: 'intermediate',
    suitableForHealthLevels: ['needs-improvement', 'moderate', 'good', 'excellent'],
    benefits: ['Aucun impact', 'Travaille tout le corps', 'Améliore la respiration', 'Excellent pour le dos'],
    equipment: ['Accès à une piscine'],
    instructions: [
      'Échauffez-vous avec quelques longueurs en brasse',
      'Alternez les styles de nage',
      'Concentrez-vous sur la respiration',
      'Faites des pauses si nécessaire'
    ]
  },

  // === EXERCICES DE FORCE ===
  {
    id: 'wall-pushup',
    name: 'Pompes au mur',
    description: 'Version accessible des pompes pour débutants ou personnes à mobilité réduite',
    repetitions: '10-15',
    sets: 3,
    restTime: '60 sec',
    category: 'strength',
    targetCategories: ['musculoskeletal'],
    difficulty: 'beginner',
    suitableForHealthLevels: ['at-risk', 'needs-improvement', 'moderate', 'good', 'excellent'],
    benefits: ['Renforce les bras et la poitrine', 'Facile à adapter', 'Aucun équipement nécessaire'],
    instructions: [
      'Placez-vous face à un mur, bras tendus, mains à hauteur d\'épaules',
      'Gardez le corps droit des talons à la tête',
      'Fléchissez les coudes pour approcher la poitrine du mur',
      'Poussez pour revenir à la position initiale',
      'Expirez en poussant, inspirez en descendant'
    ]
  },
  {
    id: 'chair-squat',
    name: 'Squat sur chaise',
    description: 'Squat assisté pour renforcer les jambes en toute sécurité',
    repetitions: '10-12',
    sets: 3,
    restTime: '60 sec',
    category: 'strength',
    targetCategories: ['musculoskeletal'],
    difficulty: 'beginner',
    suitableForHealthLevels: ['at-risk', 'needs-improvement', 'moderate', 'good', 'excellent'],
    equipment: ['Chaise stable'],
    benefits: ['Renforce les quadriceps', 'Améliore l\'équilibre', 'Mouvement fonctionnel quotidien'],
    contraindications: ['Douleurs sévères aux genoux'],
    instructions: [
      'Tenez-vous debout devant une chaise',
      'Pieds écartés à largeur des hanches',
      'Descendez lentement comme pour vous asseoir',
      'Effleurez la chaise sans vous asseoir complètement',
      'Remontez en poussant sur les talons'
    ]
  },
  {
    id: 'plank-modified',
    name: 'Planche sur genoux',
    description: 'Gainage abdominal adapté pour débutants',
    duration: '20-30 sec',
    sets: 3,
    restTime: '45 sec',
    category: 'core',
    targetCategories: ['musculoskeletal'],
    difficulty: 'beginner',
    suitableForHealthLevels: ['needs-improvement', 'moderate', 'good', 'excellent'],
    benefits: ['Renforce le core', 'Améliore la posture', 'Protège le dos'],
    contraindications: ['Douleurs lombaires aiguës'],
    instructions: [
      'Mettez-vous à quatre pattes',
      'Descendez sur les avant-bras',
      'Gardez les genoux au sol',
      'Alignez tête, épaules et hanches',
      'Contractez les abdominaux et respirez normalement',
      'Maintenez la position'
    ]
  },
  {
    id: 'bodyweight-squat',
    name: 'Squat au poids du corps',
    description: 'Exercice fondamental pour les jambes et les fessiers',
    repetitions: '12-15',
    sets: 3,
    restTime: '60 sec',
    category: 'strength',
    targetCategories: ['musculoskeletal', 'metabolic'],
    difficulty: 'intermediate',
    suitableForHealthLevels: ['moderate', 'good', 'excellent'],
    benefits: ['Renforce tout le bas du corps', 'Améliore la mobilité', 'Brûle des calories'],
    contraindications: ['Problèmes de genoux sévères', 'Douleurs de hanche'],
    instructions: [
      'Pieds écartés légèrement plus que la largeur des épaules',
      'Descendez en poussant les fesses vers l\'arrière',
      'Gardez les genoux alignés avec les orteils',
      'Descendez jusqu\'à ce que les cuisses soient parallèles au sol',
      'Remontez en poussant sur les talons'
    ]
  },

  // === EXERCICES DE FLEXIBILITÉ ===
  {
    id: 'neck-stretch',
    name: 'Étirements du cou',
    description: 'Étirements doux pour soulager les tensions cervicales',
    duration: '30 sec par côté',
    category: 'flexibility',
    targetCategories: ['musculoskeletal', 'mental-health'],
    difficulty: 'beginner',
    suitableForHealthLevels: ['at-risk', 'needs-improvement', 'moderate', 'good', 'excellent'],
    benefits: ['Soulage les tensions', 'Améliore la mobilité cervicale', 'Réduit les maux de tête'],
    instructions: [
      'Asseyez-vous ou tenez-vous debout avec une bonne posture',
      'Inclinez lentement la tête vers l\'épaule droite',
      'Utilisez la main droite pour appliquer une légère pression',
      'Maintenez 30 secondes en respirant profondément',
      'Répétez de l\'autre côté'
    ]
  },
  {
    id: 'hip-flexor-stretch',
    name: 'Étirement des fléchisseurs de hanche',
    description: 'Étirement essentiel pour contrer les effets de la position assise',
    duration: '30-45 sec par côté',
    category: 'flexibility',
    targetCategories: ['musculoskeletal', 'lifestyle'],
    difficulty: 'beginner',
    suitableForHealthLevels: ['needs-improvement', 'moderate', 'good', 'excellent'],
    benefits: ['Améliore la posture', 'Soulage le bas du dos', 'Augmente la mobilité des hanches'],
    contraindications: ['Douleurs aiguës de hanche'],
    instructions: [
      'Mettez-vous en position de fente, genou arrière au sol',
      'Gardez le buste droit',
      'Avancez légèrement le bassin vers l\'avant',
      'Vous devez ressentir un étirement à l\'avant de la hanche arrière',
      'Maintenez et respirez profondément'
    ]
  },
  {
    id: 'hamstring-stretch',
    name: 'Étirement des ischio-jambiers',
    description: 'Étirement des muscles à l\'arrière des cuisses',
    duration: '30-45 sec par côté',
    category: 'flexibility',
    targetCategories: ['musculoskeletal'],
    difficulty: 'beginner',
    suitableForHealthLevels: ['needs-improvement', 'moderate', 'good', 'excellent'],
    benefits: ['Améliore la flexibilité', 'Soulage le bas du dos', 'Prévient les blessures'],
    instructions: [
      'Asseyez-vous au sol, une jambe tendue devant vous',
      'Pliez l\'autre jambe, pied contre l\'intérieur de la cuisse',
      'Penchez-vous lentement vers l\'avant depuis les hanches',
      'Gardez le dos droit',
      'Atteignez votre pied ou votre cheville'
    ]
  },

  // === EXERCICES D'ÉQUILIBRE ===
  {
    id: 'single-leg-stand',
    name: 'Équilibre sur une jambe',
    description: 'Exercice simple pour améliorer l\'équilibre et la proprioception',
    duration: '30 sec par jambe',
    sets: 3,
    category: 'balance',
    targetCategories: ['musculoskeletal', 'cardiovascular'],
    difficulty: 'beginner',
    suitableForHealthLevels: ['needs-improvement', 'moderate', 'good', 'excellent'],
    benefits: ['Améliore l\'équilibre', 'Renforce les chevilles', 'Prévient les chutes'],
    contraindications: ['Vertiges fréquents'],
    instructions: [
      'Tenez-vous près d\'un mur ou d\'une chaise pour le support si nécessaire',
      'Soulevez un pied du sol',
      'Gardez le regard fixe sur un point devant vous',
      'Maintenez 30 secondes',
      'Changez de jambe'
    ]
  },
  {
    id: 'heel-toe-walk',
    name: 'Marche talon-pointe',
    description: 'Marche en ligne pour améliorer l\'équilibre dynamique',
    duration: '2-3 min',
    category: 'balance',
    targetCategories: ['musculoskeletal', 'cardiovascular'],
    difficulty: 'beginner',
    suitableForHealthLevels: ['needs-improvement', 'moderate', 'good', 'excellent'],
    benefits: ['Améliore la coordination', 'Renforce les muscles stabilisateurs', 'Améliore la démarche'],
    instructions: [
      'Marchez en ligne droite',
      'Placez le talon d\'un pied directement devant les orteils de l\'autre',
      'Gardez les bras écartés pour l\'équilibre si nécessaire',
      'Avancez lentement et de manière contrôlée',
      'Faites 10-15 pas, puis retournez'
    ]
  },

  // === EXERCICES DE RESPIRATION ET RELAXATION ===
  {
    id: 'deep-breathing',
    name: 'Respiration profonde',
    description: 'Technique de respiration pour réduire le stress et améliorer l\'oxygénation',
    duration: '5-10 min',
    category: 'breathing',
    targetCategories: ['respiratory', 'mental-health', 'cardiovascular'],
    difficulty: 'beginner',
    suitableForHealthLevels: ['at-risk', 'needs-improvement', 'moderate', 'good', 'excellent'],
    benefits: ['Réduit le stress', 'Améliore la capacité pulmonaire', 'Baisse la tension artérielle', 'Améliore la concentration'],
    instructions: [
      'Asseyez-vous confortablement ou allongez-vous',
      'Placez une main sur la poitrine, l\'autre sur le ventre',
      'Inspirez lentement par le nez pendant 4 secondes',
      'Le ventre doit se gonfler, la poitrine bouger peu',
      'Retenez votre souffle pendant 2 secondes',
      'Expirez lentement par la bouche pendant 6 secondes',
      'Répétez 10 fois'
    ]
  },
  {
    id: 'body-scan',
    name: 'Scan corporel (relaxation)',
    description: 'Technique de relaxation progressive pour relâcher les tensions',
    duration: '10-15 min',
    category: 'relaxation',
    targetCategories: ['mental-health', 'musculoskeletal'],
    difficulty: 'beginner',
    suitableForHealthLevels: ['at-risk', 'needs-improvement', 'moderate', 'good', 'excellent'],
    benefits: ['Réduit l\'anxiété', 'Améliore le sommeil', 'Relâche les tensions musculaires'],
    instructions: [
      'Allongez-vous confortablement',
      'Fermez les yeux et respirez calmement',
      'Concentrez-vous sur vos pieds, détendez-les',
      'Remontez progressivement : mollets, cuisses, hanches...',
      'Continuez jusqu\'au sommet de la tête',
      'Prenez conscience des zones de tension et relâchez-les'
    ]
  },
  {
    id: 'diaphragmatic-breathing',
    name: 'Respiration diaphragmatique',
    description: 'Respiration abdominale profonde pour améliorer la fonction respiratoire',
    duration: '5-10 min',
    category: 'breathing',
    targetCategories: ['respiratory', 'cardiovascular', 'mental-health'],
    difficulty: 'beginner',
    suitableForHealthLevels: ['at-risk', 'needs-improvement', 'moderate', 'good', 'excellent'],
    benefits: ['Améliore l\'efficacité respiratoire', 'Réduit l\'essoufflement', 'Calme le système nerveux'],
    instructions: [
      'Allongez-vous sur le dos, genoux pliés',
      'Placez une main sur la poitrine, l\'autre sur le ventre',
      'Inspirez par le nez, seul le ventre doit monter',
      'Expirez lentement par les lèvres pincées',
      'La main sur la poitrine doit rester immobile',
      'Pratiquez 5-10 minutes par jour'
    ]
  },

  // === EXERCICES DE MOBILITÉ ===
  {
    id: 'shoulder-circles',
    name: 'Cercles d\'épaules',
    description: 'Mobilisation douce des articulations de l\'épaule',
    repetitions: '10 dans chaque sens',
    sets: 2,
    category: 'mobility',
    targetCategories: ['musculoskeletal'],
    difficulty: 'beginner',
    suitableForHealthLevels: ['at-risk', 'needs-improvement', 'moderate', 'good', 'excellent'],
    benefits: ['Améliore la mobilité des épaules', 'Soulage les tensions', 'Échauffement idéal'],
    instructions: [
      'Tenez-vous debout, bras le long du corps',
      'Soulevez les épaules vers les oreilles',
      'Roulez-les vers l\'arrière, puis vers le bas',
      'Faites des cercles lents et contrôlés',
      'Changez de direction après 10 répétitions'
    ]
  },
  {
    id: 'ankle-circles',
    name: 'Cercles de chevilles',
    description: 'Mobilisation des articulations de la cheville',
    repetitions: '10 dans chaque sens',
    sets: 2,
    category: 'mobility',
    targetCategories: ['musculoskeletal'],
    difficulty: 'beginner',
    suitableForHealthLevels: ['at-risk', 'needs-improvement', 'moderate', 'good', 'excellent'],
    benefits: ['Améliore la mobilité des chevilles', 'Prévient les entorses', 'Améliore l\'équilibre'],
    instructions: [
      'Asseyez-vous ou tenez-vous sur une jambe',
      'Soulevez un pied du sol',
      'Faites tourner le pied en cercles',
      '10 cercles dans un sens, puis dans l\'autre',
      'Changez de pied'
    ]
  },
  {
    id: 'cat-cow',
    name: 'Chat-Vache',
    description: 'Mobilisation de la colonne vertébrale inspirée du yoga',
    repetitions: '10-15',
    sets: 2,
    category: 'mobility',
    targetCategories: ['musculoskeletal'],
    difficulty: 'beginner',
    suitableForHealthLevels: ['needs-improvement', 'moderate', 'good', 'excellent'],
    benefits: ['Assouplit la colonne', 'Soulage les douleurs dorsales', 'Améliore la posture'],
    contraindications: ['Hernie discale aiguë'],
    instructions: [
      'Mettez-vous à quatre pattes, mains sous les épaules',
      'Position Vache : Creusez le dos, levez la tête',
      'Inspirez dans cette position',
      'Position Chat : Arrondissez le dos, rentrez le menton',
      'Expirez dans cette position',
      'Alternez fluidement entre les deux positions'
    ]
  }
];

/**
 * Fonction pour obtenir les exercices adaptés à un niveau de santé
 */
export function getExercisesForHealthLevel(healthLevel: HealthLevel): Exercise[] {
  return EXERCISE_DATABASE.filter(exercise =>
    exercise.suitableForHealthLevels.includes(healthLevel)
  );
}

/**
 * Fonction pour obtenir les exercices ciblant une catégorie de santé spécifique
 */
export function getExercisesForCategory(category: HealthCategory): Exercise[] {
  return EXERCISE_DATABASE.filter(exercise =>
    exercise.targetCategories.includes(category)
  );
}

/**
 * Fonction pour obtenir les exercices adaptés à un profil (niveau + catégories faibles)
 */
export function getRecommendedExercises(
  healthLevel: HealthLevel,
  weakCategories: HealthCategory[]
): Exercise[] {
  const suitableExercises = getExercisesForHealthLevel(healthLevel);

  // Prioriser les exercices ciblant les catégories faibles
  const prioritized = suitableExercises.filter(exercise =>
    exercise.targetCategories.some(cat => weakCategories.includes(cat))
  );

  // Si pas assez d'exercices ciblés, ajouter d'autres exercices adaptés
  if (prioritized.length < 5) {
    const others = suitableExercises.filter(ex => !prioritized.includes(ex));
    return [...prioritized, ...others.slice(0, 5 - prioritized.length)];
  }

  return prioritized;
}
