const heroSymbols = [
  'assets/smiley-hero-approved.png',
  'assets/smiley-hero-v-shape.jpg',
  'assets/smiley-hero-open-cutlery.jpg',
];

const heroSymbol = document.querySelector('#hero-symbol');

if (heroSymbol) {
  const nextSymbol = heroSymbols[Math.floor(Math.random() * heroSymbols.length)];
  heroSymbol.src = nextSymbol;
}
