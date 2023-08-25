/**
 *
 * Write a function max_of_two(a, b) that takes in two integers, a and b, and returns the maximum of the two numbers without using any arrays or built-in functions like max().
 *
 */
function max_of_two(a, b) {
  // Your logic here
  // if (a > b) {
  //   return a;
  // } else return b;

  if (a === b) {
    return 'Angka yang anda masukkan sama';
  } else if (a > b) {
    return a;
  } else return b;

  // return a === b ? 'Angka yang anda masukkan sama' : a > b ? a : b;

  return a > b ? a : b;
}

console.log(max_of_two(10, 5));
console.log(max_of_two(5, 5));
console.log(max_of_two(45, 66));
