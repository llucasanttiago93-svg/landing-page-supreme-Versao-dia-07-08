import {
  MELHOR_ENVIO_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  CALLBACK_URL,
} from "../config/config.js";

import pool from "../config/database.js";


/* =====================================================
   CONFIGURAÇÕES
===================================================== */

const USER_AGENT =
  process.env.MELHOR_ENVIO_USER_AGENT ||
  "Vanti Cosméticos";


/* =====================================================
   CONTROLE DOS TOKENS
===================================================== */

let accessToken = null;

let refreshToken = null;

let tokensReady = null;


/* =====================================================
   CRIAR TABELA DE TOKENS
===================================================== */

async function ensureTokenTable() {

  await pool.execute(`

    CREATE TABLE IF NOT EXISTS melhor_envio_auth (

      id INT NOT NULL AUTO_INCREMENT,

      access_token TEXT NULL,

      refresh_token TEXT NULL,

      created_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

      PRIMARY KEY (id)

    )

  `);

}


/* =====================================================
   CARREGAR TOKENS DO MYSQL
===================================================== */

async function loadTokens() {

  try {

    await ensureTokenTable();


    const [
      rows
    ] =
      await pool.execute(`

        SELECT

          access_token,

          refresh_token

        FROM melhor_envio_auth

        ORDER BY id DESC

        LIMIT 1

      `);


    /* =================================================
       NENHUM TOKEN
    ================================================= */

    if (
      rows.length === 0
    ) {

      accessToken = null;

      refreshToken = null;


      console.log(
        "Nenhum token salvo do Melhor Envio no MySQL."
      );


      return;

    }


    /* =================================================
       CARREGAR TOKENS
    ================================================= */

    accessToken =
      rows[0].access_token ||
      null;


    refreshToken =
      rows[0].refresh_token ||
      null;


    /* =================================================
       LOG
    ================================================= */

    if (accessToken) {

      console.log(
        "================================="
      );

      console.log(
        "✅ TOKENS DO MELHOR ENVIO CARREGADOS DO MYSQL"
      );

      console.log(
        "Access Token: OK"
      );

      console.log(
        "Refresh Token:",
        refreshToken
          ? "OK"
          : "NÃO ENCONTRADO"
      );

      console.log(
        "================================="
      );

    } else {

      console.log(
        "⚠️ Registro do Melhor Envio encontrado, mas sem access token."
      );

    }


  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "❌ ERRO AO CARREGAR TOKENS DO MELHOR ENVIO"
    );

    console.error(
      "Mensagem:",
      error.message
    );

    console.error(
      "================================="
    );


    throw error;

  }

}


/* =====================================================
   INICIALIZAR CARREGAMENTO
===================================================== */

tokensReady =
  loadTokens();


/* =====================================================
   AGUARDAR CARREGAMENTO DOS TOKENS
===================================================== */

async function waitForTokens() {

  if (tokensReady) {

    await tokensReady;

  }

}


/* =====================================================
   SALVAR TOKENS NO MYSQL
===================================================== */

async function saveTokens(
  data
) {

  const novoAccessToken =
    data.accessToken ||
    null;


  const novoRefreshToken =
    data.refreshToken ||
    refreshToken ||
    null;


  /* =================================================
     VALIDAR ACCESS TOKEN
  ================================================= */

  if (!novoAccessToken) {

    throw new Error(
      "Não é possível salvar o Melhor Envio sem access token."
    );

  }


  /* =================================================
     ATUALIZAR MEMÓRIA
  ================================================= */

  accessToken =
    novoAccessToken;


  refreshToken =
    novoRefreshToken;


  /* =================================================
     GARANTIR TABELA
  ================================================= */

  await ensureTokenTable();


  /* =================================================
     VERIFICAR SE JÁ EXISTE REGISTRO
  ================================================= */

  const [
    rows
  ] =
    await pool.execute(`

      SELECT

        id

      FROM melhor_envio_auth

      ORDER BY id ASC

      LIMIT 1

    `);


  /* =================================================
     INSERIR
  ================================================= */

  if (
    rows.length === 0
  ) {

    await pool.execute(`

      INSERT INTO melhor_envio_auth (

        access_token,

        refresh_token

      )

      VALUES (?, ?)

    `, [

      accessToken,

      refreshToken

    ]);

  }


  /* =================================================
     ATUALIZAR
  ================================================= */

  else {

    await pool.execute(`

      UPDATE melhor_envio_auth

      SET

        access_token = ?,

        refresh_token = ?,

        updated_at = CURRENT_TIMESTAMP

      WHERE id = ?

    `, [

      accessToken,

      refreshToken,

      rows[0].id

    ]);

  }


  /* =================================================
     LOG
  ================================================= */

  console.log(
    "================================="
  );

  console.log(
    "✅ TOKENS DO MELHOR ENVIO SALVOS NO MYSQL"
  );

  console.log(
    "Access Token: OK"
  );

  console.log(
    "Refresh Token:",
    refreshToken
      ? "OK"
      : "NÃO ENCONTRADO"
  );

  console.log(
    "================================="
  );

}


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
   TROCAR CODE POR TOKEN
