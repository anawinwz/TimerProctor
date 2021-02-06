export const getVW = () => Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
export const getVH = () => Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

export const getViewportDim = () => ({
  width: getVW(),
  height: getVH()
})
