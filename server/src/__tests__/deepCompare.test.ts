import {describe, expect, it} from 'bun:test';
import { JSONDeepComparator } from '../comparators/deep_comparator';

const deepCompare = (a: any, b: any) => {
    const comparator = new JSONDeepComparator();

    return comparator.compare(a, b);
}

describe('shallow compare', () => {
    const a = {
        a: 1,
        b: 2
    }

    const a_copy = a;
    const a_deep_copy = {
        a: 1,
        b: 2
    }

    const b = {
        a: 2,
        b: 1
    }

    const c = {
        a: 1
    }

    const empty = {}

    it('should return empty object', () => {
        expect(deepCompare(a, a_copy)).toStrictEqual({})
        expect(deepCompare(a, a_deep_copy)).toStrictEqual({})
    })

    it('should return change', () => {
        const diff = {
            a: {
                expected: 1,
                found: 2
            },
            b: {
                expected: 2,
                found: 1
            }
        }

        expect(deepCompare(a, b)).toStrictEqual(diff);
    })

    it('should return added variable', () => {
        const diff = {
            b: {
                expected: undefined,
                found: 2
            }
        }

        expect(deepCompare(c, a)).toStrictEqual(diff);
    })

    it('should return whole object', () => {
        const diff = {
            a: {
                expected: 1,
                found: undefined
            },
            b: {
                expected: 2,
                found: undefined
            }
        }
    })
})

describe('deep compare', () => {
    const a = {
        a: {
            b: 2,
            c: 'str'
        },
        b: {
            c: 3,
            d: 'abc'
        }
    }

    const a_copy = a;
    const a_deep_copy = {
        a: {
            b: 2,
            c: 'str'
        },
        b: {
            c: 3,
            d: 'abc'
        }
    }

    const b = {
        a: 3,
        b: {
            c: 3,
            d: 'abc'
        }
    }

    const c = {
        a: {
            b: 2,
            c: null
        },
        b: {
            c: 3,
            d: 'abc'
        }
    }

    it('should return empty object', () => {
        expect(deepCompare(a, a_copy)).toStrictEqual({});
        expect(deepCompare(a, a_deep_copy)).toStrictEqual({});
    })

    it('should return difference', () => {
        const diff = {
            a: {
                expected: {
                    b: 2,
                    c: 'str'
                },
                found: 3
            }
        }

        expect(deepCompare(a, b)).toStrictEqual(diff);
    })

    it('shoud return deep difference', () => {
        const diff = {
            a: {
                b: 2,
                c: {
                    expected: 'str',
                    found: null
                }
            },
            b: {
                c: 3,
                d: 'abc'
            }
        }
    })

})
