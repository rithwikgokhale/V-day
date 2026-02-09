export type ImageOption = {
  id: string
  filename: string
  label: string
  alt: string
  imageOrientation?: 'from-image' | 'none'
}

export const config = {
  myName: 'Rithwik',
  herName: 'Ana',
  requiredSelections: 3,
  images: [
    {
      id: 'pic-1',
      filename: '2020.png',
      label: '1',
      alt: 'Photo 1',
    },
    {
      id: 'pic-3',
      filename: 'IMG_9500.JPG',
      label: '2',
      alt: 'Photo 3',
    },
    {
      id: 'pic-7',
      filename: 'IMG_9505.JPG',
      label: '3',
      alt: 'Photo 7',
    },
    {
      id: 'pic-2',
      filename: '2022.JPG',
      label: '4',
      alt: 'Photo 2',
    },
    {
      id: 'pic-12',
      filename: 'IMG_9510.JPG',
      label: '5',
      alt: 'Photo 12',
    },
    {
      id: 'pic-4',
      filename: 'IMG_9502.JPG',
      label: '6',
      alt: 'Photo 4',
    },
    {
      id: 'pic-5',
      filename: 'IMG_9503.JPG',
      label: '7',
      alt: 'Photo 5',
    },
    {
      id: 'pic-6',
      filename: 'IMG_9504.JPG',
      label: '8',
      alt: 'Photo 6',
      imageOrientation: 'none',
    },
    {
      id: 'pic-10',
      filename: 'IMG_9508.JPG',
      label: '9',
      alt: 'Photo 10',
      imageOrientation: 'none',
    },
    {
      id: 'pic-13',
      filename: 'IMG_9511.JPG',
      label: '10',
      alt: 'Photo 13',
    },
    {
      id: 'pic-8',
      filename: 'IMG_9506.JPG',
      label: '11',
      alt: 'Photo 8',
    },
    {
      id: 'pic-11',
      filename: 'IMG_9509.JPG',
      label: '12',
      alt: 'Photo 11',
    },
    {
      id: 'pic-9',
      filename: 'IMG_9507.JPG',
      label: '13',
      alt: 'Photo 9',
    },
  ] as ImageOption[],
  screen2Instruction:
    'select top 3 pics of us you like. This will prove that you are the real Ana. (btw this is kinda important so rly select you fav 3)',
  screen3Message: `Hey Ana :)

I know this all seems kinda random or maybe over the top. Building this website to ask you out for Valentines was fun and I’m thinking that you’re amused and smiling right now. So if thats the case, this was a successful mission.

Now seriously though, I know we have not seen each other since our conversations with dani. And you were already not feeling sure about spending valentines with me given our situation. But I think that is exactly why we should. I don’t know how your conversation with him was but mine left me with some dread and sadness. I don’t know what our futures are going to look like and what we will be to each other in a few years. I am still trying to process and think through everything and come to some kind of a realization for myself. I think you are doing the same thing or maybe you already have. But yeah, we don’t know what our future holds. But the one thing we do have right now for sure is a chance to spend Valentines together. For the last 5 years of doing this, we have never had a chance to celebrate it together and this may be the one year we can. So let’s go out that day, forgetting everything else for one night and celebrate our love and be grateful for having met each other in this life and having a crazy passionate and intense few years of our lives together. What happens in the next few months, we will have this beautiful memory to always remember. I hope you decide to come.

Love,
Rithwik`,
  screen5Message: 'Yay! ❤️ I’ll text you the plan for the date.',
  yesButtonTexts: ['Yes', 'Yes!', 'OK YES', 'Okay YESSSS!! :)'],
  myEmail: 'rithwikg3@gmail.com',
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
