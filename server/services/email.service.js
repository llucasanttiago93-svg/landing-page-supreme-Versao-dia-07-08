import nodemailer from "nodemailer";
import "dotenv/config";


const transporter = nodemailer.createTransport({

  host: "smtp.gmail.com",

  port: 587,

  secure: false,

  auth: {

    user: process.env.EMAIL_REMETENTE,

    pass: process.env.EMAIL_APP_PASSWORD,

  },

});


export async function enviarEmailTeste() {

  const resultado = await transporter.sendMail({

    from: `"Vanti Cosméticos" <${process.env.EMAIL_REMETENTE}>`,

    to: process.env.EMAIL_ALERTA_DESTINO,

    subject: "🚨 Teste de alerta Vanti",

    text: `
Este é um teste do sistema de alertas da Vanti Cosméticos.

O envio de e-mail pelo backend está funcionando corretamente.

Em breve, este e-mail será enviado automaticamente quando um pedido pago não conseguir ser enviado para o Bling.
    `,

  });


  console.log(
    "✅ E-mail de teste enviado:",
    resultado.messageId
  );


  

}

export async function enviarEmailErroBling({

  orderNsu,

  nome,

  email,

  telefone,

  cpf,

  valorTotal,

  erro,

}) {

  await transporter.sendMail({

    from:
      `"Vanti Cosméticos" <${process.env.EMAIL_REMETENTE}>`,

    to:
      process.env.EMAIL_ALERTA_DESTINO,

    subject:
      "🚨 PEDIDO PAGO — ERRO NO BLING",

    text: `
🚨 PEDIDO PAGO — ERRO NO BLING

O cliente realizou o pagamento, mas o pedido não conseguiu ser enviado para o Bling.

-----------------------------------

PEDIDO
Order NSU: ${orderNsu}

CLIENTE
Nome: ${nome || "Não informado"}
E-mail: ${email || "Não informado"}
Telefone: ${telefone || "Não informado"}
CPF: ${cpf || "Não informado"}

VALOR
R$ ${valorTotal || "0,00"}

ERRO DO BLING
${erro}

-----------------------------------

⚠️ O pagamento foi confirmado.

Verifique o pedido e corrija o problema no Bling.
    `,

  });

}