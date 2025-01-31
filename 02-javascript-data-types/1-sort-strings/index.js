/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const arrCopy = [...arr];

  param === 'asc'
    ? arrCopy.sort((a, b) => a.localeCompare(b, ["ru", "eng"], { caseFirst: 'upper' }))
    : arrCopy.sort((a, b) => b.localeCompare(a, ["ru", "eng"], { caseFirst: 'upper' }));

  return arrCopy;
}
