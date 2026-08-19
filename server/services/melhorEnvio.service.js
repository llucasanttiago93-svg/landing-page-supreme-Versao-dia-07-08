import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import {
  MELHOR_ENVIO_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  CALLBACK_URL,
} from "../config/config.js";


/* =====================================================
   CAMINHO DO ARQUIVO DE TOKENS
===================================================== */

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const tokensDirectory =
  path.resolve(
    __dirname,
    "../../data"
  );

const tokensFile =
  path.join(
    tokensDirectory,
    "melhor-envio-tokens.json"
  );


/* =====================================================
   CONFIGURAÇÕES
===================================================== */

const USER_AGENT =
  process.env.MELHOR_ENVIO_USER_AGENT ||
  "Vanti Cosméticos";


/* =====================================================
   TOKENS
===================================================== */

let accessToken = null;

let refreshToken = null;


/* =====================================================
   CARREGAR TOKENS SALVOS
===================================================== */

function loadTokens() {

  try {

    if (
      !fs.existsSync(
        tokensFile
      )
    ) {

      console.log(
        "Nenhum token salvo do Melhor Envio."
      );

      return;

    }


    const file =
      fs.readFileSync(
        tokensFile,
        "utf-8"
      );


    const data =
      JSON.parse(
        file
      );


    accessToken =
      data.accessToken ||
      null;


    refreshToken =
      data.refreshToken ||
      null;


    if (accessToken) {

      console.log(
        "✅ Tokens do Melhor Envio carregados."
      );

    } else {

      console.log(
        "⚠️ Arquivo de tokens encontrado, mas sem access token."
      );

    }

  } catch (error) {

    console.error(
      "Erro ao carregar tokens do Melhor Envio:",
      error
    );

  }

}


/* =====================================================
   SALVAR TOKENS
===================================================== */

function saveTokens(
  data
) {

  try {

    fs.mkdirSync(
      tokensDirectory,
      {
        recursive: true,
      }
    );


    fs.writeFileSync(

      tokensFile,

      JSON.stringify(

        {
          accessToken:
            data.accessToken,

          refreshToken:
            data.refreshToken,

          savedAt:
            new Date().toISOString(),

        },

        null,

        2

      ),

      "utf-8"

    );


    console.log(
      "✅ Tokens do Melhor Envio salvos."
    );

  } catch (error) {

    console.error(
      "❌ Erro ao salvar tokens do Melhor Envio:",
      error
    );

    throw error;

  }

}


/* =====================================================
   CARREGAR TOKENS AO INICIAR O MÓDULO
===================================================== */

loadTokens();


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

    `&scope=${encodeURIComponent(
      scopes
    )}`;


  return authorizationUrl;

}


/* =====================================================
   TROCAR CÓDIGO POR TOKEN
===================================================== */

export async function authorizeWithCode(
  code
) {

  const response =
    await fetch(

      `${MELHOR_ENVIO_URL}/oauth/token`,

      {

        method:
          "POST",

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
     VALIDAR RESPOSTA
  =================================================== */

  if (
    !data.access_token
  ) {

    const error =
      new Error(
        "O Melhor Envio não retornou um access_token."
      );


    error.status =
      500;


    error.data =
      data;


    throw error;

  }


  /* ===================================================
     ATUALIZAR TOKENS EM MEMÓRIA
  =================================================== */

  accessToken =
    data.access_token;


  refreshToken =
    data.refresh_token ||
    refreshToken;


  /* ===================================================
     SALVAR TOKENS NO DISCO
  =================================================== */

  saveTokens({

    accessToken,

    refreshToken,

  });


  console.log(
    "================================="
  );

  console.log(
    "✅ MELHOR ENVIO AUTORIZADO"
  );

  console.log(
    "Access Token salvo."
  );

  console.log(
    "Refresh Token salvo."
  );

  console.log(
    "================================="
  );


  return data;

}


/* =====================================================
   RENOVAR ACCESS TOKEN
===================================================== */

async function refreshAccessToken() {

  if (!refreshToken) {

    throw new Error(
      "Refresh Token do Melhor Envio não encontrado."
    );

  }


  console.log(
    "🔄 Renovando token do Melhor Envio..."
  );


  const response =
    await fetch(

      `${MELHOR_ENVIO_URL}/oauth/token`,

      {

        method:
          "POST",

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
              "refresh_token",

            client_id:
              CLIENT_ID,

            client_secret:
              CLIENT_SECRET,

            refresh_token:
              refreshToken,

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
        "Erro ao renovar token do Melhor Envio."
      );


    error.status =
      response.status;


    error.data =
      data;


    throw error;

  }


  /* ===================================================
     VALIDAR RESPOSTA
  =================================================== */

  if (
    !data.access_token
  ) {

    const error =
      new Error(
        "O Melhor Envio não retornou um novo access_token."
      );


    error.status =
      500;


    error.data =
      data;


    throw error;

  }


  /* ===================================================
     ATUALIZAR TOKENS
  =================================================== */

  accessToken =
    data.access_token;


  refreshToken =
    data.refresh_token ||
    refreshToken;


  /* ===================================================
     SALVAR NOVOS TOKENS
  =================================================== */

  saveTokens({

    accessToken,

    refreshToken,

  });


  console.log(
    "✅ Token do Melhor Envio renovado."
  );


  return accessToken;

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
     VERIFICAR AUTORIZAÇÃO
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


  if (
    cepDestinoLimpo.length !== 8
  ) {

    const error =
      new Error(
        "CEP de destino inválido."
      );


    error.status =
      400;


    throw error;

  }


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
     FUNÇÃO PARA FAZER A COTAÇÃO
  =================================================== */

  async function requestShipping() {

    return fetch(

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

  }


  /* ===================================================
     PRIMEIRA TENTATIVA
  =================================================== */

  let response =
    await requestShipping();


  /* ===================================================
     TOKEN EXPIRADO
  =================================================== */

  if (
    response.status === 401
  ) {

    console.log(
      "⚠️ Access Token expirado. Tentando renovar..."
    );


    try {

      await refreshAccessToken();


      response =
        await requestShipping();

    } catch (error) {

      console.error(
        "❌ Não foi possível renovar o token:",
        error.data || error
      );


      throw error;

    }

  }


  /* ===================================================
     RESPOSTA
  =================================================== */

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