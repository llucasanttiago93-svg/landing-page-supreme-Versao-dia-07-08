import {
  checkPayment,
} from "../services/infinitePay.service.js";


/* =====================================================
   WEBHOOK INFINITEPAY
===================================================== */


/* =====================================================
   RECEBER WEBHOOK
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
       LOG PRINCIPAL
    ================================================= */

    console.log(
      "================================="
    );

    console.log(
      "WEBHOOK INFINITEPAY RECEBIDO"
    );

    console.log(
      "================================="
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
       VALIDAÇÃO DO WEBHOOK
    ================================================= */

    if (!order_nsu) {

      console.warn(
        "Webhook recebido sem order_nsu."
      );

      return res.sendStatus(
        400
      );

    }


    if (!transaction_nsu) {

      console.warn(
        "Webhook recebido sem transaction_nsu."
      );

      return res.sendStatus(
        400
      );

    }


    if (!invoice_slug) {

      console.warn(
        "Webhook recebido sem invoice_slug."
      );

      return res.sendStatus(
        400
      );

    }


    /* =================================================
       CONFIRMAR PAGAMENTO
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


    /* =================================================
       PAGAMENTO NÃO CONFIRMADO
    ================================================= */

    if (
      !payment ||
      payment.paid !== true
    ) {

      console.warn(
        "Pagamento ainda não confirmado pela InfinitePay."
      );


      console.warn(
        "Resposta:",
        payment
      );


      /*
       * O webhook foi recebido corretamente,
       * mas o pagamento não está confirmado.
       *
       * Não devemos criar pedido no Bling.
       */

      return res.sendStatus(
        200
      );

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
      "VALOR CONFIRMADO:",
      payment.amount
    );


    console.log(
      "VALOR PAGO:",
      payment.paid_amount
    );


    console.log(
      "PARCELAS:",
      payment.installments
    );


    console.log(
      "MÉTODO:",
      payment.capture_method
    );


    console.log(
      "================================="
    );


    /* =================================================
       PRÓXIMA ETAPA — BLING
    =================================================

       O pagamento foi confirmado.

       Aqui será executada a integração:

       1. localizar o pedido pelo order_nsu;
       2. recuperar os dados do cliente;
       3. recuperar endereço;
       4. recuperar produtos;
       5. criar pedido no Bling;
       6. salvar ID do pedido no Bling;
       7. impedir duplicidade;
       8. marcar pedido como enviado ao Bling.

       Essa etapa será adicionada depois que
       confirmarmos que o payment_check está funcionando.
    ================================================= */


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
      error
    );

    console.error(
      "================================="
    );


    /*
     * Retornamos 400 para que a InfinitePay
     * possa tentar enviar o webhook novamente.
     */

    return res.sendStatus(
      400
    );

  }

}