===================================================== */

export async function authorizeWithCode(
  code
) {

  if (!code) {

    const error =
      new Error(
        "Código de autorização do Melhor Envio não informado."
      );


    error.status =
      400;


    throw error;

  }


  console.log(
    "================================="
  );

  console.log(
    "🔐 TROCANDO CÓDIGO POR TOKEN"
  );

  console.log(
    "================================="
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


  /* =================================================
     ERRO
  ================================================= */

  if (!response.ok) {

    const error =
      new Error(
        "Erro ao solicitar token ao Melhor Envio."
      );


    error.status =
      response.status;


    error.data =
      data;


    console.error(
      "❌ ERRO AO OBTER TOKEN"
    );

    console.error(
      data
    );


    throw error;

  }


  /* =================================================
     VALIDAR ACCESS TOKEN
  ================================================= */

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


  /* =================================================
     SALVAR TOKENS
  ================================================= */

  await saveTokens({

    accessToken:
      data.access_token,

    refreshToken:
      data.refresh_token ||
      null,

  });


  console.log(
    "================================="
  );

  console.log(
    "✅ MELHOR ENVIO AUTORIZADO"
  );

  console.log(
    "Tokens salvos no MYSQL."
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

  await waitForTokens();


  if (!refreshToken) {

    throw new Error(
      "Refresh Token do Melhor Envio não encontrado."
    );

  }


  console.log(
    "================================="
  );

  console.log(
    "🔄 RENOVANDO TOKEN DO MELHOR ENVIO"
  );

  console.log(
    "================================="
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


  /* =================================================
     ERRO
  ================================================= */

  if (!response.ok) {

    const error =
      new Error(
        "Erro ao renovar token do Melhor Envio."
      );


    error.status =
      response.status;


    error.data =
      data;


    console.error(
      "❌ ERRO AO RENOVAR TOKEN"
    );

    console.error(
      data
    );


    throw error;

  }


  /* =================================================
     VALIDAR NOVO TOKEN
  ================================================= */

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


  /* =================================================
     SALVAR NOVOS TOKENS
  ================================================= */

  await saveTokens({

    accessToken:
      data.access_token,

    refreshToken:
      data.refresh_token ||
      refreshToken,

  });


  console.log(
    "================================="
  );

  console.log(
    "✅ TOKEN DO MELHOR ENVIO RENOVADO"
  );

  console.log(
    "================================="
  );


  return accessToken;

}


/* =====================================================
   VERIFICAR AUTORIZAÇÃO
===================================================== */

export async function isAuthorized() {

  await waitForTokens();


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

  await waitForTokens();


  /* =================================================
     VERIFICAR AUTORIZAÇÃO
  ================================================= */

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


  /* =================================================
     NORMALIZAR QUANTIDADE
  ================================================= */

  const quantidadeNumerica =
    Math.max(
      1,
      Number(
        quantidade
      ) || 1
    );


  /* =================================================
     DADOS DO PRODUTO
  ================================================= */

  /*
   * Produto:
   *
   * 12 cm largura
   * 5 cm altura
   * 17 cm comprimento
   * 100 g
   * R$ 57,00
   */

  const pesoPorUnidade =
    0.1;


  const valorPorUnidade =
    57;


  const pesoTotal =
    pesoPorUnidade *
    quantidadeNumerica;


  const valorTotal =
    valorPorUnidade *
    quantidadeNumerica;


  /* =================================================
     LIMPAR CEP
  ================================================= */

  const cepDestinoLimpo =
    String(
      cepDestino || ""
    ).replace(
      /\D/g,
      ""
    );


  /* =================================================
     VALIDAR CEP
  ================================================= */

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


  /* =================================================
     PAYLOAD
  ================================================= */

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
          pesoTotal,

        insurance_value:
          valorTotal,

        quantity:
          quantidadeNumerica,

      },

    ],

  };


  /* =================================================
     LOG DA COTAÇÃO
  ================================================= */

  console.log(
    "================================="
  );

  console.log(
    "📦 CALCULANDO FRETE — MELHOR ENVIO"
  );

  console.log(
    "================================="
  );

  console.log(
    "URL:",
    `${MELHOR_ENVIO_URL}/api/v2/me/shipment/calculate`
  );

  console.log(
    "ORIGEM:",
    process.env.ORIGIN_CEP
  );

  console.log(
    "DESTINO:",
    cepDestinoLimpo
  );

  console.log(
    "QUANTIDADE:",
    quantidadeNumerica
  );

  console.log(
    "PESO TOTAL:",
    pesoTotal,
    "kg"
  );

  console.log(
    "VALOR TOTAL:",
    valorTotal
  );

  console.log(
    "PAYLOAD ENVIADO:"
  );

  console.log(
    JSON.stringify(
      payload,
      null,
      2
    )
  );

  console.log(
    "================================="
  );


  /* =================================================
     FUNÇÃO DE COTAÇÃO
  ================================================= */

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


  /* =================================================
     PRIMEIRA TENTATIVA
  ================================================= */

  let response =
    await requestShipping();


  /* =================================================
     TOKEN EXPIRADO
  ================================================= */

  if (
    response.status === 401
  ) {

    console.log(
      "⚠️ Access Token expirado."
    );

    console.log(
      "🔄 Tentando renovar automaticamente..."
    );


    try {

      await refreshAccessToken();


      response =
        await requestShipping();


    } catch (error) {

      console.error(
        "❌ Não foi possível renovar o token."
      );

      console.error(
        "Mensagem:",
        error.message
      );

      console.error(
        "Dados:",
        error.data || null
      );


      throw error;

    }

  }


  /* =================================================
     LER RESPOSTA
  ================================================= */

  const data =
    await response.json();


  /* =================================================
     LOG DA RESPOSTA
  ================================================= */

  console.log(
    "================================="
  );

  console.log(
    "📥 RESPOSTA DO MELHOR ENVIO"
  );

  console.log(
    "STATUS HTTP:",
    response.status
  );

  console.log(
    "RESPOSTA:"
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


  /* =================================================
     ERRO HTTP
  ================================================= */

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


/* =================================================
   NORMALIZAR RESPOSTA DO MELHOR ENVIO
================================================= */

let opcoesFrete = [];

if (Array.isArray(data)) {

  opcoesFrete = data;

} else if (
  data &&
  typeof data === "object" &&
  data.custom_price != null
) {

  opcoesFrete = [
    data
  ];

}


/* =================================================
   VERIFICAR RESPOSTA VAZIA
================================================= */

if (
  opcoesFrete.length === 0
) {

  console.warn(
    "⚠️ MELHOR ENVIO NÃO RETORNOU NENHUMA OPÇÃO DE FRETE."
  );

}


    /* =================================================
     VERIFICAR OPÇÕES COM ERRO
  ================================================= */

  const opcoesValidas =
    opcoesFrete.filter(
      (item) =>
        !item.error
    );


  const opcoesComErro =
    opcoesFrete.filter(
      (item) =>
        item.error
    );


  console.log(
    "OPÇÕES VÁLIDAS:",
    opcoesValidas.length
  );


  console.log(
    "OPÇÕES COM ERRO:",
    opcoesComErro.length
  );


  if (
    opcoesComErro.length > 0
  ) {

    console.warn(
      "⚠️ SERVIÇOS COM ERRO:"
    );

    console.warn(
      JSON.stringify(
        opcoesComErro,
        null,
        2
      )
    );

  }


  if (
    opcoesValidas.length === 0 &&
    opcoesComErro.length > 0
  ) {

    console.warn(
      "⚠️ NENHUMA TRANSPORTADORA DISPONÍVEL PARA ESTE TRECHO NO AMBIENTE ATUAL."
    );

  }


  /* =================================================
     RETORNAR RESPOSTA
  ================================================= */

  return opcoesFrete;
}


/* =====================================================
   OBTER TOKENS
===================================================== */

export async function getTokens() {

  await waitForTokens();


  return {

    accessToken,

    refreshToken,

  };

}