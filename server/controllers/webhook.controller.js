import {
  checkPayment,
} from "../services/infinitePay.service.js";

import pool from "../config/database.js";


/* =====================================================
   WEBHOOK INFINITEPAY
===================================================== */

export async function webhookInfinitePay(
  req,
  res
) {

  try {

    const data =
      req.body;


    /* =================================================
       DADOS DO WEBHOOK
    ================================================= */

    const {
      invoice_slug,
      amount,
      paid_amount,
      installments,
      capture_method,
      transaction_nsu,
      order_nsu,
      receipt_url,
      items,
    } = data;


    /* =================================================
       LOG
    ================================================= */

    console.log(
      "================================="
    );

    console.log(
      "WEBHOOK INFINITEPAY RECEBIDO"
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
      "INVOICE SLUG:",
      invoice_slug
    );

    console.log(
      "VALOR:",
      amount
    );

    console.log(
      "VALOR PAGO:",
      paid_amount
    );

    console.log(
      "PARCELAS:",
      installments
    );

    console.log(
      "MÉTODO:",
      capture_method
    );

    console.log(
      "COMPROVANTE:",
      receipt_url
    );

    console.log(
      "ITENS:",
      items
    );

    console.log(
      "================================="
    );


    /* =================================================
       VALIDAÇÃO
    ================================================= */

    if (!order_nsu) {

      console.warn(
        "Webhook sem order_nsu."
      );

      return res.sendStatus(400);

    }


    if (!transaction_nsu) {

      console.warn(
        "Webhook sem transaction_nsu."
      );

      return res.sendStatus(400);

    }


    if (!invoice_slug) {

      console.warn(
        "Webhook sem invoice_slug."
      );

      return res.sendStatus(400);

    }


    /* =================================================
       PROCURAR PEDIDO NO MYSQL
    ================================================= */

    console.log(
      "================================="
    );

    console.log(
      "PROCURANDO PEDIDO NO MYSQL"
    );

    console.log(
      "ORDER NSU:",
      order_nsu
    );

    console.log(
      "================================="
    );


    const [
      pedidos
    ] =
      await pool.execute(

        `
        SELECT
          id,
          order_nsu,
          status,
          valor_total,
          invoice_slug,
          transaction_nsu,
          paid_amount,
          installments,
          capture_method,
          receipt_url,
          paid_at,
          bling_order_id,
          bling_status

        FROM pedidos

        WHERE order_nsu = ?

        LIMIT 1
        `,

        [
          order_nsu
        ]

      );


    /* =================================================
       PEDIDO NÃO ENCONTRADO
    ================================================= */

    if (
      pedidos.length === 0
    ) {

      console.warn(
        "Pedido não encontrado no banco."
      );

      console.warn(
        "ORDER NSU:",
        order_nsu
      );


      /*
       * Retornamos 200 para evitar que a
       * InfinitePay fique reenviando indefinidamente
       * um pedido que não existe no nosso banco.
       */

      return res.sendStatus(200);

    }


    const pedido =
      pedidos[0];


    console.log(
      "PEDIDO ENCONTRADO:"
    );

    console.log(
      pedido
    );


    /* =================================================
       VERIFICAR SE JÁ FOI PAGO
    ================================================= */

    if (
      pedido.status === "pago" &&
      pedido.transaction_nsu
    ) {

      console.log(
        "================================="
      );

      console.log(
        "⚠️ PEDIDO JÁ PROCESSADO"
      );

      console.log(
        "ORDER NSU:",
        order_nsu
      );

      console.log(
        "TRANSACTION NSU:",
        pedido.transaction_nsu
      );

      console.log(
        "================================="
      );


      return res.sendStatus(200);

    }


    /* =================================================
       CONFIRMAR PAGAMENTO NA INFINITEPAY
    ================================================= */

    console.log(
      "================================="
    );

    console.log(
      "CONFIRMANDO PAGAMENTO"
    );

    console.log(
      "================================="
    );


    const payment =
      await checkPayment({

        orderNsu:
          order_nsu,

        transactionNsu:
          transaction_nsu,

        slug:
          invoice_slug,

      });


    console.log(
      "RESULTADO PAYMENT_CHECK:"
    );

    console.log(
      JSON.stringify(
        payment,
        null,
        2
      )
    );


    /* =================================================
       PAGAMENTO NÃO CONFIRMADO
    ================================================= */

    if (
      !payment ||
      payment.paid !== true
    ) {

      console.warn(
        "Pagamento ainda NÃO confirmado."
      );


      return res.sendStatus(200);

    }


    /* =================================================
       PAGAMENTO CONFIRMADO
    ================================================= */

    console.log(
      "================================="
    );

    console.log(
      "✅ PAGAMENTO CONFIRMADO"
    );

    console.log(
      "================================="
    );


    /* =================================================
       ATUALIZAR PEDIDO
    ================================================= */

    const valorPago =
      payment.paid_amount ??
      paid_amount ??
      null;


    const numeroParcelas =
      payment.installments ??
      installments ??
      null;


    const metodoCaptura =
      payment.capture_method ??
      capture_method ??
      null;


    const comprovante =
      payment.receipt_url ??
      receipt_url ??
      null;


    const slug =
      payment.invoice_slug ??
      invoice_slug;


    const transacao =
      payment.transaction_nsu ??
      transaction_nsu;


    await pool.execute(

      `
      UPDATE pedidos

      SET

        status = ?,

        invoice_slug = ?,

        transaction_nsu = ?,

        paid_amount = ?,

        installments = ?,

        capture_method = ?,

        receipt_url = ?,

        paid_at = NOW(),

        updated_at = NOW()

      WHERE id = ?

      LIMIT 1
      `,

      [

        "pago",

        slug,

        transacao,

        valorPago,

        numeroParcelas,

        metodoCaptura,

        comprovante,

        pedido.id

      ]

    );


    /* =================================================
       CONFIRMAR ATUALIZAÇÃO
    ================================================= */

    console.log(
      "================================="
    );

    console.log(
      "✅ PEDIDO ATUALIZADO NO MYSQL"
    );

    console.log(
      "ID:",
      pedido.id
    );

    console.log(
      "ORDER NSU:",
      order_nsu
    );

    console.log(
      "STATUS: pago"
    );

    console.log(
      "TRANSACTION NSU:",
      transacao
    );

    console.log(
      "VALOR PAGO:",
      valorPago
    );

    console.log(
      "PARCELAS:",
      numeroParcelas
    );

    console.log(
      "================================="
    );


    /* =================================================
       PRÓXIMA ETAPA
    =================================================

       Aqui futuramente entra:

       1. Buscar dados do pedido
       2. Criar pedido no Bling
       3. Salvar bling_order_id
       4. Atualizar bling_status
       5. Impedir duplicidade no Bling

    ================================================= */


    return res.sendStatus(200);


  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "❌ ERRO NO WEBHOOK INFINITEPAY"
    );

    console.error(
      "================================="
    );

    console.error(
      "Mensagem:",
      error.message
    );

    console.error(
      "Stack:",
      error.stack
    );

    console.error(
      "================================="
    );


    /*
     * 400 permite que a InfinitePay
     * tente reenviar o webhook.
     */

    return res.sendStatus(400);

  }

}