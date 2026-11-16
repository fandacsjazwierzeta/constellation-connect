import type { Command } from './types';

export interface HistoryState {
  undo: Command[];
  redo: Command[];
}

export const emptyHistory = (): HistoryState => ({ undo: [], redo: [] });

const invert = (command: Command): Command => ({
  type: command.type === 'add' ? 'remove' : 'add',
  key: command.key,
});

/** A newly accepted command always clears the redo branch. */
export const pushCommand = (history: HistoryState, command: Command): HistoryState => ({
  undo: history.undo.concat(command),
  redo: [],
});

export const popUndo = (
  history: HistoryState,
): { history: HistoryState; command: Command } | null => {
  if (history.undo.length === 0) return null;
  const command = history.undo[history.undo.length - 1];
  return {
    history: {
      undo: history.undo.slice(0, -1),
      redo: history.redo.concat(command),
    },
    command: invert(command),
  };
};

export const popRedo = (
  history: HistoryState,
): { history: HistoryState; command: Command } | null => {
  if (history.redo.length === 0) return null;
  const command = history.redo[history.redo.length - 1];
  return {
    history: {
      undo: history.undo.concat(command),
      redo: history.redo.slice(0, -1),
    },
    command,
  };
};
