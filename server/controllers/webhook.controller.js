import {
  processarPedidoPago,
} from "../services/processarPedidoPago.service.js";


/* =====================================================
   WEBHOOK INFINITEPAY
===================================================== */

export async function webhookInfinitePay(
  req,
  res
) {

  console.log(
    "================================="
  );

  console.log(
    "🚨 WEBHOOK CHEGOU NO SERVIDOR"
  );

  console.log(
    "BODY RECEBIDO:",
    req.body
  );

  console.log(
    "================================="
  );


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
    } =
      data;


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
        "❌ WEBHOOK SEM order_nsu"
      );

      return res.sendStatus(
        400
      );

    }


    if (!transaction_nsu) {

      console.warn(
        "❌ WEBHOOK SEM transaction_nsu"
      );

      return res.sendStatus(
        400
      );

    }


    if (!invoice_slug) {

      console.warn(
        "❌ WEBHOOK SEM invoice_slug"
      );

      return res.sendStatus(
        400
      );

    }


    /* =================================================
       PROCESSAR PEDIDO
    ================================================= */

    const resultado =
      await processarPedidoPago({

        orderNsu:
          order_nsu,

        transactionNsu:
          transaction_nsu,

        invoiceSlug:
          invoice_slug,

        amount:
          amount,

        paidAmount:
          paid_amount,

        installments:
          installments,

        captureMethod:
          capture_method,

        receiptUrl:
          receipt_url,

        items:
          items,

      });


    /* =================================================
       RESULTADO
    ================================================= */

    console.log(
      "================================="
    );

    console.log(
      "✅ PROCESSAMENTO DO PEDIDO FINALIZADO"
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


    /*
     * Respondemos 200 mesmo quando:
     *
     * - pagamento ainda não foi confirmado;
     * - pedido já foi processado;
     * - pedido já está sendo processado.
     *
     * Isso evita reenvios desnecessários
     * da InfinitePay.
     */

    return res.sendStatus(
      200
    );


  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "❌ ERRO NO WEBHOOK INFINITEPAY"
    );

    console.error(
      "MENSAGEM:",
      error?.message
    );

    console.error(
      "STATUS:",
      error?.status
    );

    console.error(
      "DADOS:",
      error?.data
    );

    console.error(
      "STACK:",
      error?.stack
    );

    console.error(
      "================================="
    );


    /*
     * Aqui retornamos 500.
     *
     * Se o processamento falhar,
     * queremos permitir que a InfinitePay
     * possa reenviar o webhook.
     */

    return res.sendStatus(
      500
    );

  }

}