/*
Title: Unique Characters

Description:
Write a function named hasUniqueCharacters that takes a string as input and returns true if the string contains all unique characters, and false otherwise. You can assume that the string contains only lowercase alphabets (a-z).

Example:
console.log(hasUniqueCharacters("abcdefg")); // Output: true
console.log(hasUniqueCharacters("hello")); // Output: false
*/

function hasUniqueCharacters(str) {
  let result = true;

  for (let i = 0; i < str.length; i++) {
    for (let j = i + 1; j < str.length; j++) {
      if (str[i] === str[j]) {
        result = false;
        break;
      }
    }

    if (!result) {
      break; //keluar loop lebih cepat saat menemukan karakter sama
    }
  }

  return result;
}

console.log(hasUniqueCharacters('abc5defg')); // Output: true
console.log(hasUniqueCharacters('hello')); // Output: false
