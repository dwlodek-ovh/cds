import * as vscode from "vscode";

import { CdsWorkflowRun, CdsWorkflowRunResult } from "./cds/models";

export interface ResultPreviewOptions {
    /** Text content downloaded for the preview, if any. */
    content?: string;
    /** Error to display instead of the content. */
    error?: string;
}

function escapeHtml(value: unknown): string {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function renderMetadata(result: CdsWorkflowRunResult): string {
    if (!result.metadata || Object.keys(result.metadata).length === 0) {
        return "";
    }
    const rows = Object.entries(result.metadata)
        .map(([key, value]) => `<tr><th>${escapeHtml(key)}</th><td>${escapeHtml(value.value)}</td></tr>`)
        .join("");
    return `<h2>Metadata</h2><table>${rows}</table>`;
}

function renderContent(options: ResultPreviewOptions): string {
    if (options.error) {
        return `<h2>Error</h2><pre class="error">${escapeHtml(options.error)}</pre>`;
    }
    if (options.content !== undefined) {
        return `<h2>Content</h2><pre>${escapeHtml(options.content)}</pre>`;
    }
    return "";
}

const MAX_DETAILS_LENGTH = 100_000;

function renderHtml(
    result: CdsWorkflowRunResult,
    run: CdsWorkflowRun,
    options: ResultPreviewOptions,
): string {
    const serialized = JSON.stringify(result.detail, null, 2);
    const details = serialized.length > MAX_DETAILS_LENGTH
        ? `${serialized.substring(0, MAX_DETAILS_LENGTH)}\n[truncated]`
        : serialized;
    const header = [
        `Type: ${result.type}`,
        result.status ? `Status: ${result.status}` : "",
        `Run: #${run.runNumber}`,
    ].filter(Boolean).join("  •  ");

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
                font-family: var(--vscode-font-family);
                font-size: var(--vscode-font-size);
            }
            header {
                position: sticky;
                top: 0;
                padding: 10px 14px;
                border-bottom: 1px solid var(--vscode-panel-border);
                background: var(--vscode-editor-background);
            }
            header h1 {
                margin: 0 0 4px;
                font-size: 1.1em;
                word-break: break-word;
            }
            header div {
                opacity: 0.8;
            }
            main {
                padding: 12px 14px 24px;
            }
            h2 {
                margin: 18px 0 8px;
                font-size: 1em;
            }
            table {
                border-collapse: collapse;
                width: 100%;
            }
            th, td {
                padding: 4px 8px;
                border-bottom: 1px solid var(--vscode-panel-border);
                text-align: left;
                vertical-align: top;
            }
            th {
                width: 30%;
                font-weight: 600;
            }
            td {
                font-family: var(--vscode-editor-font-family);
                word-break: break-word;
            }
            pre {
                margin: 0;
                padding: 12px;
                background: var(--vscode-textCodeBlock-background);
                white-space: pre-wrap;
                word-break: break-word;
                font-family: var(--vscode-editor-font-family);
                font-size: var(--vscode-editor-font-size);
            }
            pre.error {
                color: var(--vscode-errorForeground);
            }
        </style>
    </head>
    <body>
        <header>
            <h1>${escapeHtml(result.name)}</h1>
            <div>${escapeHtml(header)}</div>
        </header>
        <main>
            ${renderMetadata(result)}
            ${renderContent(options)}
            <h2>Details</h2>
            <pre>${escapeHtml(details)}</pre>
        </main>
    </body>
</html>`;
}

/** Shows a workflow run result in a webview panel. */
export class CDSResultPreview implements vscode.Disposable {
    private static viewType = "cds.resultPreview";

    private _panel?: vscode.WebviewPanel;

    show(
        result: CdsWorkflowRunResult,
        run: CdsWorkflowRun,
        options: ResultPreviewOptions = {},
    ): void {
        if (!this._panel) {
            this._panel = vscode.window.createWebviewPanel(
                CDSResultPreview.viewType,
                result.name,
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
        this._panel.title = result.name;
        this._panel.webview.html = renderHtml(result, run, options);
        this._panel.reveal(vscode.ViewColumn.Two, true);
    }

    dispose(): void {
        this._panel?.dispose();
        this._panel = undefined;
    }
}
