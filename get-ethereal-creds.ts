import * as nodemailer from 'nodemailer';

async function getEtherealCredentials() {
  console.log('Iniciando a geração de conta Ethereal...');
  try {
    let testAccount = await nodemailer.createTestAccount();

    console.log('--- SUAS CREDENCIAIS ETHEREAL ---');
    console.log('User:', testAccount.user);
    console.log('Pass:', testAccount.pass);
    console.log('---------------------------------');
    console.log('COPIE ESTAS CREDENCIAIS E USE-AS NO SEU main.ts E user.service.ts');
  } catch (error) {
    console.error('Erro DETECTADO ao gerar conta Ethereal:', error);
    if (error instanceof Error) {
      console.error('Nome do erro:', error.name);
      console.error('Mensagem do erro:', error.message);
      console.error('Stack do erro:', error.stack);
    }
  } finally {
    console.log('Finalizando a execução do script.');
  }
}

getEtherealCredentials();