function! resonator#start_server(...)
  let port = a:0 ? a:1 : "0"
  call denops#notify("resonator", "startServer", [port])
endfunction

function! resonator#stop_server()
  call denops#notify("resonator", "stopServer", [])
endfunction

function! resonator#status()
  return denops#request("resonator", "status", [])
endfunction

function! resonator#pause_sync()
  call denops#notify("resonator", "pauseSync", [])
endfunction

function! resonator#resume_sync()
  call denops#notify("resonator", "resumeSync", [])
endfunction

function! resonator#is_sync_paused()
  return denops#request("resonator", "status", [])["is_sync_paused"]
endfunction

function! resonator#toggle_sync()
  if resonator#is_sync_paused()
    call resonator#resume_sync()
    echo "Resonator: Sync resumed"
  else
    call resonator#pause_sync()
    echo "Resonator: Sync paused"
  endif
endfunction

function! resonator#sync_cursor()
  if !denops#plugin#is_loaded('resonator')
    return
  endif

  if mode() ==# "n"
    call denops#notify("resonator", "syncCursorPos", [])
  endif
endfunction
