const countOccurrences = (array, val) =>
  array.reduce((arr, value) => (value === val ? arr + 1 : arr), 0)

export const frequencySort = (arr) => {
  let d = {}
  arr.forEach(
    (i, index) =>
      (d[i] = {
        num: countOccurrences(arr, i),
        i: index,
      })
  )
  arr.sort((a, b) => {
    let diff = d[b].num - d[a].num
    if (diff == 0) diff = d[b].i - d[a].i
    return diff
  })

  return arr
}
