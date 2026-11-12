import * as vscode from 'vscode';

import { getGitRepositoryPath } from '../utils/git';
import { Journal } from '../utils/journal';

const emitter = new vscode.EventEmitter<string | null>();

let currentRepository: string | null = null;

export const onGitRepositoryChanged = emitter.event;

export function setGitRepository(path: string | null) {
    if (path !== currentRepository) {
        currentRepository = path;
        emitter.fire(path);
    }
}

export async function updateGitRepository() {
    const editor = vscode.window.activeTextEditor;
    // Keep the current repository when a non-file editor (webview, output,
    // settings, ...) becomes active: opening a preview must not reset the tree.
    if (!editor || editor.document.uri.scheme !== 'file') {
        return;
    }
    setGitRepository(await getGitRepositoryPath(editor.document.uri.path));
}
