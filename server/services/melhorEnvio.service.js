import {
  MELHOR_ENVIO_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  CALLBACK_URL,
} from "../config/config.js";


/* =====================================================
   CONFIGURAÇÕES
===================================================== */

const USER_AGENT =
  process.env.MELHOR_ENVIO_USER_AGENT ||
  "Vanti Cosméticos";


/* =====================================================
   TOKENS
===================================================== */

let accessToken =
  process.env.MELHOR_ENVIO_ACCESS_TOKEN || null;

let refreshToken =
  process.env.MELHOR_ENVIO_REFRESH_TOKEN || null;


/* =====================================================
   GERAR URL DE AUTORIZAÇÃO
===================================================== */

export function getAuthorizationUrl() {

  const scopes = [
    "shipping-calculate",
    "ecommerce-shipping",
  ].join(" ");


  const authorizationUrl =
    `${MELHOR_ENVIO_URL}/oauth/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(
      CALLBACK_URL
    )}` +
    `&response_type=code` +
    `&state=vanti-checkout` +
    `&scope=${encodeURIComponent(scopes)}`;


  return authorizationUrl;
}


/* =====================================================
   TROCAR CÓDIGO POR TOKEN
===================================================== */

export async function authorizeWithCode(code) {

  const response =
    await fetch(
      `${MELHOR_ENVIO_URL}/oauth/token`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          "Accept":
            "application/json",

          "User-Agent":
            USER_AGENT,
        },

        body:
          JSON.stringify({

            grant_type:
              "authorization_code",

            client_id:
              CLIENT_ID,

            client_secret:
              CLIENT_SECRET,

            redirect_uri:
              CALLBACK_URL,

            code,

          }),
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
        "Erro ao solicitar token ao Melhor Envio."
      );

    error.status =
      response.status;

    error.data =
      data;

    throw error;
  }


  /* ===================================================
     SALVAR TOKENS EM MEMÓRIA
  =================================================== */

  accessToken =
    data.access_token;

  refreshToken =
    data.refresh_token;


  return data;
}


/* =====================================================
   VERIFICAR AUTORIZAÇÃO
===================================================== */

export function isAuthorized() {

  return Boolean(
    accessToken
  );

}


/* =====================================================
   CALCULAR FRETE
===================================================== */

export async function calculateShipping({
  cepDestino,
  quantidade,
}) {

  /* ===================================================
     VALIDAÇÃO DA AUTORIZAÇÃO
  =================================================== */

  if (!accessToken) {

    const error =
      new Error(
        "Melhor Envio ainda não foi autorizado."
      );

    error.status =
      401;

    error.authorizeUrl =
      "/melhor-envio/authorize";

    throw error;
  }


  /* ===================================================
     DADOS DO PRODUTO
  =================================================== */

  const peso =
    quantidade === 2
      ? 0.2
      : 0.1;


  const valorProduto =
    quantidade === 2
      ? 97
      : 57;


  /* ===================================================
     CEP DE DESTINO
  =================================================== */

  const cepDestinoLimpo =
    String(
      cepDestino || ""
    ).replace(
      /\D/g,
      ""
    );


  /* ===================================================
     PAYLOAD
  =================================================== */

  const payload = {

    from: {

      postal_code:
        process.env.ORIGIN_CEP,

    },


    to: {

      postal_code:
        cepDestinoLimpo,

    },


    products: [

      {

        id:
          "queridinho-supreme",

        width:
          12,

        height:
          5,

        length:
          17,

        weight:
          peso,

        insurance_value:
          valorProduto,

        quantity:
          1,

      },

    ],

  };


  /* ===================================================
     REQUISIÇÃO AO MELHOR ENVIO
  =================================================== */

  const response =
    await fetch(
      `${MELHOR_ENVIO_URL}/api/v2/me/shipment/calculate`,
      {

        method:
          "POST",

        headers: {

          Authorization:
            `Bearer ${accessToken}`,

          Accept:
            "application/json",

          "Content-Type":
            "application/json",

          "User-Agent":
            USER_AGENT,

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
        "Erro na cotação do Melhor Envio."
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
   EXPORTAR ESTADO DOS TOKENS
===================================================== */

export function getTokens() {

  return {

    accessToken,

    refreshToken,

  };

}