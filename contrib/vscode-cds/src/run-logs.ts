import * as vscode from "vscode";

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function normalizeLog(value: string): string {
    return value
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\u001b\[[0-9;?]*[ -/]*[@-~]/g, "");
}

function renderHtml(title: string, log: string): string {
    return `<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline';">
        <style>
            body {
                margin: 0;
                padding: 0;
                background: var(--vscode-editor-background);
                color: var(--vscode-editor-foreground);
                font-family: var(--vscode-editor-font-family);
                font-size: var(--vscode-editor-font-size);
            }
            header {
                position: sticky;
                top: 0;
                padding: 8px 12px;
                border-bottom: 1px solid var(--vscode-panel-border);
                background: var(--vscode-editor-background);
                font-weight: 600;
            }
            pre {
                margin: 0;
                padding: 12px;
                white-space: pre-wrap;
                word-break: break-word;
            }
        </style>
    </head>
    <body>
        <header>${escapeHtml(title)}</header>
        <pre>${escapeHtml(normalizeLog(log) || "No logs available for this step.")}</pre>
    </body>
</html>`;
}

/** Shows the log of a workflow run job step in a webview panel. */
export class CDSRunLogs implements vscode.Disposable {
    private static viewType = "cds.runLogs";

    private _panel?: vscode.WebviewPanel;

    show(title: string, log: string): void {
        if (!this._panel) {
            this._panel = vscode.window.createWebviewPanel(
                CDSRunLogs.viewType,
                title,
                vscode.ViewColumn.Two,
                {
                    enableScripts: false,
                    retainContextWhenHidden: true,
                },
            );
            this._panel.onDidDispose(() => {
                this._panel = undefined;
            });
        }
        this._panel.title = title;
        this._panel.webview.html = renderHtml(title, log);
        this._panel.reveal(vscode.ViewColumn.Two, true);
    }

    dispose(): void {
        this._panel?.dispose();
        this._panel = undefined;
    }
}
