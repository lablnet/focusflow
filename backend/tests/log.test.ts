import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { logger, dlog } from '../src/utils/log';

describe('Logger', () => {
    let consoleInfoSpy: any;
    let consoleWarnSpy: any;
    let consoleErrorSpy: any;
    let consoleDebugSpy: any;

    const originalEnv = process.env;

    beforeEach(() => {
        // Mock console methods so we don't clutter the test output
        consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => { });
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation(() => { });

        // Isolate environment variables for each test
        jest.resetModules();
        process.env = { ...originalEnv };
        process.env.NODE_ENV = 'test'; // By default, act like test environment, not development
        delete process.env.DEBUG_LEVEL;
    });

    afterEach(() => {
        // Restore environment variables
        process.env = originalEnv;
        jest.restoreAllMocks();
    });

    it('should log info messages with correct [INFO] prefix', () => {
        logger.info('Test info message', { key: 'value' });
        expect(consoleInfoSpy).toHaveBeenCalledTimes(1);
        expect(consoleInfoSpy.mock.calls[0][0]).toContain('[INFO]');
        expect(consoleInfoSpy.mock.calls[0][1]).toBe('Test info message');
        expect(consoleInfoSpy.mock.calls[0][2]).toEqual({ key: 'value' });
    });

    it('should log warn messages with correct [WARN] prefix', () => {
        logger.warn('Test warn message');
        expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
        expect(consoleWarnSpy.mock.calls[0][0]).toContain('[WARN]');
        expect(consoleWarnSpy.mock.calls[0][1]).toBe('Test warn message');
    });

    it('should log error messages with correct [ERROR] prefix', () => {
        logger.error('Test error message');
        expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
        expect(consoleErrorSpy.mock.calls[0][0]).toContain('[ERROR]');
        expect(consoleErrorSpy.mock.calls[0][1]).toBe('Test error message');
    });

    describe('debug and dlog behavior', () => {
        it('should NOT log debug messages if environment is not development and DEBUG_LEVEL is not debug', () => {
            process.env.NODE_ENV = 'production';
            logger.debug('Hidden debug message');
            expect(consoleDebugSpy).not.toHaveBeenCalled();
        });

        it('should log debug messages if NODE_ENV is development', () => {
            process.env.NODE_ENV = 'development';
            logger.debug('Visible debug message');
            expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
            expect(consoleDebugSpy.mock.calls[0][0]).toContain('[DEBUG]');
            expect(consoleDebugSpy.mock.calls[0][1]).toBe('Visible debug message');
        });

        it('should log debug messages if DEBUG_LEVEL is debug (even if NODE_ENV is not development)', () => {
            process.env.NODE_ENV = 'production';
            process.env.DEBUG_LEVEL = 'debug';
            logger.debug('Visible debug message via debug_level');
            expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
            expect(consoleDebugSpy.mock.calls[0][0]).toContain('[DEBUG]');
        });

        it('dlog should act as a backward-compatible wrapper for logger.debug', () => {
            process.env.NODE_ENV = 'development';
            dlog('Backward compatible debug');
            expect(consoleDebugSpy).toHaveBeenCalledTimes(1);
            expect(consoleDebugSpy.mock.calls[0][0]).toContain('[DEBUG]');
            expect(consoleDebugSpy.mock.calls[0][1]).toBe('Backward compatible debug');
        });
    });
});
