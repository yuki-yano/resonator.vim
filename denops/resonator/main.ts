import { assert, Denops, is } from "./deps.ts"
import { isLastCursorPos, isSyncPaused, pauseSync, resumeSync, setLastCursorPos } from "./state.ts"
import { getResonatorDefaultPort, isPortAvailable } from "./utils.ts"
import { getCursorPos } from "./vim.ts"
import { debouncedSyncCursor, isWsServerRunning, runWsServer, stopWsServer } from "./ws.ts"

export const main = async (denops: Denops): Promise<void> => {
  denops.dispatcher = {
    startServer: async (port: unknown) => {
      let portNumber = Number(port)
      assert(portNumber, is.Number)
      if (portNumber === 0) {
        portNumber = getResonatorDefaultPort()
      }

      if (isWsServerRunning() || !isPortAvailable(portNumber)) {
        console.log("Resonator: Server already running")
        return
      }

      console.log(`Resonator server started on port ${portNumber}`)
      runWsServer(denops, portNumber)
    },
    stopServer: async () => {
      stopWsServer()
    },
    status: async () => {
      return {
        is_running: isWsServerRunning(),
        is_sync_paused: isSyncPaused(),
      }
    },
    pauseSync: async () => {
      pauseSync()
    },
    resumeSync: async () => {
      resumeSync()
    },
    syncCursorPos: async () => {
      const cursorPos = await getCursorPos(denops)
      if (isLastCursorPos(cursorPos)) {
        return
      }

      setLastCursorPos(cursorPos)
      debouncedSyncCursor(cursorPos)
    },
  }
}
