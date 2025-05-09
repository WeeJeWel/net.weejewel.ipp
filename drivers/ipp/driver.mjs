import Homey from 'homey';

export default class IPPDriver extends Homey.Driver {

  async onInit() {
    this.homey.flow
      .getActionCard('print-text')
      .registerRunListener(async args => {
        await args.device.printText(args.text);
      });
  }

  async onPairListDevices() {
    const discoveryStrategy = this.getDiscoveryStrategy();
    const discoveryResults = discoveryStrategy.getDiscoveryResults();

    const devices = Object.values(discoveryResults).map(discoveryResult => {
      return {
        name: discoveryResult.name,
        data: {
          id: discoveryResult.id,
        },
      };
    });

    return devices;
  }

};
