import * as vscode from 'vscode';
import { assert } from 'chai';
import { provideCompletionItemsInner } from '../../../../providers/completionProvider';

// tests for completionItemsForMethod
suite('completionProvider', () => {
    // TODO outer
    // parsing vs no parsing
    // intellisense enabled vs disabled

    suite.only('provideCompletionItemsInner', () => {
        const tests: [
            name: string,
            args: Parameters<typeof provideCompletionItemsInner>,
            expected: ReturnType<typeof provideCompletionItemsInner>,
        ][] = [
            [
                'diff file, outside method, no locals',
                [
                    [
                        {
                            comment: 'mockComment',
                            endLine: 0,
                            full: '',
                            line: 0,
                            name: 'mockName',
                            params: [],
                            uriString: 'mockUri1',
                            variables: [],
                        },
                    ],
                    'mockUri2',
                    1,
                    [],
                ],
                [
                    {
                        detail: 'mockComment',
                        insertText: 'mockName()',
                        kind: vscode.CompletionItemKind.Method,
                        label: 'mockName',
                    },
                ],
            ],
            [
                'diff file, outside method, only params',
                [
                    [
                        {
                            comment: 'mockComment',
                            endLine: 0,
                            full: '',
                            line: 0,
                            name: 'mockName',
                            params: ['mockParam1', 'mockParam2'],
                            uriString: 'mockUri1',
                            variables: [],
                        },
                    ],
                    'mockUri2',
                    1,
                    [],
                ],
                [
                    {
                        detail: 'mockComment',
                        insertText: 'mockName(mockParam1, mockParam2)',
                        kind: vscode.CompletionItemKind.Method,
                        label: 'mockName',
                    },
                ],
            ],
        ];
        // same vs different file
        // inside vs outside method
        // with or without params
        // with or without variables
        tests.forEach(([name, args, expected]) =>
            test(name, async () =>
                assert.deepEqual(
                    await provideCompletionItemsInner(...args),
                    expected,
                ),
            ),
        );
    });
});
