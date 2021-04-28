import { commands, ExtensionContext, StatusBarAlignment, window, workspace, WorkspaceConfiguration } from 'vscode';
const { registerCommand, executeCommand } = commands;


const toggleCommandId = "keybindingMode.toggle";
const handleKeyCommandId = 'keybindingMode.handleKey';

const commandForLetter = (letter: string) => (workspace
  .getConfiguration('keybindingMode')
  .get('letterCommandMapping', <string[]>[])
  .map(letterCommandMappingString => letterCommandMappingString.split(','))
  .find(letterCommandMapping => letterCommandMapping[0] === letter) || '')
[1];

export function activate(context: ExtensionContext) {
  const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 9999999999);
  const workbenchConfiguration = workspace.getConfiguration('workbench')
  let enabled = false;


  statusBarItem.command = toggleCommandId;
  context.subscriptions.push(statusBarItem);

  context.subscriptions.push(registerCommand(toggleCommandId, () => {
    enabled = !enabled;

    // if (enabled) {
    //   updateCursorGreen(workbenchConfiguration);
    // } else {
    //   undoCursor(workbenchConfiguration);
    // }

    executeCommand('setContext', 'keybindingMode:enabled', enabled);
  }));


  context.subscriptions.push(registerCommand(handleKeyCommandId, ({ text: letter }) => {
    if (!enabled) return;

    const command = commandForLetter(letter);
    if (command) {
      executeCommand(command);
    }
  }));
}

// これを実行するとなぜかwhite spaceが真っ赤になる
const updateCursorGreen = (configuration: WorkspaceConfiguration) => {
  configuration.update(
    'colorCustomizations',
    {
      "editorCursor.foreground": "#50FF50BB",
      "editor.selectionBackground": "#82FA8233",
    },
  );
}

const undoCursor = (configuration: WorkspaceConfiguration) => {
  configuration.update(
    'colorCustomizations',
    {
      "editorCursor.foreground": undefined,
      "editor.selectionBackground": undefined,
    },
  );
}



export function deactivate() { }
