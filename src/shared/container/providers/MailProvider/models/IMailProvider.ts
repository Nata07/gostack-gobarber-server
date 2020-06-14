import IMailSendDTO from '../dtos/ISendMailDTO';

export default interface IMailProvider {
  sendEmail(data: IMailSendDTO): Promise<void>;
}
