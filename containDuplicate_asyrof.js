/**
 * write a function that returns true if there's duplicate in the array, and false otherwise.
 * SEE EXAMPLE BELLOW!
 * 
 * 
Example
console.log(containsDuplicate([1, 2, 3, 1])); // Output: true
console.log(containsDuplicate([1, 2, 3, 4])); // Output: false
console.log(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])); // Output: true

 * Determines if the array contains any duplicate value.

 * @param {number[]} nums - The input array of integers.
 * @return {boolean} Returns true if the array contains any duplicate value, false otherwise.
 */
function containsDuplicate(nums) {
  // Your logic here

  const numSet = new Set(); //objek yang menyimpan nilai unik

  for (const num of nums) {
    if (numSet.has(num)) {
      return true; // Ada elemen yang duplikat
    }
    numSet.add(num); // Tambahkan elemen ke set kalo tidak ada dupilkat
  }

  return false; // Tidak ada elemen yang duplikat

  ///////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////

  // let result = false;
  // for (let i = 0; i < nums.length; i++) {
  //   for (let j = i + 1; j < nums.length; j++) {
  //     if (nums[i] === nums[j]) {
  //       result = true;
  //       break;
  //     }
  //   }
  //   if (result) break;
  // }
  // return result;
}

// console.log(containsDuplicate([1, 2, 3, 1])); // Output: true
console.log(containsDuplicate([1, 2, 3, 4, '1'])); // Output: false
// console.log(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2])); // Output: true
