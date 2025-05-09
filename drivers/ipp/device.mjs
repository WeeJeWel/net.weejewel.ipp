import Homey from 'homey';
import ipp from '@sealsystems/ipp';

export default class IPPDevice extends Homey.Device {

  address = null;

  onDiscoveryResult(discoveryResult) {
    return discoveryResult.id === this.getData().id;
  }

  async onDiscoveryAvailable(discoveryResult) {
    this.address = `http://${discoveryResult.address}:${discoveryResult.port}`;
  }

  onDiscoveryAddressChanged(discoveryResult) {
    this.address = `http://${discoveryResult.address}:${discoveryResult.port}`;
  }

  async printText(text) {
    if (!this.address) {
      throw new Error('Printer Not Available');
    }

    const printer = ipp.Printer(`${this.address}/ipp/printer`);
    const printableText = this.constructor.textToPrintableText(text);

    await new Promise((resolve, reject) => {
      printer.execute('Print-Job', {
        'operation-attributes-tag': {
          'requesting-user-name': 'Homey',
          'job-name': 'Print Text',
          'document-format': 'application/octet-stream'
        },
        data: Buffer.from(printableText + '\f', 'ascii'),
      }, (err, res) => {
        if (err) return reject(err);
        return resolve(res);
      });
    });
  }

  static textToPrintableText(text, maxWidth = 80) {
    return text
      .split('\n')
      .map(line => {
        const lines = [];
        for (let i = 0; i < line.length; i += maxWidth) {
          lines.push(line.slice(i, i + maxWidth));
        }
        return lines.join('\n');
      })
      .join('\n')
      .replaceAll('\n', '\r\n');
  }

};
