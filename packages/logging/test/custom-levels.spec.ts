import * as LogManager from '../src/index';

describe('The log manager', () => {
  // let logger;
  let testAppender;
  let customLevelAppender;
  const logName = 'test';
  const customLevel = { name: 'trace', value: 35 }; // Value between info and debug.

  // tslint:disable
  class TestAppender {
    public debug(_args) {}
    public info(_args) {}
    public warn(_args) {}
    public error(_args) {}
  }

  class CustomLevelAppender {
    public debug(_args) {}
    public info(_args)  {}
    public warn(_args)  {}
    public error(_args) {}
    public trace(_args) {}
  }
  // tslint:enable

  beforeEach(() => {
    LogManager.clearAppenders();
    testAppender = new TestAppender();
    customLevelAppender = new CustomLevelAppender();
  });

  function addLevel() { LogManager.addCustomLevel(customLevel.name, customLevel.value); }
  function removeLevel() { LogManager.removeCustomLevel(customLevel.name); }

  describe('calling addCustomLevel', () => {
    describe('should add level to logLevels', () => {
      beforeEach(addLevel);
      afterEach(removeLevel);

      it('with provided name', () => {
        expect(LogManager.logLevel[customLevel.name]).toBeDefined();
      });

      it('with the provided severity value', () => {
        expect(LogManager.logLevel[customLevel.name]).toBe(customLevel.value);
      });
    });

    it('should throw when level exists.', () => {
      expect(() => { LogManager.addCustomLevel('info', customLevel.value); }).toThrow();
    });

    it('should throw when severity value is not a number.', () => {
      expect(() => { LogManager.addCustomLevel(customLevel.name, 'Invalid' as any); }).toThrow();
    });

    function addsLevelAsMethod() {
      it('adds the level as a method of Logger', () => {
        const logger: any = LogManager.getLogger(logName);
        expect(logger.trace).toBeUndefined();
        addLevel();
        expect(typeof logger.trace).toBe('function');
        removeLevel();
      });
    }

    describe('before appenders have been added', () => {
      addsLevelAsMethod();
    });

    describe('after appenders have been added', () => {
      beforeEach(() => {
        LogManager.addAppender(testAppender);
        LogManager.addAppender(customLevelAppender);
      });

      addsLevelAsMethod();
    });
  });

  describe('calling removeCustomLevel', () => {
    it('removes level from logLevels', () => {
      addLevel();
      expect(LogManager.logLevel[customLevel.name]).toBeDefined();
      removeLevel();
      expect(LogManager.logLevel[customLevel.name]).toBeUndefined();
    });

    it('does nothing if level does not exist.', () => {
      expect(() => { LogManager.removeCustomLevel('nonexistent'); }).not.toThrow();
    });

    // tslint:disable
    for (const level in LogManager.logLevel) {
      it(`should throw when called with built-in level '${level}'`, () => {
        expect(() => { LogManager.removeCustomLevel(level); }).toThrow();
      });
    }
    // tslint:enable

    it('removes the level as a method of Logger', () => {
      const logger: any = LogManager.getLogger(logName);
      addLevel();
      expect(logger.trace).toBeDefined();
      removeLevel();
      expect(logger.trace).toBeUndefined();
    });

  });

  describe('', () => {
    beforeEach(() => {
      addLevel();
      LogManager.clearAppenders();
      customLevelAppender = new CustomLevelAppender();
      spyOn(customLevelAppender, 'trace');
    });
    afterEach(removeLevel);

    it('calls custom method on supported appenders.', () => {
      LogManager.addAppender(customLevelAppender);
      const logger: any = LogManager.getLogger(logName);
      logger.setLevel(LogManager.logLevel.debug);
      logger.trace('foo');
      expect(customLevelAppender.trace.calls.count()).toBe(1);
    });

    it('does not call custom method on appender when level is higher than custom severity value.', () => {
      LogManager.addAppender(customLevelAppender);
      const logger: any = LogManager.getLogger(logName);
      logger.setLevel(LogManager.logLevel.info);
      logger.trace('foo');
      expect(customLevelAppender.trace.calls.count()).toBe(0);
    });

    it('does not attempt to call custom method on unsupported appenders.', () => {
      testAppender = new TestAppender();
      LogManager.addAppender(testAppender);
      const logger: any = LogManager.getLogger(logName);
      logger.setLevel(LogManager.logLevel.debug);
      expect(() => { logger.trace('foo'); }).not.toThrow();
    });
  });
});
