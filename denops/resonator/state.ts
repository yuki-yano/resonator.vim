import { CursorPos } from "./types.ts"

export let lastCursorPos: CursorPos | undefined
export const setLastCursorPos = (pos: CursorPos) => {
  lastCursorPos = pos
}
export const getLastCursorPos = () => {
  return lastCursorPos
}
export const isLastCursorPos = (pos: CursorPos) => {
  return lastCursorPos?.path === pos.path && lastCursorPos?.line === pos.line && lastCursorPos?.col === pos.col
}

const sockets = new Set<WebSocket>()
export const addSocket = (socket: WebSocket) => {
  sockets.add(socket)
}
export const removeSocket = (socket: WebSocket) => {
  sockets.delete(socket)
}
export const getSockets = () => {
  return sockets
}
