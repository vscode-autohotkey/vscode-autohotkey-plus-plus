import * as assert from 'assert';
import {
    buildIndentationChars,
    buildIndentedLine,
    hasMoreCloseParens,
    hasMoreOpenParens,
    purify,
    removeEmptyLines,
    trimExtraSpaces,
} from '../../../../providers/formattingProvider.utils';

suite('FormattingProvider utils', () => {
    suite('buildIndentationChars', () => {
        // List of test data
        let dataList = [
            // {
            //     dp: , // depth of indentation
            //     op: , // formatting options
            //     rs: , // expected result
            // },
            {
                dp: 0,
                op: { insertSpaces: true, tabSize: 4 },
                rs: '',
            },
            {
                dp: 1,
                op: { insertSpaces: true, tabSize: 4 },
                rs: '    ',
            },
            {
                dp: 2,
                op: { insertSpaces: true, tabSize: 4 },
                rs: '        ',
            },
            {
                dp: 1,
                op: { insertSpaces: false, tabSize: 4 },
                rs: '\t',
            },
            {
                dp: 2,
                op: { insertSpaces: false, tabSize: 4 },
                rs: '\t\t',
            },
        ];
        dataList.forEach((data) => {
            test(
                'depth:' +
                    data.dp +
                    ' spaces:' +
                    data.op.insertSpaces.toString() +
                    " => '" +
                    data.rs.replace(/\t/g, '\\t') +
                    "'",
                () => {
                    assert.strictEqual(
                        buildIndentationChars(data.dp, data.op),
                        data.rs,
                    );
                },
            );
        });
    });

    suite('buildIndentedLine', () => {
        // List of test data
        let dataList = [
            // {
            //     dp: , // depth of indentation
            //     fl: , // formatted line
            //     op: , // formatting options
            //     pi: , // preserve indent
            //     rs: , // expected result
            // },
            {
                dp: 0,
                fl: 'SoundBeep',
                op: { insertSpaces: true, tabSize: 4 },
                pi: false,
                rs: 'SoundBeep',
            },
            {
                dp: 1,
                fl: 'SoundBeep',
                op: { insertSpaces: true, tabSize: 4 },
                pi: false,
                rs: '    SoundBeep',
            },
            {
                dp: 2,
                fl: 'SoundBeep',
                op: { insertSpaces: true, tabSize: 4 },
                pi: false,
                rs: '        SoundBeep',
            },
            {
                dp: 1,
                fl: 'SoundBeep',
                op: { insertSpaces: false, tabSize: 4 },
                pi: false,
                rs: '\tSoundBeep',
            },
            {
                dp: 2,
                fl: 'SoundBeep',
                op: { insertSpaces: false, tabSize: 4 },
                pi: false,
                rs: '\t\tSoundBeep',
            },
            {
                dp: 1,
                fl: '',
                op: { insertSpaces: true, tabSize: 4 },
                pi: true,
                rs: '    ',
            },
            {
                dp: 2,
                fl: '',
                op: { insertSpaces: false, tabSize: 4 },
                pi: true,
                rs: '\t\t',
            },
        ];
        dataList.forEach((data) => {
            test(
                'depth:' +
                    data.dp +
                    ' spaces:' +
                    data.op.insertSpaces.toString() +
                    ' preserveIndent:' +
                    data.pi.toString() +
                    " '" +
                    data.fl +
                    "' => '" +
                    data.rs.replace(/\t/g, '\\t') +
                    "'",
                () => {
                    assert.strictEqual(
                        buildIndentedLine(
                            0,
                            1,
                            data.fl,
                            data.dp,
                            data.op,
                            data.pi,
                        ),
                        data.rs,
                    );
                },
            );
        });
    });

    suite('hasMoreCloseParens', () => {
        // List of test data
        let dataList = [
            // {
            //     in: , // input test string
            //     rs: , // expected result
            // },
            {
                in: ')',
                rs: true,
            },
            {
                in: '()',
                rs: false,
            },
            {
                in: '())',
                rs: true,
            },
            {
                in: '(::',
                rs: false,
            },
            {
                in: '',
                rs: false,
            },
        ];
        dataList.forEach((data) => {
            test("'" + data.in + "'" + ' => ' + data.rs.toString(), () => {
                assert.strictEqual(hasMoreCloseParens(data.in), data.rs);
            });
        });
    });

    suite('hasMoreOpenParens', () => {
        // List of test data
        let dataList = [
            // {
            //     in: , // input test string
            //     rs: , // expected result
            // },
            {
                in: '(',
                rs: true,
            },
            {
                in: '()',
                rs: false,
            },
            {
                in: '(()',
                rs: true,
            },
            {
                in: '(::',
                rs: true,
            },
            {
                in: '',
                rs: false,
            },
        ];
        dataList.forEach((data) => {
            test("'" + data.in + "'" + ' => ' + data.rs.toString(), () => {
                assert.strictEqual(hasMoreOpenParens(data.in), data.rs);
            });
        });
    });

    suite('purify', () => {
        // List of test data
        let dataList = [
            // {
            //     in: , // input test string
            //     rs: , // expected result
            // },
            {
                in: 'foo("; not comment")',
                rs: 'foo("")',
            },
            {
                in: 'MsgBox, { ; comment with close brace }',
                rs: 'MsgBox',
            },
            {
                in: 'MsgBox % "; not comment"',
                rs: 'MsgBox',
            },
            {
                in: 'str = "`; not comment"',
                rs: 'str = ""',
            },
            {
                in: 'str = "; comment with double quote"',
                rs: 'str = ""',
            },
            {
                in: 'str = "; comment',
                rs: 'str = "',
            },
            {
                in: 'Gui, %id%: Color, % color',
                rs: 'Gui',
            },
            {
                in: 'Send(Gui)',
                rs: 'Send(Gui)',
            },
            {
                in: 'Send(foo)',
                rs: 'Send(foo)',
            },
            {
                in: 'foo(Gui)',
                rs: 'foo(Gui)',
            },
        ];
        dataList.forEach((data) => {
            test("'" + data.in + "' => '" + data.rs + "'", () => {
                assert.strictEqual(purify(data.in), data.rs);
            });
        });
    });

    suite('removeEmptyLines', () => {
        // List of test data
        let dataList = [
            // {
            //     in: , // input test string
            //     ln: , // allowed empty lines
            //     rs: , // expected result
            // },
            {
                in: 'text\n\n\n\n\ntext\n\n\n\n\n',
                ln: -1,
                rs: 'text\n\n\n\n\ntext\n\n\n\n\n',
            },
            {
                in: 'text\n\n\n\n\ntext\n\n\n\n\n',
                ln: 0,
                rs: 'text\ntext\n',
            },
            {
                in: 'text\n\n\n\n\ntext\n\n\n\n\n',
                ln: 1,
                rs: 'text\n\ntext\n\n',
            },
            {
                in: 'text\n\n\n\n\ntext\n\n\n\n\n',
                ln: 2,
                rs: 'text\n\n\ntext\n\n\n',
            },
            {
                in: 'text\n\n\n\n\ntext\n\n\n\n\n',
                ln: 3,
                rs: 'text\n\n\n\ntext\n\n\n\n',
            },
            {
                in: 'text\n    \n    \n    \n    \ntext\n    \n    \n    \n    \n',
                ln: 0,
                rs: 'text\ntext\n',
            },
            {
                in: 'text\n    \n    \n    \n    \ntext\n    \n    \n    \n    \n',
                ln: 1,
                rs: 'text\n    \ntext\n    \n',
            },
            {
                in: 'text\n    \n    \n    \n    \ntext\n    \n    \n    \n    \n',
                ln: 2,
                rs: 'text\n    \n    \ntext\n    \n    \n',
            },
            {
                in: 'text\n    \n    \n    \n    \ntext\n    \n    \n    \n    \n',
                ln: 3,
                rs: 'text\n    \n    \n    \ntext\n    \n    \n    \n',
            },
            {
                in: '\n\n\ntext',
                ln: 1,
                rs: 'text',
            },
            {
                in: '    \n',
                ln: 1,
                rs: '',
            },
            {
                in: '\t\n',
                ln: 1,
                rs: '',
            },
            {
                in: 'text\ntext',
                ln: 1,
                rs: 'text\ntext',
            },
            {
                in: 'text\n',
                ln: 1,
                rs: 'text\n',
            },
        ];
        dataList.forEach((data) => {
            test(
                'ln:' +
                    data.ln +
                    " '" +
                    data.in.replace(/\n/g, '\\n') +
                    "' => '" +
                    data.rs.replace(/\n/g, '\\n') +
                    "'",
                () => {
                    assert.strictEqual(
                        removeEmptyLines(data.in, data.ln),
                        data.rs,
                    );
                },
            );
        });
    });

    suite('trimExtraSpaces', () => {
        // List of test data
        let dataList = [
            // {
            //     in: , // input test string
            //     rs: , // expected result
            //     ts: , // trim extra spaces
            // },
            {
                in: 'InputFile    :=    "movie.mkv"',
                rs: 'InputFile := "movie.mkv"',
                ts: true,
            },
            {
                in: 'InputFile    :=    "movie.mkv"',
                rs: 'InputFile    :=    "movie.mkv"',
                ts: false,
            },
            {
                in: 'MsgBox,  4,   , testing   testing',
                rs: 'MsgBox, 4, , testing testing',
                ts: true,
            },
        ];
        dataList.forEach((data) => {
            test(
                'Trim(' +
                    data.ts.toString() +
                    "): '" +
                    data.in +
                    "' => '" +
                    data.rs +
                    "'",
                () => {
                    assert.strictEqual(
                        trimExtraSpaces(data.in, data.ts),
                        data.rs,
                    );
                },
            );
        });
    });
});
