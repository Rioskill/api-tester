import {describe, expect, it} from 'bun:test';
import { shieldWords, unShieldWords } from '../utils';

describe('testing shieldWord', () => {
    it('should not shield anything', () => {
        expect(shieldWords(['a', 'b'], 'c')).toStrictEqual('c');
        expect(shieldWords(['a', 'b'], '!!c')).toStrictEqual('!!c');
    })

    it('should shield the word', () => {
        expect(shieldWords(['a', 'b'], 'a')).toStrictEqual('!a');
        expect(shieldWords(['a', 'b'], 'b')).toStrictEqual('!b');
    })

    it('should shield several times', () => {
        expect(shieldWords(['a', 'b'], '!a')).toStrictEqual('!!a');
        expect(shieldWords(['a', 'b'], '!!a')).toStrictEqual('!!!a');
        expect(shieldWords(['a', 'b'], '!!!b')).toStrictEqual('!!!!b');
    })
});

describe('testing unShieldWords', () => {
    it('should not unshield anything', () => {
        expect(unShieldWords(['a', 'b'], 'c')).toStrictEqual('c');
        expect(unShieldWords(['a', 'b'], '!!c')).toStrictEqual('!!c');
    })

    it('should unshield the word', () => {
        expect(unShieldWords(['a', 'b'], '!a')).toStrictEqual('a');
        expect(unShieldWords(['a', 'b'], '!b')).toStrictEqual('b');
    })

    it('should unshield only one time', () => {
        expect(unShieldWords(['a', 'b'], '!a')).toStrictEqual('a');
        expect(unShieldWords(['a', 'b'], '!!a')).toStrictEqual('!a');
        expect(unShieldWords(['a', 'b'], '!!!b')).toStrictEqual('!!b');
    }) 
})
