export const CURRENCY = 'GH₵' // change to your currency symbol

export const formatPrice = (n) =>
  n === null || n === undefined
    ? 'No price'
    : `${CURRENCY} ${Number(n).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`

/** '5 kg' / '500' / '' — per the contract's size (number) + unit pair. */
export const formatSize = (size, unit) => {
  if (size === null || size === undefined || size === '') return ''
  return unit ? `${size} ${unit}` : String(size)
}
