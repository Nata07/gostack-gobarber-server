interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      email: string;
      name: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  // configurar email no SES
  defaults: {
    from: {
      email: 'equipe@smartcon.com.br',
      name: 'Equipe SmartCon',
    },
  },
} as IMailConfig;
