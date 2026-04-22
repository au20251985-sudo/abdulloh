import { Question } from './types';

export const INITIAL_QUESTIONS: Record<string, Question[]> = {
  Beginner: [
    {
      id: 'b1',
      category: 'Grammar',
      text: 'Which sentence is correct?',
      options: [
        'He go to school every day.',
        'He goes to school every day.',
        'He going to school every day.',
        'He gone to school every day.'
      ],
      correctAnswer: 1,
      explanation: 'The third person singular (he/she/it) requires "-s" or "-es" in the present simple.'
    },
    {
      id: 'b2',
      category: 'Vocabulary',
      text: 'What is the opposite of "slow"?',
      options: ['Quick', 'Fast', 'Rapid', 'All of the above'],
      correctAnswer: 3,
      explanation: '"Quick", "Fast", and "Rapid" are all synonyms of the opposite of "slow".'
    },
    {
      id: 'b3',
      category: 'Grammar',
      text: 'Choose the correct form: "I ___ a student."',
      options: ['am', 'is', 'are', 'be'],
      correctAnswer: 0,
      explanation: 'With "I", the correct form of the verb "to be" is "am".'
    },
    {
      id: 'b4',
      category: 'Grammar',
      text: 'Where ___ you from?',
      options: ['is', 'am', 'are', 'be'],
      correctAnswer: 2,
      explanation: 'The verb "to be" for "you" is "are".'
    },
    {
      id: 'b5',
      category: 'Vocabulary',
      text: 'Which of these is a fruit?',
      options: ['Potato', 'Apple', 'Carrot', 'Onion'],
      correctAnswer: 1,
      explanation: 'An apple is a common fruit. The others are vegetables.'
    },
    {
      id: 'b6',
      category: 'Grammar',
      text: 'I have ___ apple in my bag.',
      options: ['a', 'an', 'the', 'some'],
      correctAnswer: 1,
      explanation: 'We use "an" before words starting with a vowel sound.'
    }
  ],
  Intermediate: [
    {
      id: 'i1',
      category: 'Grammar',
      text: 'If I ___ more time, I would travel more.',
      options: ['have', 'had', 'would have', 'will have'],
      correctAnswer: 1,
      explanation: 'This is a second conditional sentence, used for hypothetical situations. We use "if + past simple, would + base verb".'
    },
    {
      id: 'i2',
      category: 'Vocabulary',
      text: 'Which word means "very surprised"?',
      options: ['Interested', 'Bored', 'Astonished', 'Anxious'],
      correctAnswer: 2,
      explanation: '"Astonished" is a strong adjective meaning very surprised.'
    },
    {
      id: 'i3',
      category: 'Grammar',
      text: 'She has been working here ___ 2015.',
      options: ['for', 'since', 'during', 'from'],
      correctAnswer: 1,
      explanation: 'We use "since" to refer to a specific point in time in the past.'
    },
    {
      id: 'i4',
      category: 'Vocabulary',
      text: 'What is the synonym of "essential"?',
      options: ['Optional', 'Useless', 'Crucial', 'Minor'],
      correctAnswer: 2,
      explanation: '"Crucial" and "essential" both mean extremely important or necessary.'
    },
    {
      id: 'i5',
      category: 'Grammar',
      text: 'I suggest ___ to the library.',
      options: ['to go', 'go', 'going', 'gone'],
      correctAnswer: 2,
      explanation: 'The verb "suggest" is usually followed by a gerund (-ing form).'
    }
  ],
  Advanced: [
    {
      id: 'a1',
      category: 'Reading',
      text: 'What does the idiom "once in a blue moon" mean?',
      options: [
        'Very often',
        'When the moon is blue',
        'Very rarely',
        'Once a month'
      ],
      correctAnswer: 2,
      explanation: '"Once in a blue moon" refers to something that happens very infrequently.'
    },
    {
      id: 'a2',
      category: 'Grammar',
      text: 'By this time next year, I ___ my degree.',
      options: [
        'will finish',
        'will be finishing',
        'will have finished',
        'am finishing'
      ],
      correctAnswer: 2,
      explanation: 'The future perfect ("will have + past participle") is used for actions that will be completed by a certain point in the future.'
    },
    {
      id: 'a3',
      category: 'Grammar',
      text: 'Hardly ___ the office when the phone rang.',
      options: [
        'I had left',
        'had I left',
        'I left',
        'did I leave'
      ],
      correctAnswer: 1,
      explanation: 'When a sentence starts with a negative adverbial like "Hardly", we use inversion (auxiliary verb before the subject).'
    },
    {
      id: 'a4',
      category: 'Vocabulary',
      text: 'Which word describes someone who is extremely careful about small details?',
      options: ['Meticulous', 'Reckless', 'Ambiguous', 'Casual'],
      correctAnswer: 0,
      explanation: '"Meticulous" means showing great attention to detail; very careful and precise.'
    }
  ]
};
