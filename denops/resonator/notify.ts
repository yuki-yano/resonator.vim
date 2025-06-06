import { Denops } from "./deps.ts"

export async function notify(
  denops: Denops,
  message: string,
  level: "info" | "warn" | "error" = "info",
): Promise<void> {
  const isNeovim = denops.meta.host === "nvim"

  if (isNeovim) {
    // Use vim.notify in Neovim
    const vimLevel = level === "warn" ? "WARN" : level === "error" ? "ERROR" : "INFO"
    await denops.cmd(`lua vim.notify("${message}", vim.log.levels.${vimLevel})`)
  } else {
    // Use appropriate echo command in Vim
    switch (level) {
      case "error":
        await denops.cmd(`echoerr "${message}"`)
        break
      case "warn":
        await denops.cmd(`echohl WarningMsg | echo "${message}" | echohl None`)
        break
      default:
        await denops.cmd(`echo "${message}"`)
    }
  }
}
