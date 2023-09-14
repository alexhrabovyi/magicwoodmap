export default function formatPrice(price) {
  if (price === undefined) return undefined;

  let result = Array.from(price.toString()).reverse();
  let count = 0;

  for (let i = 0; i < result.length; i += 1) {
    if (i % 3 === 0) {
      result.splice(i + count, 0, ' ');
      count += 1;
    }
  }

  result = result.reverse().join('');
  return result;
}
