/* =====================================================
   PÁGINA DE PAGAMENTO CONCLUÍDO
===================================================== */


/* =====================================================
   ESCAPAR VALORES PARA HTML
===================================================== */

function escapeHtml(value) {

  return String(
    value || ""
  )
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =====================================================
   VALIDAR URL DO COMPROVANTE
===================================================== */

function getReceiptUrl(value) {

  if (!value) {
    return null;
  }


  try {

    const url =
      new URL(value);


    if (
      url.protocol !== "https:" &&
      url.protocol !== "http:"
    ) {

      return null;

    }


    return url.toString();


  } catch {

    return null;

  }

}


/* =====================================================
   PÁGINA DE PAGAMENTO CONCLUÍDO
===================================================== */

export function pagamentoConcluido(
  req,
  res
) {

  const {
    receipt_url,
    order_nsu,
    slug,
    capture_method,
    transaction_nsu,
  } = req.query;


  /* ===================================================
     DADOS RECEBIDOS
  =================================================== */

  const orderNsu =
    escapeHtml(
      order_nsu
    );


  const slugSeguro =
    escapeHtml(
      slug
    );


  const captureMethod =
    escapeHtml(
      capture_method
    );


  const transactionNsu =
    escapeHtml(
      transaction_nsu
    );


  const receiptUrl =
    getReceiptUrl(
      receipt_url
    );


  /* ===================================================
     LOG
  =================================================== */

  console.log(
    "================================="
  );

  console.log(
    "PAGAMENTO CONCLUÍDO"
  );

  console.log(
    "Order NSU:",
    order_nsu
  );

  console.log(
    "Slug:",
    slug
  );

  console.log(
    "Método:",
    capture_method
  );

  console.log(
    "Transaction NSU:",
    transaction_nsu
  );

  console.log(
    "================================="
  );


  /* ===================================================
     RESPOSTA HTML
  =================================================== */

  res.send(`

    <!DOCTYPE html>

    <html lang="pt-BR">

    <head>

      <meta charset="UTF-8">

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
      >

      <title>
        Pedido recebido - Vanti Cosméticos
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


        h1 {

          margin:
            0 0 12px;

        }


        p {

          color:
            #555555;

          line-height:
            1.6;

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


        .details {

          margin-top:
            20px;

          padding:
            16px;

          background:
            #fafafa;

          border-radius:
            10px;

          text-align:
            left;

          font-size:
            14px;

        }


        .details p {

          margin:
            8px 0;

        }


        a {

          display:
            inline-block;

          margin-top:
            24px;

          background:
            #ec7404;

          color:
            #ffffff;

          text-decoration:
            none;

          padding:
            14px 24px;

          border-radius:
            8px;

          font-weight:
            bold;

        }

      </style>

    </head>


    <body>

      <div class="box">

        <h1>
          Pedido recebido!
        </h1>


        <p>
          Obrigado pela sua compra
          na Vanti Cosméticos.
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


        <p>

          Estamos processando a
          confirmação do pagamento.

        </p>


        ${
          orderNsu ||
          slugSeguro ||
          captureMethod ||
          transactionNsu
            ? `

              <div class="details">

                ${
                  slugSeguro
                    ? `
                      <p>
                        <strong>
                          Checkout:
                        </strong>
                        ${slugSeguro}
                      </p>
                    `
                    : ""
                }


                ${
                  captureMethod
                    ? `
                      <p>
                        <strong>
                          Método:
                        </strong>
                        ${captureMethod}
                      </p>
                    `
                    : ""
                }


                ${
                  transactionNsu
                    ? `
                      <p>
                        <strong>
                          Transação:
                        </strong>
                        ${transactionNsu}
                      </p>
                    `
                    : ""
                }

              </div>

            `
            : ""
        }


        ${
          receiptUrl
            ? `

              <a
                href="${escapeHtml(receiptUrl)}"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver comprovante
              </a>

            `
            : ""
        }

      </div>

    </body>

    </html>

  `);

}