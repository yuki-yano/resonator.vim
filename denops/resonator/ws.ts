import { assert, debounce, Denops } from "./deps.ts"
import { addSocket, getSockets, isSyncPaused, removeSocket, setLastCursorPos } from "./state.ts"
import { CursorPos, CursorPosProtocol, isMessageProtocol } from "./types.ts"
import { executeCommand, getCursorPos, isValidCursorPos } from "./vim.ts"
import { notify } from "./notify.ts"

let abortController: AbortController | undefined

export const isWsServerRunning = () => {
  return abortController !== undefined
}

export const runWsServer = async (denops: Denops, port: number) => {
  abortController = new AbortController()
  const server = Deno.serve({
    port,
    onListen: () => {},
    signal: abortController.signal,
  }, (req) => handleWs(denops, req))
  await server.finished
  abortController = undefined
  await notify(denops, "Resonator: Server stopped", "info")
}

export const stopWsServer = () => {
  abortController?.abort()
  abortController = undefined
}

export const handleWs = (denops: Denops, req: Request): Response => {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response("not trying to upgrade as websocket.")
  }

  const { socket, response } = Deno.upgradeWebSocket(req)
  addSocket(socket)

  socket.onopen = async () => {
    await notify(denops, "Resonator: Client connected", "info")
  }

  socket.onclose = async () => {
    await notify(denops, "Resonator: Client disconnected", "info")
    removeSocket(socket)
  }

  socket.onmessage = async (e) => {
    if (isSyncPaused()) {
      return
    }

    const message = JSON.parse(e.data) as unknown
    assert(message, isMessageProtocol)

    switch (message.type) {
      case "CursorPos": {
        const newCursorPos: CursorPos = {
          path: message.path,
          line: message.line,
          col: message.col,
        }
        const currentCursorPos = await getCursorPos(denops)
        if (currentCursorPos.path !== newCursorPos.path) {
          await denops.cmd(`edit ${newCursorPos.path}`)
        }

        if ((await isValidCursorPos({ denops, cursorPos: newCursorPos })) === false) {
          return
        }

        if (
          currentCursorPos.path === newCursorPos.path &&
          currentCursorPos.line === newCursorPos.line &&
          currentCursorPos.col === newCursorPos.col
        ) {
          return
        }

        setLastCursorPos(newCursorPos)
        await denops.cmd(
          `execute "noautocmd call cursor(${newCursorPos.line}, ${newCursorPos.col})"`,
        )
        break
      }

      case "SelectionPos": {
        // TODO: Implement selection sync
        break
      }
      case "TextContent": {
        // TODO: Implement text content sync
        break
      }
      case "ExecuteCommand": {
        const { command, args } = message
        executeCommand({ denops, command, args })
        break
      }
      default: {
        throw new Error(`Unknown type: ${(message as { type: "__invalid__" }).type}`)
      }
    }
  }

  socket.onerror = async (e) => await notify(denops, `Resonator error: ${e}`, "error")
  return response
}

export const debouncedSyncCursor = debounce(
  ({ line, col, path }: CursorPos) => {
    const json: CursorPosProtocol = {
      type: "CursorPos",
      sender: "vim",
      path,
      line,
      col,
      paused: isSyncPaused(),
    }
    const sockets = getSockets()
    sockets.forEach((s) => s.send(JSON.stringify(json)))
  },
  50,
)
