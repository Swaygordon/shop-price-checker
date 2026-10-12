export const CURRENCY = 'GH₵' // change to your currency symbol

export const formatPrice = (n) =>
  `${CURRENCY} ${Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
