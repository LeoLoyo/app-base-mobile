export const isRemoteUrl = (str) => {
  return /^((http|https):\/\/)/i.test(str)
}
