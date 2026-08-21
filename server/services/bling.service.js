import crypto from "crypto";

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
  "https://api.bling.com.br/Api/v3";

const BLING_AUTH_URL =
  "https://www.bling.com.br/Api/v3/oauth/authorize";

/* =====================================================
   PRODUTO VANTI
===================================================== */

const BLING_PRODUTO_SKU =
  "VTRP30MLQDS";

/* =====================================================
   GERAR STATE
===================================================== */

function gerarState() {
  return crypto
    .randomBytes(32)
    .toString("hex");
}

/* =====================================================
   SALVAR STATE NO MYSQL
===================================================== */

async function salvarState(state) {

  await pool.execute(
    `
      DELETE FROM bling_oauth_state
      WHERE created_at <
        DATE_SUB(
          NOW(),
          INTERVAL 10 MINUTE
        )
    `
  );

  await pool.execute(
    `
      INSERT INTO bling_oauth_state
      (
        state
      )
      VALUES
      (
        ?
      )
    `,
    [
      state
    ]
  );
}

/* =====================================================
   VALIDAR E CONSUMIR STATE
===================================================== */

export async function validarState(state) {

  if (!state) {

    console.error(
      "❌ STATE NÃO INFORMADO."
    );

    return false;
  }

  const [
    rows
  ] =
    await pool.execute(
      `
        SELECT
          id,
          state,
          created_at
        FROM bling_oauth_state
        WHERE state = ?
        LIMIT 1
      `,
      [
        state
      ]
    );

  if (
    rows.length === 0
  ) {

    console.error(
      "================================="
    );

    console.error(
      "❌ STATE BLING INVÁLIDO"
    );

    console.error(
      "STATE RECEBIDO:",
      state
    );

    console.error(
      "================================="
    );

    return false;
  }

  const stateData =
    rows[0];

  const criadoEm =
    new Date(
      stateData.created_at
    ).getTime();

  const agora =
    Date.now();

  const dezMinutos =
    10 * 60 * 1000;

  if (
    agora -
      criadoEm >
    dezMinutos
  ) {

    console.error(
      "================================="
    );

    console.error(
      "❌ STATE BLING EXPIRADO"
    );

    console.error(
      "================================="
    );

    await pool.execute(
      `
        DELETE FROM bling_oauth_state
        WHERE id = ?
      `,
      [
        stateData.id
      ]
    );

    return false;
  }

  await pool.execute(
    `
      DELETE FROM bling_oauth_state
      WHERE id = ?
    `,
    [
      stateData.id
    ]
  );

  console.log(
    "================================="
  );

  console.log(
    "✅ STATE BLING VALIDADO"
  );

  console.log(
    "================================="
  );

  return true;
}

/* =====================================================
   GERAR URL DE AUTORIZAÇÃO
===================================================== */

