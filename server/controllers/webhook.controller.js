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
       VALIDAÇÃO MÍNIMA
    ================================================= */

    if (!order_nsu) {

      console.warn(
        "Webhook recebido sem order_nsu."
      );

    }


    if (!transaction_nsu) {

      console.warn(
        "Webhook recebido sem transaction_nsu."
      );

    }


    /* =================================================
       PRÓXIMA ETAPA
    =================================================

       Aqui futuramente vamos:

       1. localizar o pedido pelo order_nsu;
       2. confirmar o pagamento;
       3. salvar transaction_nsu;
       4. salvar invoice_slug;
       5. salvar paid_amount;
       6. salvar installments;
       7. salvar capture_method;
       8. salvar receipt_url;
       9. alterar o status do pedido.

       Neste momento ainda não temos persistência
       implementada, então apenas recebemos o webhook.
    ================================================= */


    return res.sendStatus(
      200
    );


  } catch (error) {

    console.error(
      "Erro no webhook InfinitePay:",
      error
    );


    return res.sendStatus(
      400
    );

  }

}