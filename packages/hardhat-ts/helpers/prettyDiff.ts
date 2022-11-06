/*
  This file contains code ripped pretty haphazardly out of Mocha.js
  (https://github.com/mochajs/mocha/blob/11c45609b56dda11460b1f8e0d2a415cf8f9915d/lib/reporters/base.js)
  MIT License applies
*/

/*
  (The MIT License)

  Copyright (c) 2011-2022 OpenJS Foundation and contributors, https://openjsf.org

  Permission is hereby granted, free of charge, to any person obtaining
  a copy of this software and associated documentation files (the
  'Software'), to deal in the Software without restriction, including
  without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to
  permit persons to whom the Software is furnished to do so, subject to
  the following conditions:

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as diff from 'diff';

// const maxDiffSize = 8192;
const colors = {
  pass: 90,
  fail: 31,
  'bright pass': 92,
  'bright fail': 91,
  'bright yellow': 93,
  pending: 36,
  suite: 0,
  'error title': 0,
  'error message': 31,
  'error stack': 90,
  checkmark: 32,
  fast: 90,
  medium: 33,
  slow: 31,
  green: 32,
  light: 90,
  'diff gutter': 90,
  'diff added': 32,
  'diff removed': 31,
  'diff added inline': '30;42',
  'diff removed inline': '30;41'
};

/**
 * Color `str` with the given `type`,
 * allowing colors to be disabled,
 * as well as user-defined color
 * schemes.
 *
 * @private
 * @param {string} type
 * @param {string} str
 * @return {string}
 */
const color = (type: keyof typeof colors, str: string): string => {
  return `\u001b[${colors[type]}m${str}\u001b[0m`;
};

/**
 * Colors lines for `str`, using the color `name`.
 *
 * @private
 * @param {string} name
 * @param {string} str
 * @return {string}
 */
const colorLines = (name: keyof typeof colors, str: string): string => (
  str
    .split('\n')
    .map(str => color(name, str))
    .join('\n')
);

/**
 * Returns unified diff between two strings with coloured ANSI output.
 *
 * @private
 * @param {String} actual
 * @param {String} expected
 * @return {string} The diff.
 */
const prettyDiff = (actual: string, expected: string): string => {
  const indent = '      ';
  const cleanUp = (line: string): string | null => {
    if (line[0] === '+') {
      return indent + colorLines('diff added', line);
    }
    if (line[0] === '-') {
      return indent + colorLines('diff removed', line);
    }
    if (line.match(/@@/) !== null) {
      return '--';
    }
    if (line.match(/\\ No newline/) !== null) {
      return null;
    }
    return indent + line;
  }
  const notBlank = (line: string | null | undefined): boolean => {
    return typeof line !== 'undefined' && line !== null;
  }
  const msg = diff.createPatch('string', actual, expected);
  const lines = msg.split('\n').splice(5);
  return `\n${lines.map(cleanUp).filter(notBlank).join('\n')}`
}

export default prettyDiff;