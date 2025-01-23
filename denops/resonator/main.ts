import { assert, Denops, is } from "./deps.ts"
import { isLastCursorPos, setLastCursorPos } from "./state.ts"
import { getResonatorDefaultPort } from "./utils.ts"
import { getCursorPos } from "./vim.ts"
import { debouncedSyncCursor, runWsServer, stopWsServer } from "./ws.ts"

export const main = async (denops: Denops): Promise<void> => {
  denops.dispatcher = {
    startServer: async (port: unknown) => {
      let portNumber = Number(port)
      assert(portNumber, is.Number)
      if (portNumber === 0) {
        portNumber = getResonatorDefaultPort()
      }

      console.log(`Resonator server started on port ${portNumber}`)
      runWsServer(denops, portNumber)
    },
    stopServer: async () => {
      stopWsServer()
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
