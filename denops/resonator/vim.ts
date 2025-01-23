import { Denops, ensure, is } from "./deps.ts"
import type { CursorPos } from "./types.ts"

export const getCursorPos = async (denops: Denops): Promise<CursorPos> => {
  const currentLine = ensure(await denops.call("line", "."), is.Number)
  const currentCol = ensure(await denops.call("col", "."), is.Number)
  const currentPath = ensure(await denops.call("expand", "%:p"), is.String)
  return { path: currentPath, line: currentLine, col: currentCol }
}

export const isValidCursorPos = async ({ denops, cursorPos }: { denops: Denops; cursorPos: CursorPos }) => {
  const line = ensure(await denops.call("getline", cursorPos.line), is.String)
  const lastColOfNewLine = line.length + 1
  const lastLine = ensure(await denops.call("line", "$"), is.Number)

  return cursorPos.line <= lastLine && cursorPos.col <= lastColOfNewLine
}
