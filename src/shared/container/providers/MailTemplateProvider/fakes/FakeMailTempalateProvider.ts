import IMailTemplateProvider from '../models/IMailTemplateProvider';

export default class FakeMailTempalateProvider
  implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Mail tempplate';
  }
}
