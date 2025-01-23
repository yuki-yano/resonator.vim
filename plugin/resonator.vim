command! -nargs=? ResonatorServer call resonator#start_server(<f-args>)
command! ResonatorStopServer call resonator#stop_server()

autocmd CursorMoved,CursorHold,VimResized * call resonator#sync_cursor()
