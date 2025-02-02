/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size <= 0) {
    return "";
  }

  if (!size) {
    return string;
  }

  let result = "";
  let charCountMap = new Map();
  let lastChar = "";

  for (const char of string) {
    if (char === lastChar) {
      if (charCountMap.has(char)) {
        charCountMap.set(char, charCountMap.get(char) + 1);
      } else {
        charCountMap.set(char, 1);
      }
    } else {
      charCountMap.clear();
      charCountMap.set(char, 1);
      lastChar = char;
    }

    if (charCountMap.get(char) <= size) {
      result += char;
    }
  }
  return result;
}
