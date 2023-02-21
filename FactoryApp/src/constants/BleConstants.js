const BleConstants = {
  timeData: {
    serviceUUID: 'a2104004-7d7d-11eb-9439-0242ac130002',
    characteristicUUID: 'a2104005-7d7d-11eb-9439-0242ac130002',
    maxByteSize: 8,
  },
  modelData: {
    serviceUUID: '180a',
    characteristicUUID: '2a24',
  },
  sessionStartTimestamp: {
    serviceUUID: 'a2101000-7d7d-11eb-9439-0242ac130002',
    characteristicUUID: 'a2101006-7d7d-11eb-9439-0242ac130002',
  },
  masterSlave: {
    serviceUUID: 'a2101000-7d7d-11eb-9439-0242ac130002',
    characteristicUUID: 'a2101007-7d7d-11eb-9439-0242ac130002',
  },
  sensorControlCmd: {
    serviceUUID: 'a2101000-7d7d-11eb-9439-0242ac130002',
    characteristicUUID: 'a2101005-7d7d-11eb-9439-0242ac130002',
  },
  debug: {
    serviceUUID: 'a2101000-7d7d-11eb-9439-0242ac130002',
    characteristicUUID: 'a2101005-7d7d-11eb-9439-0242ac130002',
  },
  rebootInfo: {
    serviceUUID: 'a2101000-7d7d-11eb-9439-0242ac130002',
    characteristicUUID: 'a2101101-7d7d-11eb-9439-0242ac130002',
  },
  resetReas: {
    serviceUUID: 'a2101000-7d7d-11eb-9439-0242ac130002',
    characteristicUUID: 'a2101102-7d7d-11eb-9439-0242ac130002',
  },
  secondsSinceLastReboot: {
    serviceUUID: 'a2101000-7d7d-11eb-9439-0242ac130002',
    characteristicUUID: 'a2101103-7d7d-11eb-9439-0242ac130002',
  },
  firmwareVersionData: {
    serviceUUID: '180a',
    characteristicUUID: '2a26',
  },
  batteryLevel: {
    serviceUUID: '180f',
    characteristicUUID: '2a19',
    maxByteSize: 1,
  },
  uptime: {
    serviceUUID: 'a2101000-7d7d-11eb-9439-0242ac130002',
    characteristicUUID: 'a2101103-7d7d-11eb-9439-0242ac130002',
  },
  sensorState: {
    serviceUUID: 'a2101000-7d7d-11eb-9439-0242ac130002',
    characteristicUUID: 'a2101002-7d7d-11eb-9439-0242ac130002',
    maxByteSize: 1,
  },
  startStop: {
    serviceUUID: 'a2101000-7d7d-11eb-9439-0242ac130002',
    characteristicUUID: 'a2101004-7d7d-11eb-9439-0242ac130002',
  },
  dataSize: {
    serviceUUID: 'a2103000-7d7d-11eb-9439-0242ac130002',
    characteristicUUID: 'a2103003-7d7d-11eb-9439-0242ac130002',
    maxByteSize: 4,
  },
  sessionCount: {
    serviceUUID: 'a2103000-7d7d-11eb-9439-0242ac130002',
    characteristicUUID: 'a2103005-7d7d-11eb-9439-0242ac130002',
    maxByteSize: 4,
  },
  recordingData: {
    serviceUUID: 'a2101000-7d7d-11eb-9439-0242ac130002',
    characteristicUUID: 'a2101004-7d7d-11eb-9439-0242ac130002',
    notificationUUID: 'a2101002-7d7d-11eb-9439-0242ac130002',
    maxByteSize: 1,
  },
  dataContent: {
    serviceUUID: 'a2103000-7d7d-11eb-9439-0242ac130002',
    characteristicUUID: 'a2103010-7d7d-11eb-9439-0242ac130002',
  },
  dataControl: {
    serviceUUID: 'a2103000-7d7d-11eb-9439-0242ac130002',
    characteristicUUID: 'a2103002-7d7d-11eb-9439-0242ac130002',
    maxByteSize: 1,
  },
  dataSource: {
    serviceUUID: 'a2103000-7d7d-11eb-9439-0242ac130002',
    characteristicUUID: 'a2103001-7d7d-11eb-9439-0242ac130002',
    maxByteSize: 1,
  },
  playerHeight: {
    serviceUUID: 'a2101000-7d7d-11eb-9439-0242ac130002',
    characteristicUUID: 'a2102100-7d7d-11eb-9439-0242ac130002',
    maxByteSize: 2,
  },
  securityData: {
    serviceUUID: '180a',
    characteristicUUID: '2a26',
  },
  sensorShoe: {
    serviceUUID: 'a2101000-7d7d-11eb-9439-0242ac130002',
    characteristicUUID: 'a2102101-7d7d-11eb-9439-0242ac130002',
    maxByteSize: 2,
  },
};

export default BleConstants;
