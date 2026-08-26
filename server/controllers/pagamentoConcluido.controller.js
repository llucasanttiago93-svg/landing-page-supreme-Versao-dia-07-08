/* =====================================================
   PÁGINA DE PAGAMENTO CONCLUÍDO
===================================================== */


/* =====================================================
   SERVIÇO DE PROCESSAMENTO DO PEDIDO PAGO
===================================================== */

import {
  processarPedidoPago,
} from "../services/processarPedidoPago.service.js";


/* =====================================================
   ESCAPAR VALORES PARA HTML
===================================================== */

function escapeHtml(
  value
) {

  return String(
    value || ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


/* =====================================================
   PÁGINA DE PAGAMENTO CONCLUÍDO
===================================================== */

export async function pagamentoConcluido(
  req,
  res
) {


  /* ===================================================
     DADOS RECEBIDOS DA INFINITEPAY
  =================================================== */

  const {
    order_nsu,
    transaction_nsu,
    slug,
  } = req.query;


  /* ===================================================
     DADOS PARA HTML
  =================================================== */

  const orderNsu =
    escapeHtml(
      order_nsu
    );


  /* ===================================================
     LOG
  =================================================== */

  console.log(
    "================================="
  );

  console.log(
    "PÁGINA DE PAGAMENTO CONCLUÍDO"
  );

  console.log(
    "ORDER NSU:",
    order_nsu
  );

  console.log(
    "TRANSACTION NSU:",
    transaction_nsu
  );

  console.log(
    "SLUG:",
    slug
  );

  console.log(
    "================================="
  );


  /* ===================================================
     PROCESSAR PEDIDO
  =================================================== */

  let resultado = null;
  let erroProcessamento = null;


  try {

    resultado =
      await processarPedidoPago({

        orderNsu:
          order_nsu,

        transactionNsu:
          transaction_nsu,

        invoiceSlug:
          slug,

      });


    console.log(
      "================================="
    );

    console.log(
      "✅ REDIRECT PROCESSADO"
    );

    console.log(
      "ORDER NSU:",
      order_nsu
    );

    console.log(
      "RESULTADO:",
      resultado
    );

    console.log(
      "================================="
    );


  } catch (error) {

    erroProcessamento = error;

    console.error(
      "================================="
    );

    console.error(
      "❌ ERRO AO PROCESSAR PEDIDO PELO REDIRECT"
    );

    console.error(
      "ORDER NSU:",
      order_nsu
    );

    console.error(
      "ERRO:",
      error?.message ||
      error
    );

    console.error(
      "STACK:",
      error?.stack
    );

    console.error(
      "================================="
    );

  }


  /* ===================================================
     RESPOSTA HTML
  =================================================== */

  const pagamentoConfirmado =
    !erroProcessamento &&
    (
      resultado?.paid === true ||
      resultado?.alreadyProcessed === true ||
      resultado?.processing === true
    );

  const pagamentoPendente =
    !erroProcessamento &&
    resultado?.paid !== true &&
    resultado?.alreadyProcessed !== true &&
    resultado?.processing !== true;

  const titulo =
    pagamentoConfirmado
      ? "Compra aprovada - Vanti Cosméticos"
      : pagamentoPendente
        ? "Pagamento em confirmação - Vanti Cosméticos"
        : "Pagamento em processamento - Vanti Cosméticos";

  const cabecalho =
    pagamentoConfirmado
      ? "Tudo certo com sua compra!"
      : pagamentoPendente
        ? "Estamos confirmando seu pagamento"
        : "Estamos processando seu pedido";

  const mensagemPrincipal =
    pagamentoConfirmado
      ? "Seu pagamento foi aprovado com sucesso."
      : pagamentoPendente
        ? "Ainda não conseguimos confirmar o pagamento. Aguarde alguns instantes e não faça um novo pagamento."
        : "Seu pagamento foi recebido e estamos finalizando o processamento do pedido.";

  const mensagemSecundaria =
    pagamentoConfirmado
      ? "Seu pedido foi recebido pela Vanti Cosméticos e já está sendo preparado."
      : pagamentoPendente
        ? "Assim que a confirmação for concluída, seu pedido será processado normalmente."
        : "Não é necessário realizar outro pagamento. O pedido continuará sendo processado automaticamente.";

  return res.send(`

    <!DOCTYPE html>

    <html lang="pt-BR">

    <head>

      <meta charset="UTF-8">

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      >

      <title>
        ${titulo}
      </title>


      <style>

        * {
          box-sizing: border-box;
        }


        body {

          font-family:
            Arial,
            sans-serif;

          background:
            #f8f8f8;

          margin:
            0;

          padding:
            40px 20px;

          text-align:
            center;

          color:
            #111111;

        }


        .box {

          max-width:
            520px;

          margin:
            60px auto;

          background:
            #ffffff;

          padding:
            40px;

          border-radius:
            16px;

          box-shadow:
            0 10px 40px
            rgba(0, 0, 0, 0.08);

        }


        .check {

          width:
            64px;

          height:
            64px;

          margin:
            0 auto 24px;

          border-radius:
            50%;

          background:
            #ec7404;

          color:
            #ffffff;

          display:
            flex;

          align-items:
            center;

          justify-content:
            center;

          font-size:
            32px;

          font-weight:
            bold;

        }


        h1 {

          margin:
            0 0 12px;

          font-size:
            30px;

        }


        p {

          color:
            #555555;

          line-height:
            1.6;

          margin:
            8px 0;

        }


        .order {

          margin-top:
            24px;

          padding:
            16px;

          background:
            #f5f5f5;

          border-radius:
            10px;

          font-size:
            14px;

          word-break:
            break-word;

        }


        .message {

          margin-top:
            20px;

        }


        a {

          display:
            inline-block;

          margin-top:
            28px;

          background:
            #ec7404;

          color:
            #ffffff;

          text-decoration:
            none;

          padding:
            14px 28px;

          border-radius:
            8px;

          font-weight:
            bold;

        }


        a:hover {

          opacity:
            0.9;

        }

      </style>

    </head>


    <body>


      <div class="box">


        <div class="check">

          ✓

        </div>


        <h1>

          ${cabecalho}

        </h1>


        <p>

          ${mensagemPrincipal}

        </p>


        ${
          orderNsu
            ? `

              <div class="order">

                Pedido:

                <strong>
                  ${orderNsu}
                </strong>

              </div>

            `
            : ""
        }


        <div class="message">

          <p>

            ${mensagemSecundaria}

          </p>

        </div>


        ${
          pagamentoConfirmado
            ? `
              <a
                href="https://vanticosmeticos.com.br/"
              >

                🛍️ Descubra mais produtos Vanti

              </a>
            `
            : ""
        }


      </div>


    </body>

    </html>

  `);

}