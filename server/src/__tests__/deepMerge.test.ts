import {describe, expect, it} from 'bun:test';
import { MergeError, deepMerge } from '../utils';

describe('shallow test', () => {
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
        c: 3
    }

    const empty = {}

    it('should change nothing', () => {
        expect(deepMerge(a, empty)).toStrictEqual(a);
    })

    it('should throw MergeError', () => {
        expect(()=>deepMerge(a, b)).toThrow()
    })

    it('should merge objects', () => {
        const res = {
            a: 1,
            b: 2,
            c: 3
        }

        expect(deepMerge(a, c)).toStrictEqual(res);
        expect(deepMerge(c, a)).toStrictEqual(res);
    })
})

describe('deep merge', () => {
    const a = {
        a: {
            b: 1,
            c: 'abc'
        },
        b: {
            c: null,
            d: 4
        }
    }

    const a_copy = a;
    const a_deep_copy = {
        a: {
            b: 1,
            c: 'abc'
        },
        b: {
            c: null,
            d: 4
        }
    }

    const b = {
        c: {
            a: 1,
            b: 2
        }
    }

    const c = {
        a: {
            b: 1,
            d: 6
        }
    }

    it('should change nothing', () => {
        expect(deepMerge(a, a_copy)).toStrictEqual(a)
        expect(deepMerge(a, a_deep_copy)).toStrictEqual(a)
    })

    it('should merge successfully', () => {
        const res = {
            a: {
                b: 1,
                c: 'abc'
            },
            b: {
                c: null,
                d: 4
            },
            c: {
                a: 1,
                b: 2
            }
        }

        expect(deepMerge(a, b)).toStrictEqual(res);
    })

    it('should merge inner contents successfully', () => {
        const res = {
            a: {
                b: 1,
                c: 'abc',
                d: 6
            },
            b: {
                c: null,
                d: 4
            }
        }

        expect(deepMerge(a, c)).toStrictEqual(res);
    })
})