export async function getAuthorizationUrl() {

  const state =
    gerarState();

  await salvarState(
    state
  );

  const params =
    new URLSearchParams({

      response_type:
        "code",

      client_id:
        BLING_CLIENT_ID,

      state:
        state,

      redirect_uri:
        BLING_REDIRECT_URI,

    });

  const authorizationUrl =
    `${BLING_AUTH_URL}?${params.toString()}`;

  console.log(
    "================================="
  );

  console.log(
    "🔐 URL DE AUTORIZAÇÃO BLING"
  );

  console.log(
    "STATE GERADO:",
    state
  );

  console.log(
    "REDIRECT URI:",
    BLING_REDIRECT_URI
  );

  console.log(
    "URL:",
    authorizationUrl
  );

  console.log(
    "================================="
  );

  return authorizationUrl;
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

          "enable-jwt":
            "1",
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

  if (
    !data.access_token ||
    !data.refresh_token
  ) {

    throw new Error(
      "Bling não retornou access_token e refresh_token."
    );
  }

  console.log(
    "================================="
  );

  console.log(
    "✅ TOKENS RECEBIDOS DO BLING"
  );

  console.log(
    "================================="
  );

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

  let expiresAt =
    null;

  if (expires_in) {

    expiresAt =
      new Date(
        Date.now() +
          Number(expires_in) *
          1000
      );
  }

  /*
   * O projeto trabalha com apenas
   * um conjunto de tokens do Bling.
   */

  await pool.execute(
    `
      DELETE FROM bling_auth
    `
  );

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

          "enable-jwt":
            "1",
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

  if (!tokens) {

    throw new Error(
      "Bling ainda não foi autorizado."
    );
  }

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
     * Renovar 1 minuto antes.
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
   FUNÇÃO AUXILIAR:
   REQUISIÇÃO À API DO BLING
===================================================== */

async function blingRequest(
  url,
  options = {}
) {

  const accessToken =
    await getAccessToken();

  const response =
    await fetch(
      url,
      {

        ...options,

        headers: {

          ...(options.headers || {}),

          "Authorization":
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",

          "Accept":
            "application/json",

          "enable-jwt":
            "1",

        },

      }
    );

  const data =
    await response.json();

  if (!response.ok) {

    console.error(
      "================================="
    );

    console.error(
      "❌ ERRO NA API DO BLING"
    );

    console.error(
      "URL:",
      url
    );

    console.error(
      "STATUS:",
      response.status
    );

    console.error(
      "RESPOSTA:",
      JSON.stringify(
        data,
        null,
        2
      )
    );

    console.error(
      "================================="
    );

    const error =
      new Error(
        "Erro na API do Bling."
      );

    error.status =
      response.status;

    error.data =
      data;

    throw error;
  }

  return data;
}

/* =====================================================
   BUSCAR PRODUTO PELO SKU
===================================================== */

export async function buscarProdutoPorSku(
  sku
) {

  if (
    !sku ||
    String(sku).trim() === ""
  ) {

    throw new Error(
      "SKU do produto não informado."
    );
  }

  const skuLimpo =
    String(
      sku
    ).trim();

  const url =
    `${BLING_API_URL}/produtos?` +
    `pagina=1&` +
    `limite=100&` +
    `codigo=${encodeURIComponent(skuLimpo)}`;

  console.log(
    "================================="
  );

  console.log(
    "🔎 PROCURANDO PRODUTO NO BLING"
  );

  console.log(
    "SKU:",
    skuLimpo
  );

  console.log(
    "================================="
  );

  const resultado =
    await blingRequest(
      url,
      {
        method:
          "GET",
      }
    );

  const produtos =
    Array.isArray(
      resultado?.data
    )
      ? resultado.data
      : [];

  if (
    produtos.length === 0
  ) {

    console.error(
      "================================="
    );

    console.error(
      "❌ PRODUTO NÃO ENCONTRADO NO BLING"
    );

    console.error(
      "SKU:",
      skuLimpo
    );

    console.error(
      "================================="
    );

    throw new Error(
      `Produto com SKU "${skuLimpo}" não encontrado no Bling.`
    );
  }

  /*
   * Como estamos filtrando pelo código,
   * pegamos o primeiro resultado.
   */

  const produto =
    produtos[0];

  console.log(
    "================================="
  );

  console.log(
    "✅ PRODUTO ENCONTRADO NO BLING"
  );

  console.log(
    "ID:",
    produto.id
  );

  console.log(
    "NOME:",
    produto.nome
  );

  console.log(
    "SKU:",
    produto.codigo
  );

  console.log(
    "PREÇO:",
    produto.preco
  );

  console.log(
    "ESTOQUE:",
    produto?.estoque?.saldoVirtualTotal
  );

  console.log(
    "================================="
  );

  return produto;
}

/* =====================================================
   BUSCAR O PRODUTO PRINCIPAL DA VANTI
===================================================== */

export async function buscarProdutoVanti() {

  return await buscarProdutoPorSku(
    BLING_PRODUTO_SKU
  );

}

/* =====================================================
   CRIAR PEDIDO DE VENDA NO BLING
===================================================== */

export async function criarPedidoVenda({

  produtoBlingId,

  quantidade,

  valorProduto,

  valorFrete,

  valorTotal,

  nome,

  email,

  telefone,

  cpf,

  cep,

  rua,

  numero,

  complemento,

  bairro,

  cidade,

  estado,

  orderNsu,

}) {

  /* ===================================================
     VALIDAÇÕES
  =================================================== */

  if (!produtoBlingId) {

    throw new Error(
      "ID do produto no Bling não informado."
    );
  }

  if (
    !quantidade ||
    Number(quantidade) <= 0
  ) {

    throw new Error(
      "Quantidade do produto inválida para o Bling."
    );
  }

  if (
    !nome ||
    String(nome).trim().length < 3
  ) {

    throw new Error(
      "Nome do cliente não informado para o Bling."
    );
  }

  /* ===================================================
     NORMALIZAR VALORES
  =================================================== */

  const quantidadeNumero =
    Number(
      quantidade
    );

  const valorProdutoNumero =
    Number(
      valorProduto
    );

  const valorFreteNumero =
    Number(
      valorFrete || 0
    );

  const valorTotalNumero =
    Number(
      valorTotal
    );

  if (
    !Number.isFinite(
      quantidadeNumero
    )
  ) {

    throw new Error(
      "Quantidade inválida para criação do pedido no Bling."
    );
  }

  if (
    !Number.isFinite(
      valorProdutoNumero
    )
  ) {

    throw new Error(
      "Valor do produto inválido para criação do pedido no Bling."
    );
  }

  if (
    !Number.isFinite(
      valorFreteNumero
    )
  ) {

    throw new Error(
      "Valor do frete inválido para criação do pedido no Bling."
    );
  }

  if (
    !Number.isFinite(
      valorTotalNumero
    )
  ) {

    throw new Error(
      "Valor total inválido para criação do pedido no Bling."
    );
  }

  /* ===================================================
     LIMPAR CPF
  =================================================== */

  const cpfLimpo =
    cpf
      ? String(cpf)
          .replace(
            /\D/g,
            ""
          )
      : "";

  /* ===================================================
     PROCURAR CLIENTE
  =================================================== */

  let contatoId =
    null;

  if (cpfLimpo) {

    const url =
      `${BLING_API_URL}/contatos?` +
      `numeroDocumento=${encodeURIComponent(cpfLimpo)}`;

    const resultadoContato =
      await blingRequest(
        url,
        {
          method:
            "GET",
        }
      );

    const contatos =
      Array.isArray(
        resultadoContato?.data
      )
        ? resultadoContato.data
        : [];

    if (
      contatos.length > 0 &&
      contatos[0]?.id
    ) {

      contatoId =
        contatos[0].id;

      console.log(
        "✅ CLIENTE ENCONTRADO NO BLING:",
        contatoId
      );
    }
  }

  /* ===================================================
     CRIAR CLIENTE
  =================================================== */

  if (!contatoId) {

    const contato = {

      nome:
        String(
          nome
        ).trim(),

      email:
        email
          ? String(
              email
            ).trim()
          : undefined,

      celular:
        telefone
          ? String(
              telefone
            ).trim()
          : undefined,

      numeroDocumento:
        cpfLimpo ||
        undefined,

      /*
       * Pessoa física.
       */

      tipo:
        "F",

      /*
       * Cliente ativo.
       */

      situacao:
        "A",

      endereco: {

        endereco:
          rua || "",

        numero:
          numero || "",

        complemento:
          complemento || "",

        bairro:
          bairro || "",

        cep:
          cep || "",

        municipio:
          cidade || "",

        uf:
          estado || "",

      },

    };

    console.log(
      "================================="
    );

    console.log(
      "👤 CRIANDO CLIENTE NO BLING"
    );

    console.log(
      JSON.stringify(
        contato,
        null,
        2
      )
    );

    console.log(
      "================================="
    );

    const resultadoCriacaoContato =
      await blingRequest(
        `${BLING_API_URL}/contatos`,
        {

          method:
            "POST",

          body:
            JSON.stringify(
              contato
            ),

        }
      );

    contatoId =
      resultadoCriacaoContato
        ?.data
        ?.id ||
      null;

    if (!contatoId) {

      throw new Error(
        "Bling não retornou o ID do cliente criado."
      );
    }

    console.log(
      "✅ CLIENTE CRIADO NO BLING:",
      contatoId
    );
  }

  /* ===================================================
     DATA
  =================================================== */

  const hoje =
    new Date()
      .toISOString()
      .slice(
        0,
        10
      );

  /* ===================================================
     OBSERVAÇÃO
  =================================================== */

  const observacaoPedido =
    orderNsu

      ? `Pedido originado no site Vanti. Order NSU: ${orderNsu}`

      : "Pedido originado no site Vanti.";

  /* ===================================================
     MONTAR PEDIDO
  =================================================== */

  const pedidoBling = {

    data:
      hoje,

    dataSaida:
      hoje,

    contato: {

      id:
        Number(
          contatoId
        ),

    },

    itens: [

      {

        quantidade:
          quantidadeNumero,

        valor:
          valorProdutoNumero /
          quantidadeNumero,

        produto: {

          id:
            Number(
              produtoBlingId
            ),

        },

      },

    ],

    observacoes:
      observacaoPedido,

    ...(valorFreteNumero > 0

      ? {

          transporte: {

            frete:
              valorFreteNumero,

          },

        }

      : {}),

  };

  /* ===================================================
     CRIAR PEDIDO
  =================================================== */

  console.log(
    "================================="
  );

  console.log(
    "📦 CRIANDO PEDIDO DE VENDA NO BLING"
  );

  console.log(
    "PRODUTO BLING ID:",
    produtoBlingId
  );

  console.log(
    "QUANTIDADE:",
    quantidadeNumero
  );

  console.log(
    "VALOR PRODUTO:",
    valorProdutoNumero
  );

  console.log(
    "VALOR FRETE:",
    valorFreteNumero
  );

  console.log(
    "VALOR TOTAL:",
    valorTotalNumero
  );

  console.log(
    "================================="
  );

  console.log(
    "BODY ENVIADO AO BLING:"
  );

  console.log(
    JSON.stringify(
      pedidoBling,
      null,
      2
    )
  );

  const resultadoPedido =
    await blingRequest(
      `${BLING_API_URL}/pedidos/vendas`,
      {

        method:
          "POST",

        body:
          JSON.stringify(
            pedidoBling
          ),

      }
    );

  const pedidoCriado =
    resultadoPedido?.data ||
    resultadoPedido;

  const blingOrderId =
    pedidoCriado?.id ||
    null;

  if (!blingOrderId) {

    throw new Error(
      "Bling não retornou o ID do pedido criado."
    );
  }

  console.log(
    "================================="
  );

  console.log(
    "✅ PEDIDO CRIADO NO BLING"
  );

  console.log(
    "CONTATO ID:",
    contatoId
  );

  console.log(
    "BLING ORDER ID:",
    blingOrderId
  );

  console.log(
    "ORDER NSU:",
    orderNsu
  );

  console.log(
    "================================="
  );

  return {

    success:
      true,

    id:
      blingOrderId,

    contatoId:
      contatoId,

    data:
      resultadoPedido,

  };

}

/* =====================================================
   TESTAR API DO BLING
===================================================== */

export async function testBlingApi() {

  console.log(
    "================================="
  );

  console.log(
    "🔎 TESTANDO PRODUTO VANTI NO BLING"
  );

  console.log(
    "SKU:",
    BLING_PRODUTO_SKU
  );

  console.log(
    "================================="
  );

  const produto =
    await buscarProdutoVanti();

  const data = {

    data: [

      produto

    ],

  };

  console.log(
    "================================="
  );

  console.log(
    "✅ API DO BLING FUNCIONANDO"
  );

  console.log(
    "PRODUTO VANTI ENCONTRADO"
  );

  console.log(
    "ID:",
    produto.id
  );

  console.log(
    "NOME:",
    produto.nome
  );

  console.log(
    "SKU:",
    produto.codigo
  );

  console.log(
    "================================="
  );

  return data;

}