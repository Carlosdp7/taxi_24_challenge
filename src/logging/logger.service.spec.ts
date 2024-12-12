import { createLogger, format, transports } from 'winston';
import { DataMaskingUtility } from '../utilities/data-masking.utility';

const logger = createLogger({
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    }),
  ),
});

describe('UserSendAText', () => {
  describe('Logger', () => {
    it('should return a text', async () => {
      const text = 'Testing service!';

      const loggerText = text;

      expect(loggerText).toBe('Testing service!');
    });
  });
});

describe('LoggerMask', () => {
  describe('Logger', () => {
    it('should return text mask', async () => {
      const message = 'Alejandra';
      const text = DataMaskingUtility.maskText(message);

      const loggerText = text;

      expect(loggerText).toBe('*****ndra');
    });
  });
});

describe('Logger', () => {
  describe('Logger', () => {
    it('should return logger info', async () => {
      const message = 'Alejandra';
      const text = logger.info(DataMaskingUtility.maskText(message));

      const loggerText = text;

      expect(loggerText).toBe(logger.info('*****ndra'));
    });
  });
});
