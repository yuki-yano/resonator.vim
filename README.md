# resonator.vim

resonator.vim is a extension for syncing open files, cursor position, and more between Vim and VSCode.
This plugin depends on [denops.vim](https://github.com/vim-denops/denops.vim).

## VSCode Extension

- Repository: [yuki-yano/vscode-resonator](https://github.com/yuki-yano/vscode-resonator)
- Marketplace: [Resonator](https://marketplace.visualstudio.com/items?itemName=yuki-yano.vscode-resonator)

## Usage

### Start server

```vim
:ResonatorServer {port}
```

- `port`: The port number to listen on. If not specified, select project unique port from cwd.

### Stop server

```vim
:ResonatorStopServer
```

### Pause sync

```vim
:ResonatorPauseSync
```

### Resume sync

```vim
:ResonatorResumeSync
```

### Toggle sync

```vim
:ResonatorToggleSync
```

## Special thanks

- [kbwo](https://github.com/kbwo)
  - [vim-shareedit](https://github.com/kbwo/vim-shareedit)
