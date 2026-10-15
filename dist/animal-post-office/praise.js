// A shuffled ten-response deck prevents consecutive repeats, including between decks.
window.POST_PRAISE=[
 'Lovely work! Your package is on its way.',
 'You found the right bin! Great job.',
 'Well done, little postie!',
 'Perfect delivery! Thank you for helping.',
 'That is right! Another happy customer.',
 'Brilliant sorting! You did it.',
 'Excellent! That package is ready to go.',
 'Nice work! You matched it correctly.',
 'Hooray! A special delivery, just right.',
 'Fantastic! The forest friends are proud of you.'
];
(() => {
 let deck=[],last='';
 window.nextPostPraise=()=>{
  if(!deck.length){deck=[...window.POST_PRAISE];for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}if(deck.at(-1)===last)[deck[0],deck[deck.length-1]]=[deck.at(-1),deck[0]];}
  return last=deck.pop();
 };
})();
