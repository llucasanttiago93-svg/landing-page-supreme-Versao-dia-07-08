import {
  BLING_CLIENT_ID,
  BLING_CLIENT_SECRET,
  BLING_REDIRECT_URI,
} from "../config/config.js";

import pool from "../config/database.js";


/* =====================================================
   CONFIGURAÇÕES DA API BLING
===================================================== */

const BLING_API_URL =
  "https://www.bling.com.br/Api/v3";


/* =====================================================
   GERAR URL DE AUTORIZAÇÃO
===================================================== */

export function getAuthorizationUrl() {

  const params =
    new URLSearchParams({

      response_type:
        "code",

      client_id:
        BLING_CLIENT_ID,

      redirect_uri:
        BLING_REDIRECT_URI,

    });


  return (
    `${BLING_API_URL}/oauth/authorize?` +
    params.toString()
  );

}


/* =====================================================
   TROCAR CODE POR TOKENS
===================================================== */

export async function exchangeCodeForToken(
  code
) {

  if (!code) {

    throw new Error(
      "Código de autorização do Bling não informado."
    );

  }


  const credentials =
    Buffer
      .from(
        `${BLING_CLIENT_ID}:${BLING_CLIENT_SECRET}`
      )
      .toString("base64");


  const response =
    await fetch(
      `${BLING_API_URL}/oauth/token`,
      {

        method:
          "POST",

        headers: {

          "Authorization":
            `Basic ${credentials}`,

          "Content-Type":
            "application/x-www-form-urlencoded",

          "Accept":
            "application/json",

        },

        body:
          new URLSearchParams({

            grant_type:
              "authorization_code",

            code:
              code,

          }).toString(),

      }
    );


  const data =
    await response.json();


  /* ===================================================
     ERRO
  =================================================== */

  if (!response.ok) {

    console.error(
      "================================="
    );

    console.error(
      "❌ ERRO AO OBTER TOKENS DO BLING"
    );

    console.error(
      "STATUS:",
      response.status
    );

    console.error(
      "RESPOSTA:",
      data
    );

    console.error(
      "================================="
    );


    const error =
      new Error(
        "Erro ao obter tokens do Bling."
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
    !data.access_token ||
    !data.refresh_token
  ) {

    throw new Error(
      "Bling não retornou access_token e refresh_token."
    );

  }


  return data;

}


/* =====================================================
   SALVAR TOKENS NO MYSQL
===================================================== */

export async function saveTokens(
  data
) {

  const {

    access_token,
    refresh_token,
    expires_in,

  } = data;


  if (
    !access_token ||
    !refresh_token
  ) {

    throw new Error(
      "Tokens do Bling inválidos."
    );

  }


  /* ===================================================
     CALCULAR EXPIRAÇÃO
  =================================================== */

  let expiresAt =
    null;


  if (expires_in) {

    expiresAt =
      new Date(
        Date.now() +
        Number(expires_in) * 1000
      );

  }


  /* ===================================================
     APAGAR TOKEN ANTERIOR
  =================================================== */

  await pool.execute(
    `
      DELETE FROM bling_auth
    `
  );


  /* ===================================================
     SALVAR NOVOS TOKENS
  =================================================== */

  await pool.execute(

    `
      INSERT INTO bling_auth
      (
        access_token,
        refresh_token,
        expires_at
      )

      VALUES
      (
        ?,
        ?,
        ?
      )
    `,

    [

      access_token,

      refresh_token,

      expiresAt,

    ]

  );


  console.log(
    "================================="
  );

  console.log(
    "✅ TOKENS DO BLING SALVOS"
  );

  console.log(
    "EXPIRA EM:",
    expiresAt
  );

  console.log(
    "================================="
  );


  return {

    success:
      true,

    expiresAt,

  };

}


/* =====================================================
   PEGAR TOKENS SALVOS
===================================================== */

export async function getTokens() {

  const [
    rows
  ] =
    await pool.execute(

      `
        SELECT
          id,
          access_token,
          refresh_token,
          expires_at,
          updated_at

        FROM bling_auth

        ORDER BY id DESC

        LIMIT 1
      `

    );


  if (
    rows.length === 0
  ) {

    return null;

  }


  return rows[0];

}


/* =====================================================
   RENOVAR ACCESS TOKEN
===================================================== */

export async function refreshAccessToken(
  refreshToken
) {

  if (!refreshToken) {

    throw new Error(
      "Refresh token do Bling não informado."
    );

  }


  const credentials =
    Buffer
      .from(
        `${BLING_CLIENT_ID}:${BLING_CLIENT_SECRET}`
      )
      .toString("base64");


  const response =
    await fetch(
      `${BLING_API_URL}/oauth/token`,
      {

        method:
          "POST",

        headers: {

          "Authorization":
            `Basic ${credentials}`,

          "Content-Type":
            "application/x-www-form-urlencoded",

          "Accept":
            "application/json",

        },

        body:
          new URLSearchParams({

            grant_type:
              "refresh_token",

            refresh_token:
              refreshToken,

          }).toString(),

      }
    );


  const data =
    await response.json();


  /* ===================================================
     ERRO
  =================================================== */

  if (!response.ok) {

    console.error(
      "================================="
    );

    console.error(
      "❌ ERRO AO RENOVAR TOKEN BLING"
    );

    console.error(
      "STATUS:",
      response.status
    );

    console.error(
      "RESPOSTA:",
      data
    );

    console.error(
      "================================="
    );


    const error =
      new Error(
        "Erro ao renovar token do Bling."
      );

    error.status =
      response.status;

    error.data =
      data;

    throw error;

  }


  /* ===================================================
     SALVAR NOVOS TOKENS
  =================================================== */

  await saveTokens(
    data
  );


  return data;

}


/* =====================================================
   PEGAR ACCESS TOKEN VÁLIDO
===================================================== */

export async function getAccessToken() {

  const tokens =
    await getTokens();


  /* ===================================================
     AINDA NÃO AUTORIZADO
  =================================================== */

  if (!tokens) {

    throw new Error(
      "Bling ainda não foi autorizado."
    );

  }


  /* ===================================================
     VERIFICAR EXPIRAÇÃO
  =================================================== */

  if (
    tokens.expires_at
  ) {

    const agora =
      Date.now();


    const expiracao =
      new Date(
        tokens.expires_at
      ).getTime();


    /*
     * Renovamos 1 minuto antes
     * da expiração.
     */

    const margem =
      60 * 1000;


    if (
      agora >=
      expiracao - margem
    ) {

      console.log(
        "Token Bling expirado ou próximo de expirar."
      );

      console.log(
        "Renovando..."
      );


      const novosTokens =
        await refreshAccessToken(
          tokens.refresh_token
        );


      return novosTokens.access_token;

    }

  }


  return tokens.access_token;

}


/* =====================================================
   TESTAR API DO BLING
===================================================== */

export async function testBlingApi() {

  const accessToken =
    await getAccessToken();


  const response =
    await fetch(
      `${BLING_API_URL}/produtos?limite=1`,
      {

        method:
          "GET",

        headers: {

          "Authorization":
            `Bearer ${accessToken}`,

          "Accept":
            "application/json",

        },

      }
    );


  const data =
    await response.json();


  /* ===================================================
     ERRO
  =================================================== */

  if (!response.ok) {

    console.error(
      "================================="
    );

    console.error(
      "❌ ERRO AO TESTAR API BLING"
    );

    console.error(
      "STATUS:",
      response.status
    );

    console.error(
      "RESPOSTA:",
      data
    );

    console.error(
      "================================="
    );


    const error =
      new Error(
        "Erro ao consultar API do Bling."
      );

    error.status =
      response.status;

    error.data =
      data;

    throw error;

  }


  console.log(
    "================================="
  );

  console.log(
    "✅ API DO BLING FUNCIONANDO"
  );

  console.log(
    JSON.stringify(
      data,
      null,
      2
    )
  );

  console.log(
    "================================="
  );


  return data;

}