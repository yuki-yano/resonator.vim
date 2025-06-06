import { assert, Denops, is } from "./deps.ts"
import { isLastCursorPos, isSyncPaused, pauseSync, resumeSync, setLastCursorPos } from "./state.ts"
import { getResonatorDefaultPort, isPortAvailable } from "./utils.ts"
import { getCursorPos } from "./vim.ts"
import { debouncedSyncCursor, isWsServerRunning, runWsServer, stopWsServer } from "./ws.ts"
import { notify } from "./notify.ts"

export const main = (denops: Denops): void => {
  denops.dispatcher = {
    startServer: async (port: unknown) => {
      let portNumber = Number(port)
      assert(portNumber, is.Number)
      if (portNumber === 0) {
        portNumber = getResonatorDefaultPort()
      }

      if (isWsServerRunning() || !isPortAvailable(portNumber)) {
        await notify(denops, "Resonator: Server already running", "warn")
        return
      }

      await notify(denops, `Resonator server started on port ${portNumber}`, "info")
      runWsServer(denops, portNumber)
    },
    stopServer: () => {
      stopWsServer()
    },
    status: () => {
      return {
        is_running: isWsServerRunning(),
        is_sync_paused: isSyncPaused(),
      }
    },
    pauseSync: () => {
      pauseSync()
    },
    resumeSync: () => {
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
