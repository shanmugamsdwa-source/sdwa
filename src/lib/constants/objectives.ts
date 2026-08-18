import { AssociationObjectiveFormData } from '@/types';

export interface OfficialObjectiveSeedItem extends AssociationObjectiveFormData {
  numberBadge?: string;
}

export const INITIAL_OFFICIAL_OBJECTIVES: OfficialObjectiveSeedItem[] = [
  // ─── 1. Core Objectives (01 - 06) ──────────────────────────────────────────
  {
    category: 'core_objective',
    title: 'Promoting Human Potential Through Weightlifting',
    shortTitle: 'PROMOTING HUMAN POTENTIAL',
    description:
      'To positively develop human potential and build strength, energy, and confidence through the sport of weightlifting, thereby contributing to a healthier and more fulfilling life.',
    displayOrder: 1,
    isPublished: true,
    numberBadge: '01',
  },
  {
    category: 'core_objective',
    title: 'Encouraging Competitive Participation',
    shortTitle: 'ENCOURAGING COMPETITIVE PARTICIPATION',
    description:
      'To encourage individuals to participate in weightlifting competitions and support them in achieving excellence and success at various levels of competition.',
    displayOrder: 2,
    isPublished: true,
    numberBadge: '02',
  },
  {
    category: 'core_objective',
    title: 'Creating Awareness About Weightlifting',
    shortTitle: 'CREATING AWARENESS',
    description:
      'To create awareness among the public about weightlifting training, its benefits, and its importance as a form of physical activity and sport.',
    displayOrder: 3,
    isPublished: true,
    numberBadge: '03',
  },
  {
    category: 'core_objective',
    title: 'Encouraging Students to Participate',
    shortTitle: 'ENCOURAGING STUDENT PARTICIPATION',
    description:
      'To actively involve school and college students in weightlifting training and related sporting activities, encouraging them to develop their skills and interest in the sport.',
    displayOrder: 4,
    isPublished: true,
    numberBadge: '04',
  },
  {
    category: 'core_objective',
    title: 'Promoting Physical and Mental Well-being',
    shortTitle: 'PROMOTING PHYSICAL & MENTAL WELL-BEING',
    description:
      'To promote awareness of physical and mental well-being among the public through regular exercise, fitness, and weightlifting training.',
    displayOrder: 5,
    isPublished: true,
    numberBadge: '05',
  },
  {
    category: 'core_objective',
    title: 'Developing Discipline Among Youth',
    shortTitle: 'DEVELOPING DISCIPLINE AMONG YOUTH',
    description:
      'To use weightlifting training as a means of developing self-discipline, self-control, determination, and a sense of responsibility among young people.',
    displayOrder: 6,
    isPublished: true,
    numberBadge: '06',
  },

  // ─── 2. Sporting Objectives (3 items) ───────────────────────────────────────
  {
    category: 'sporting_objective',
    title: 'Conducting District-Level Competitions',
    shortTitle: 'CONDUCTING DISTRICT-LEVEL COMPETITIONS',
    description:
      'To conduct Salem District-level Weightlifting Competitions annually and identify talented athletes who can represent Salem District at Tamil Nadu State-level Weightlifting Competitions.',
    displayOrder: 1,
    isPublished: true,
  },
  {
    category: 'sporting_objective',
    title: 'Identifying & Supporting Talent',
    shortTitle: 'IDENTIFYING & SUPPORTING TALENT',
    description:
      'To identify talented weightlifters and provide them with encouragement, guidance, and appropriate support to help them progress in the sport.',
    displayOrder: 2,
    isPublished: true,
  },
  {
    category: 'sporting_objective',
    title: 'Teaching the Art of Weightlifting',
    shortTitle: 'TEACHING THE ART OF WEIGHTLIFTING',
    description:
      'To provide students with opportunities to learn and develop proper weightlifting skills, techniques, training discipline, and sporting knowledge.',
    displayOrder: 3,
    isPublished: true,
  },

  // ─── 3. Our Commitment (2 items) ───────────────────────────────────────────
  {
    category: 'commitment',
    title: 'Non-Profit Public Service',
    shortTitle: 'PUBLIC WELFARE',
    description:
      'The Association operates without a profit motive and with the objective of serving the public and promoting the welfare of society.',
    displayOrder: 1,
    isPublished: true,
  },
  {
    category: 'commitment',
    title: 'Non-Political Organization',
    shortTitle: 'NON-POLITICAL ORGANIZATION',
    description:
      'The Association is not affiliated with or associated with any political party.',
    displayOrder: 2,
    isPublished: true,
  },
];
