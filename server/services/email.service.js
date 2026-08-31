import nodemailer from "nodemailer";
import "dotenv/config";


/* =====================================================
   TRANSPORTER
===================================================== */

const transporter = nodemailer.createTransport({

  host: "smtp.gmail.com",

  port: 587,

  secure: false,

  auth: {

    user: process.env.EMAIL_REMETENTE,

    pass: process.env.EMAIL_APP_PASSWORD,

  },

});


/* =====================================================
   E-MAIL DE TESTE
===================================================== */

export async function enviarEmailTeste() {

  const resultado =
    await transporter.sendMail({

      from:
        `"Vanti Cosméticos" <${process.env.EMAIL_REMETENTE}>`,

      to:
        process.env.EMAIL_ALERTA_DESTINO,

      subject:
        "🚨 Teste de alerta Vanti",

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


/* =====================================================
   E-MAIL DE CONFIRMAÇÃO DO PEDIDO
===================================================== */

export async function enviarEmailPedidoConfirmado({

  nome,

  email,

  orderNsu,

  quantidade,

  valorProduto,

  valorFrete,

  valorTotal,

}) {

  /* =================================================
     VALIDAÇÃO
  ================================================= */

  if (!email) {

    console.warn(
      "⚠️ Pedido confirmado sem e-mail do cliente."
    );

    return;

  }


  /* =================================================
     FORMATAÇÃO
  ================================================= */

  const nomeCliente =
    nome ||
    "Cliente";


  const quantidadeProduto =
    quantidade || 1;


  const produto =
    quantidadeProduto === 1
      ? "Queridinho Supreme — 1 unidade"
      : `Queridinho Supreme — ${quantidadeProduto} unidades`;


  /* =================================================
     ENVIO
  ================================================= */

  const resultado =
    await transporter.sendMail({

      from:
        `"Vanti Cosméticos" <${process.env.EMAIL_REMETENTE}>`,

      to:
        email,

      replyTo:
        process.env.EMAIL_REMETENTE,

      subject:
        "✅ Pedido confirmado — Vanti Cosméticos",

      text: `

Olá, ${nomeCliente}!


Seu pedido foi confirmado com sucesso. 🎉


SEU PAGAMENTO FOI APROVADO

Recebemos o pagamento do seu pedido e já vamos dar início ao processamento.


-----------------------------------

PEDIDO

Número do pedido:
${orderNsu || "Não informado"}


PRODUTO

${produto}


VALORES

Produto: R$ ${valorProduto || "0,00"}

Frete: R$ ${valorFrete || "0,00"}

Total pago: R$ ${valorTotal || "0,00"}


-----------------------------------

Agora vamos preparar seu pedido para envio.

Você receberá novas informações conforme o pedido avançar.


Obrigado por escolher a Vanti Cosméticos.


Vanti Cosméticos
https://vanticosmeticos.com.br/

      `,

    });


  /* =================================================
     LOG
  ================================================= */

  console.log(
    "✅ E-mail de confirmação enviado ao cliente:",
    email
  );


  console.log(
    "📨 Message ID:",
    resultado.messageId
  );

}


/* =====================================================
   ALERTA DE ERRO DO BLING
===================================================== */

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