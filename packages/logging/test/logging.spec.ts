import * as LogManager from '../src/index';

describe('A simple log manager test', () => {
  it('should return a logger', () => {
    const logger = LogManager.getLogger('test');
    expect(logger).not.toBe(null as any);
  });
  it('should default to logLevel none', () => {
    const logger = LogManager.getLogger('test2');
    expect(logger.level).toBe(LogManager.logLevel.none);
  });
});

describe('The log manager ', () => {
  const logName = 'test';
  let logger: LogManager.Logger;
  let testAppender;

  class TestAppender {
    public debug(args) { } //tslint:disable-line
    public info(args) { } //tslint:disable-line
    public warn(args) { } //tslint:disable-line
    public error(args) { } //tslint:disable-line
  }

  beforeEach(() => {
    testAppender = new TestAppender();

    spyOn(testAppender, 'debug');
    spyOn(testAppender, 'info');
    spyOn(testAppender, 'warn');
    spyOn(testAppender, 'error');

    LogManager.addAppender(testAppender);
    logger = LogManager.getLogger(logName);
    LogManager.setLevel(LogManager.logLevel.none);
  });

  it('should remove the test appender', () => {
    LogManager.setLevel(LogManager.logLevel.debug);
    LogManager.removeAppender(testAppender);
    logger.debug('foo');
    expect(testAppender.debug.calls.count()).toBe(0);
  });

  it('should call only call debug when logLevel is debug', () => {
    LogManager.setLevel(LogManager.logLevel.debug);
    logger.debug('foo');

    LogManager.setLevel(LogManager.logLevel.info);
    logger.debug('foo');

    LogManager.setLevel(LogManager.logLevel.warn);
    logger.debug('foo');

    LogManager.setLevel(LogManager.logLevel.error);
    logger.debug('foo');

    LogManager.setLevel(LogManager.logLevel.none);
    logger.debug('foo');

    expect(testAppender.debug.calls.count()).toBe(1);
  });

  it('should call only call info when logLevel is debug or info', () => {
    LogManager.setLevel(LogManager.logLevel.debug);
    logger.info('foo');

    LogManager.setLevel(LogManager.logLevel.info);
    logger.info('foo');

    LogManager.setLevel(LogManager.logLevel.warn);
    logger.info('foo');

    LogManager.setLevel(LogManager.logLevel.error);
    logger.info('foo');

    LogManager.setLevel(LogManager.logLevel.none);
    logger.info('foo');

    expect(testAppender.info.calls.count()).toBe(2);
  });

  it('should call only call warn when logLevel is debug, info, or warn', () => {
    LogManager.setLevel(LogManager.logLevel.debug);
    logger.warn('foo');

    LogManager.setLevel(LogManager.logLevel.info);
    logger.warn('foo');

    LogManager.setLevel(LogManager.logLevel.warn);
    logger.warn('foo');

    LogManager.setLevel(LogManager.logLevel.error);
    logger.warn('foo');

    LogManager.setLevel(LogManager.logLevel.none);
    logger.warn('foo');

    expect(testAppender.warn.calls.count()).toBe(3);
  });

  it('should call only call error when logLevel is debug, info, warn, or error', () => {
    LogManager.setLevel(LogManager.logLevel.debug);
    logger.error('foo');

    LogManager.setLevel(LogManager.logLevel.info);
    logger.error('foo');

    LogManager.setLevel(LogManager.logLevel.warn);
    logger.error('foo');

    LogManager.setLevel(LogManager.logLevel.error);
    logger.error('foo');

    LogManager.setLevel(LogManager.logLevel.none);
    logger.error('foo');

    expect(testAppender.error.calls.count()).toBe(4);
  });

  it('should pass arguments to the appender', () => {
    LogManager.setLevel(LogManager.logLevel.debug);
    logger.debug('123');

    expect(testAppender.debug).toHaveBeenCalledWith(logger, '123');
  });

  it('should pass multiple arguments to the appender', () => {
    const objectToLog = {
      id: 1,
      name: 'John'
    };

    LogManager.setLevel(LogManager.logLevel.debug);
    logger.debug('123', objectToLog);

    expect(testAppender.debug).toHaveBeenCalledWith(logger, '123', objectToLog);
  });

  // it('should throw an exception if the Logger class is newed up by the developer', () => {
    // const attemptingToNewUpALogger = () => { const myNewLogger = new Logger(); };
    // expect(attemptingToNewUpALogger).toThrow();
  // });

  it('should be able to return the global logLevel', () => {
    LogManager.setLevel(LogManager.logLevel.debug);
    const globalLogLevel = LogManager.getLevel();

    expect(globalLogLevel).toEqual(LogManager.logLevel.debug);
  });

  describe('setting logLevel per individual logger instance', () => {
    it('should not log if specific logger logLevel is none', () => {
      //  get a new logger we can squelch individually
      const logger2 = LogManager.getLogger('test2');

      // sets log level for ALL loggers to debug
      LogManager.setLevel(LogManager.logLevel.debug);

      // set logger-specific level - turning off logging for the logger2 source
      logger2.setLevel(LogManager.logLevel.none);

      logger.debug('foo'); // this should log
      logger2.debug('foo'); // this should not

      expect(testAppender.debug.calls.count()).toBe(1);
    });

    it('can log at different levels for different loggers', () => {
      const logger2 = LogManager.getLogger('test2');

      logger.setLevel(LogManager.logLevel.error);
      logger2.setLevel(LogManager.logLevel.debug);

      logger.debug('foo');
      logger.info('for');
      logger.error('foo');
      logger.warn('foo');

      logger2.debug('foo');

      expect(testAppender.debug.calls.count()).toBe(1);
      expect(testAppender.debug.calls.argsFor(0)).toEqual([jasmine.objectContaining({ id: 'test2' }), 'foo']);
      expect(testAppender.error.calls.count()).toBe(1);
      expect(testAppender.error.calls.argsFor(0)).toEqual([jasmine.objectContaining({ id: 'test' }), 'foo']);
    });

    it('setting LogManager log level resets any logger-specific levels', () => {
      const logger2 = LogManager.getLogger('test2');

      logger.setLevel(LogManager.logLevel.warn);
      logger2.setLevel(LogManager.logLevel.debug);
      // this overrides the individual log levels set above
      LogManager.setLevel(LogManager.logLevel.error);

      expect(logger2.level).toBe(LogManager.logLevel.error);
      expect(logger.level).toBe(LogManager.logLevel.error);
    });

    it('carries a global logLevel with which all created loggers are initialized', () => {
      LogManager.setLevel(LogManager.logLevel.debug);
      const logger2 = LogManager.getLogger('test2');
      expect(logger2.level).toBe(LogManager.logLevel.debug);
    });
  });
});
