function! resonator#start_server(...)
  let port = a:0 ? a:1 : "0"
  call denops#notify("resonator", "startServer", [port])
endfunction

function! resonator#stop_server()
  call denops#notify("resonator", "stopServer", [])
endfunction

function! resonator#sync_cursor()
  if !denops#plugin#is_loaded('resonator')
    return
  endif

  if mode() ==# "n"
    call denops#notify("resonator", "syncCursorPos", [])
  endif
endfunction
