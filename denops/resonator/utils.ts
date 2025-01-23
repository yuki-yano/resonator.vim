export const getResonatorDefaultPort = () => {
  const cwd = Deno.cwd()
  let hash = 0
  for (let i = 0; i < cwd.length; i++) {
    hash = ((hash << 5) - hash) + cwd.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash) % 40000 + 20000
}
