/* eslint-disable no-param-reassign */
export default function generateRateStars(rate, block) {
  function generateRateStar(widthPercent = 100) {
    if (widthPercent <= 30) {
      widthPercent += 10;
    } else if (widthPercent >= 80) {
      widthPercent -= 20;
    } else if (widthPercent >= 65) {
      widthPercent -= 10;
    }

    const star = document.createElement('div');
    star.classList.add('icon-star-block');
    star.innerHTML = `<i class='icon-star'><div class='icon-star-block-additional' style='width:${widthPercent}%'><i class='icon-star-filled'></i></div></i>`;

    return star;
  }

  const amountOfFilledStars = Math.floor(rate);
  const amountOfHollowStars = Math.floor(5 - rate);
  const partialFilledStarPercent = +((rate - amountOfFilledStars) * 100).toFixed(0);

  const stars = new DocumentFragment();

  for (let i = 0; i < amountOfFilledStars; i += 1) {
    if (i > 4) break;
    stars.append(generateRateStar());
  }

  if (partialFilledStarPercent) stars.append(generateRateStar(partialFilledStarPercent));

  for (let i = 0; i < amountOfHollowStars; i += 1) {
    stars.append(generateRateStar(0));
  }

  block.append(stars);
}
