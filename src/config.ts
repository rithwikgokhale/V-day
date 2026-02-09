export type ImageOption = {
  id: string
  filename: string
  label: string
  alt: string
}

export const config = {
  myName: 'Rithwik',
  herName: 'Ana',
  requiredSelections: 3,
  images: [
    {
      id: 'pic-1',
      filename: 'placeholder-1.svg',
      label: 'Sunset smiles',
      alt: 'Placeholder photo one',
    },
    {
      id: 'pic-2',
      filename: 'placeholder-2.svg',
      label: 'Coffee date',
      alt: 'Placeholder photo two',
    },
    {
      id: 'pic-3',
      filename: 'placeholder-3.svg',
      label: 'Road trip laugh',
      alt: 'Placeholder photo three',
    },
    {
      id: 'pic-4',
      filename: 'placeholder-4.svg',
      label: 'Movie night',
      alt: 'Placeholder photo four',
    },
    {
      id: 'pic-5',
      filename: 'placeholder-5.svg',
      label: 'Park walk',
      alt: 'Placeholder photo five',
    },
    {
      id: 'pic-6',
      filename: 'placeholder-6.svg',
      label: 'Rainy day selfie',
      alt: 'Placeholder photo six',
    },
  ] as ImageOption[],
  screen2Instruction:
    'select top 3 pics of us you like. This will prove that you are the real Ana. (btw this is kinda important so rly select you fav 3)',
  screen3Message:
    'Ana,\n\nThis is where your personal message goes. Replace this in src/config.ts when you are ready. I wanted this page to feel simple and sincere, just like us.\n\n- Rithwik',
  screen5Message: 'Yay! 💘 I’ll text you the plan for the date.',
  yesButtonTexts: ['YES', 'YES!!', 'OK YESSS'],
  myEmail: 'your-email@example.com',
  emailSubject: 'Valentine Answer',
  emailIntroLine: 'Hey! I selected my top 3 photos. Sending this for your surprise.',
  theme: {
    pageBackground: '#fff8fb',
    cardBackground: '#ffffff',
    primary: '#e74c8a',
    primaryDark: '#c43e73',
    text: '#30212a',
    muted: '#7d6473',
    border: '#f0cfdd',
  },
}
