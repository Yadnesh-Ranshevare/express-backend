const p1 = document.querySelector('.parent1');
const p2 = document.querySelector('.parent2');
const btn = document.querySelector('.childbut');

p1.addEventListener('click', () => console.log('parent1'));
p2.addEventListener('click', () => console.log('parent2'));
btn.addEventListener('click', () => console.log('child'));