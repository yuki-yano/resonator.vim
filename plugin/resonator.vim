command! -nargs=? ResonatorServer call resonator#start_server(<f-args>)
command! ResonatorStopServer call resonator#stop_server()
command! ResonatorPauseSync call resonator#pause_sync()
command! ResonatorResumeSync call resonator#resume_sync()
command! ResonatorToggleSync call resonator#toggle_sync()

autocmd CursorMoved,CursorHold * call resonator#sync_cursor()
