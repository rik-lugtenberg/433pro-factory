import shipbook from '@shipbook/react-native';

class LogService {
  async initilize() {
    shipbook.start(
      '63eb4c902a16313c55013e96',
      'e242eaea90b0b1da0a2260e06b8a330e',
    );
  }

  log(message, logType) {
    try {
      let log = shipbook.getLogger('FactoryApp');
      switch (logType) {
        case 'Error':
          log.e(message);
          break;
        case 'Warning':
          log.w(message);
          break;
        case 'Info':
          log.i(message);
          break;
        case 'Debug':
          log.d(message);
          break;
        case 'Verbose':
          log.v(message);
          break;
        default:
          log.i(message);
      }
    } catch (e) {
      console.log('exception in the log', e);
    }
  }
}

const logService = new LogService();

export default logService;
