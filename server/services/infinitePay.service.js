import {
  INFINITEPAY_URL,
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
          JSON.stringify(payload),
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