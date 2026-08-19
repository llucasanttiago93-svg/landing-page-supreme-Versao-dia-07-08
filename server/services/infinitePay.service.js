import {
  INFINITEPAY_URL,
  INFINITEPAY_HANDLE,
} from "../config/config.js";


/* =====================================================
   CRIAR CHECKOUT INFINITEPAY
===================================================== */

export async function createCheckout(
  payload
) {

  const response =
    await fetch(
      `${INFINITEPAY_URL}/links`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          "Accept":
            "application/json",
        },

        body:
          JSON.stringify(
            payload
          ),
      }
    );


  const data =
    await response.json();


  /* ===================================================
     ERRO
  =================================================== */

  if (!response.ok) {

    const error =
      new Error(
        "Erro ao criar checkout InfinitePay."
      );

    error.status =
      response.status;

    error.data =
      data;

    throw error;
  }


  /* ===================================================
     SUCESSO
  =================================================== */

  return data;

}


/* =====================================================
   CONFIRMAR PAGAMENTO INFINITEPAY
===================================================== */

export async function checkPayment({

  orderNsu,

  transactionNsu,

  slug,

}) {

  /* ===================================================
     VALIDAÇÃO
  =================================================== */

  if (!orderNsu) {

    const error =
      new Error(
        "order_nsu não informado para confirmação do pagamento."
      );

    error.status =
      400;

    throw error;
  }


  if (!transactionNsu) {

    const error =
      new Error(
        "transaction_nsu não informado para confirmação do pagamento."
      );

    error.status =
      400;

    throw error;
  }


  if (!slug) {

    const error =
      new Error(
        "slug não informado para confirmação do pagamento."
      );

    error.status =
      400;

    throw error;
  }


  /* ===================================================
     PAYLOAD
  =================================================== */

  const payload = {

    handle:
      INFINITEPAY_HANDLE,

    order_nsu:
      orderNsu,

    transaction_nsu:
      transactionNsu,

    slug:
      slug,

  };


  /* ===================================================
     LOG
  =================================================== */

  console.log(
    "================================="
  );

  console.log(
    "CONSULTANDO PAGAMENTO INFINITEPAY"
  );

  console.log(
    "ORDER NSU:",
    orderNsu
  );

  console.log(
    "TRANSACTION NSU:",
    transactionNsu
  );

  console.log(
    "SLUG:",
    slug
  );

  console.log(
    "================================="
  );


  /* ===================================================
     CONSULTAR STATUS
  =================================================== */

  const response =
    await fetch(
      `${INFINITEPAY_URL}/payment_check`,
      {

        method:
          "POST",

        headers: {

          "Content-Type":
            "application/json",

          "Accept":
            "application/json",

        },

        body:
          JSON.stringify(
            payload
          ),

      }
    );


  const data =
    await response.json();


  /* ===================================================
     ERRO
  =================================================== */

  if (!response.ok) {

    const error =
      new Error(
        "Erro ao consultar pagamento na InfinitePay."
      );

    error.status =
      response.status;

    error.data =
      data;

    throw error;
  }


  /* ===================================================
     LOG DA RESPOSTA
  =================================================== */

  console.log(
    "RESPOSTA PAYMENT_CHECK:"
  );

  console.log(
    JSON.stringify(
      data,
      null,
      2
    )
  );


  /* ===================================================
     RETORNAR RESULTADO
  =================================================== */

  return data;

}