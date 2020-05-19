import * as vscode from 'vscode';

/* respect https://github.com/Gimly/vscode-fortran/blob/229cddce53a2ea0b93032619efeef26376cd0d2c/src/documentSymbolProvider.ts
           https://github.com/Microsoft/vscode/blob/34ba2e2fbfd196e2d6db5a4db0e42d03a97c655e/extensions/markdown-language-features/src/features/documentLinkProvider.ts
 */
export class ExpectDocumentSymbolProvider implements vscode.DocumentSymbolProvider {

    public provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.SymbolInformation[] {

        const tokenToKind = this.tokenToKind;

        const text = document.getText();
        const matchedList = this.matchAll(this.pattern, text);

        const result: vscode.SymbolInformation[] = [];
        matchedList.map((matched) => {
            // const type = 'proc';
            const name = matched[1];
            const kind = vscode.SymbolKind.Function;

            const position = document.positionAt(matched.index || 0);
            result.push(new vscode.SymbolInformation(
                name,
                kind,
                '',
                new vscode.Location(document.uri, position)
            ));
        });

        return result;
    }

    private get tokenToKind(): { [name: string]: vscode.SymbolKind; } {
        return {
            // package: vscode.SymbolKind.Class,
            // sub: vscode.SymbolKind.Function,
            // subtest: vscode.SymbolKind.Function,
            set: vscode.SymbolKind.Variable,
            proc: vscode.SymbolKind.Function,
        };
    }

    // TODO: replace with better regexp
    private get pattern() {
        // return /(^proc|\bset)\b +([^ ;\n'"{]+|(['"].+['"])+)/gm;
        // return new RegExp('^proc\s(\w+)\s\{([\s,\w])+\}');
        return /^proc\s(\w+)\s\{(([\s,\w])+|)\}\s\{/gm;
    }

    private matchAll(pattern: RegExp, text: string): Array<RegExpMatchArray> {
        const out: RegExpMatchArray[] = [];
        // pattern.lastIndex = 0;

        let match: RegExpMatchArray | null;
        while ((match = pattern.exec(text))) {
            out.push(match);
        }

        return out;
    }
}