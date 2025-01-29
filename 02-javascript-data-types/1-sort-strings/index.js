/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const arrCopy = [...arr];
  const sortingOrder = {asc: 'asc', desc: 'desc'};

  switch (param) {
  case sortingOrder.asc: arrCopy.sort((a, b) => a.localeCompare(b, "ru", { caseFirst: 'upper' }));
    return arrCopy;
  case sortingOrder.desc: arrCopy.sort((a, b) => b.localeCompare(a, "ru", { caseFirst: 'upper' }));
    return arrCopy;
  default: return ['параметр сортировки задан неверно'];
  }
}
