/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

describe('ArrayUtils', function() {
  const ArrayUtils = shaka.util.ArrayUtils;

  describe('removeDuplicates', function() {
    it('will remove duplicate elements', function() {
      let arr = [1, 2, 2, 5, 6, 3, 1, 2];
      expect(ArrayUtils.removeDuplicates(arr)).toEqual([1, 2, 5, 6, 3]);
    });

    it('removes duplicate NaN', function() {
      let arr = [NaN, 1, NaN, 2, NaN, NaN];
      expect(ArrayUtils.removeDuplicates(arr)).toEqual([NaN, 1, 2]);
    });

    it('does nothing if no duplicates', function() {
      let arr = [1, 2, 3, 6, 5, 4];
      expect(ArrayUtils.removeDuplicates(arr)).toEqual(arr);
    });

    it('accepts an optional comparator', function() {
      let arr = ['aaa', 'abc', 'bat', 'car', 'cat'];
      let comparator = function(a, b) { return a[0] === b[0]; };
      expect(ArrayUtils.removeDuplicates(arr, comparator))
          .toEqual(['aaa', 'bat', 'car']);
    });
  });

  describe('indexOf', function() {
    it('will find a matching element', function() {
      let arr = ['aaa', 'bbb', 'ccc'];
      let comparator = function(a, b) { return a[0] === b[0]; };
      expect(ArrayUtils.indexOf(arr, 'bat', comparator)).toBe(1);
    });

    it('will return -1 if not found', function() {
      let arr = ['aaa', 'bbb', 'ccc'];
      let comparator = function(a, b) { return a[0] === b[0]; };
      expect(ArrayUtils.indexOf(arr, 'zoo', comparator)).toBe(-1);
    });
  });

  describe('hasSameElements', function() {
    it('determines same elements', () => {
      expectEqual([], []);
      expectEqual([1, 2, 3], [1, 2, 3]);
      expectEqual([1, 2, 3], [3, 2, 1]);
      expectEqual([1, 1, 2], [1, 2, 1]);
      expectEqual([1, 2, 2, 1], [1, 2, 1, 2]);
      expectEqual([1, NaN, NaN], [NaN, NaN, 1]);

      expectNotEqual([1], [2]);
      expectNotEqual([1, 2], [1]);
      expectNotEqual([1, 1, 2], [1, 2]);
      expectNotEqual([1, 2], [1, 1, 2]);
      expectNotEqual([1, 2], [1, 2, 3]);
      expectNotEqual([1, 2, 3, 1], [1, 2, 1, 2]);
    });

    it('handles different types', () => {
      expectEqual(['1', 2], [2, '1']);
      const a = {};
      expectEqual([a], [a]);
      expectEqual([1, a], [a, 1]);

      expectNotEqual(['f'], [NaN]);
      expectNotEqual([{}], [{}]);
      expectNotEqual([1], [{}]);
      expectNotEqual([1], ['1']);
    });

    it('allows custom comparer', () => {
      const comp = (a, b) => a.i == b.i;
      expectEqual([{i: 1}], [{i: 1}], comp);
      expectEqual([{i: 1}, {i: 2}], [{i: 2}, {i: 1}], comp);
      expectEqual([{i: 1}, {i: 1}], [{i: 1}, {i: 1}], comp);
      expectEqual([{i: 1, x: 1}], [{i: 1, x: 2}], comp);

      expectNotEqual([{i: 1}], [{i: 1}, {i: 1}], comp);
      expectNotEqual([{i: 1}], [{i: 2}], comp);
    });

    function expectEqual(a, b, comp = undefined) {
      expect(ArrayUtils.hasSameElements(a, b, comp)).toBe(true);
    }

    function expectNotEqual(a, b, comp = undefined) {
      expect(ArrayUtils.hasSameElements(a, b, comp)).toBe(false);
    }
  });
});
