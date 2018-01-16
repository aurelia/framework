/**
 * Specifies the available logging levels.
 */
export interface LogLevel {
  /**
   * No logging.
   */
  none: number;
  /**
   * Log only error messages.
   */
  error: number;
  /**
   * Log warnings messages or above.
   */
  warn: number;
  /**
   * Log informational messages or above.
   */
  info: number;
  /**
   * Log all messages.
   */
  debug: number;

  /**
   * Additional log levels defined at runtime.
   */
  [level: string]: number;
}
