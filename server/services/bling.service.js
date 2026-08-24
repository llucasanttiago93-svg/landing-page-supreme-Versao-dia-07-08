import crypto from "crypto";

import {
  BLING_CLIENT_ID,
  BLING_CLIENT_SECRET,
  BLING_REDIRECT_URI,
} from "../config/config.js";

import pool from "../config/database.js";

/* =====================================================
   CONFIGURAÇÕES
===================================================== */

const BLING_API_URL =
  "https://api.bling.com.br/Api/v3";

const BLING_AUTH_URL =
  "https://www.bling.com.br/Api/v3/oauth/authorize";

/*
 * Mapeamento dos produtos:
 *
 * 1 unidade -> BLING_PRODUCT_ID_1
 * 2 unidades -> BLING_PRODUCT_ID_2
 *
 * Esses IDs devem ser os IDs REAIS dos produtos
 * cadastrados no Bling.
 */

const BLING_PRODUCT_ID_1 =
  process.env.BLING_PRODUCT_ID_1 || "";

const BLING_PRODUCT_ID_2 =
  process.env.BLING_PRODUCT_ID_2 || "";

/* =====================================================
   UTILITÁRIOS
===================================================== */

function gerarState() {
  return crypto
    .randomBytes(32)
    .toString("hex");
}

function limparCpf(valor) {
  return valor
    ? String(valor).replace(/\D/g, "")
    : "";
}

function limparCep(valor) {
  return valor
    ? String(valor).replace(/\D/g, "")
    : "";
}

function numeroValido(valor) {
  const numero = Number(valor);

  return Number.isFinite(numero)
    ? numero
    : null;
}

function valorMonetario(valor) {
  const numero = Number(valor);

  if (!Number.isFinite(numero) || numero < 0) {
    return null;
  }

  return Number(numero.toFixed(2));
}

/* =====================================================
   STATE OAUTH
===================================================== */

async function salvarState(state) {
  await pool.execute(
    `
      DELETE FROM bling_oauth_state
      WHERE created_at <
        DATE_SUB(NOW(), INTERVAL 10 MINUTE)
    `
  );

  await pool.execute(
    `
      INSERT INTO bling_oauth_state
      (state)
      VALUES (?)
    `,
    [state]
  );
}

export async function validarState(state) {
  if (!state) {
    console.error(
      "❌ STATE BLING NÃO INFORMADO."
    );

    return false;
  }

  const [rows] =
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
      [state]
    );

  if (!rows.length) {
    console.error(
      "❌ STATE BLING INVÁLIDO."
    );

    return false;
  }

  const stateData =
    rows[0];

  const criadoEm =
    new Date(
      stateData.created_at
    ).getTime();

  const expirado =
    Date.now() - criadoEm >
    10 * 60 * 1000;

  if (expirado) {
    await pool.execute(
      `
        DELETE FROM bling_oauth_state
        WHERE id = ?
      `,
      [stateData.id]
    );

    console.error(
      "❌ STATE BLING EXPIRADO."
    );

    return false;
  }

  await pool.execute(
    `
      DELETE FROM bling_oauth_state
      WHERE id = ?
    `,
    [stateData.id]
  );

  console.log(
    "✅ STATE BLING VALIDADO."
  );

  return true;
}

/* =====================================================
   AUTORIZAÇÃO
===================================================== */

export async function getAuthorizationUrl() {
  if (!BLING_CLIENT_ID) {
    throw new Error(
      "BLING_CLIENT_ID não configurado."
    );
  }

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

      state,
    });

  const authorizationUrl =
    `${BLING_AUTH_URL}?${params.toString()}`;

  console.log(
    "🔐 URL DE AUTORIZAÇÃO BLING:"
  );

  console.log(
    authorizationUrl
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
          Authorization:
            `Basic ${credentials}`,

          "Content-Type":
            "application/x-www-form-urlencoded",

          Accept:
            "application/json",

          "enable-jwt":
            "1",
        },

        body:
          new URLSearchParams({
            grant_type:
              "authorization_code",

            code,
          }).toString(),
      }
    );

  const data =
    await response.json();

  if (!response.ok) {
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
    "✅ TOKENS RECEBIDOS DO BLING."
  );

  return data;
}

/* =====================================================
   SALVAR TOKENS
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

  const expiresAt =
    expires_in
      ? new Date(
        Date.now() +
        Number(expires_in) *
        1000
      )
      : null;

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
      VALUES (?, ?, ?)
    `,
    [
      access_token,
      refresh_token,
      expiresAt,
    ]
  );

  console.log(
    "✅ TOKENS DO BLING SALVOS NO MYSQL."
  );

  return {
    success:
      true,

    expiresAt,
  };
}

/* =====================================================
   LER TOKENS
===================================================== */

export async function getTokens() {
  const [rows] =
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

  if (!rows.length) {
    return null;
  }

  return rows[0];
}

/* =====================================================
   RENOVAR TOKEN
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
          Authorization:
            `Basic ${credentials}`,

          "Content-Type":
            "application/x-www-form-urlencoded",

          Accept:
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
   ACCESS TOKEN VÁLIDO
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
    const expiracao =
      new Date(
        tokens.expires_at
      ).getTime();

    if (
      Date.now() >=
      expiracao -
      60 * 1000
    ) {
      console.log(
        "🔄 TOKEN BLING EXPIRANDO. RENOVANDO..."
      );

      const novosTokens =
        await refreshAccessToken(
          tokens.refresh_token
        );

      return novosTokens
        .access_token;
    }
  }

  return tokens.access_token;
}

/* =====================================================
   REQUISIÇÃO PADRÃO BLING
===================================================== */

async function blingRequest(
  accessToken,
  url,
  options = {}
) {
  const response =
    await fetch(
      url,
      {
        ...options,

        headers: {
          ...(options.headers || {}),

          Authorization:
            `Bearer ${accessToken}`,

          "Content-Type":
            "application/json",

          Accept:
            "application/json",

          "enable-jwt":
            "1",
        },
      }
    );

  const text =
    await response.text();

  let data = {};

  try {
    data =
      text
        ? JSON.parse(text)
        : {};
  } catch {
    data = {
      raw:
        text,
    };
  }

  if (!response.ok) {
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
   ESCOLHER PRODUTO BLING PELA QUANTIDADE
===================================================== */

function resolverProdutoBlingId(
  quantidade,
  produtoBlingIdInformado
) {
  /*
   * Se o chamador informar explicitamente um ID,
   * ele tem prioridade.
   */

  if (
    produtoBlingIdInformado
  ) {
    return String(
      produtoBlingIdInformado
    );
  }

  const quantidadeNumero =
    Number(quantidade);

  if (
    quantidadeNumero === 1
  ) {
    if (
      !BLING_PRODUCT_ID_1
    ) {
      throw new Error(
        "BLING_PRODUCT_ID_1 não configurado."
      );
    }

    return BLING_PRODUCT_ID_1;
  }

  if (
    quantidadeNumero === 2
  ) {
    if (
      !BLING_PRODUCT_ID_2
    ) {
      throw new Error(
        "BLING_PRODUCT_ID_2 não configurado."
      );
    }

    return BLING_PRODUCT_ID_2;
  }

  throw new Error(
    `Não existe produto Bling configurado para ${quantidadeNumero} unidades.`
  );
}

/* =====================================================
   CRIAR / ATUALIZAR CONTATO
===================================================== */

async function obterOuAtualizarContato({
  accessToken,
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
}) {
  const cpfLimpo =
    limparCpf(cpf);

  let contatoId =
    null;

  /* ===================================================
     PROCURAR PELO CPF
  =================================================== */

  if (
    cpfLimpo
  ) {
    const resultado =
      await blingRequest(
        accessToken,

        `${BLING_API_URL}/contatos?numeroDocumento=${encodeURIComponent(cpfLimpo)}`,

        {
          method:
            "GET",
        }
      );

    const contatos =
      Array.isArray(
        resultado?.data
      )
        ? resultado.data
        : [];

    if (
      contatos.length &&
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
     ENDEREÇO
  =================================================== */

  const endereco = {
    endereco:
      rua || "",

    numero:
      numero || "",

    complemento:
      complemento || "",

    bairro:
      bairro || "",

    cep:
      limparCep(cep),

    municipio:
      cidade || "",

    uf:
      estado || "",
  };

  /* ===================================================
     ATUALIZAR CLIENTE EXISTENTE
  =================================================== */

  if (
    contatoId
  ) {
    const contatoAtualizado = {
      nome:
        String(nome).trim(),

      email:
        email
          ? String(email).trim()
          : undefined,

      celular:
        telefone
          ? String(telefone).trim()
          : undefined,

      numeroDocumento:
        cpfLimpo ||
        undefined,

      tipo:
        "F",

      endereco,
    };

    await blingRequest(
      accessToken,

      `${BLING_API_URL}/contatos/${contatoId}`,

      {
        method:
          "PUT",

        body:
          JSON.stringify(
            contatoAtualizado
          ),
      }
    );

    console.log(
      "✅ CLIENTE ATUALIZADO NO BLING."
    );

    return contatoId;
  }

  /* ===================================================
     CRIAR NOVO CLIENTE
  =================================================== */

  const novoContato = {
    nome:
      String(nome).trim(),

    email:
      email
        ? String(email).trim()
        : undefined,

    celular:
      telefone
        ? String(telefone).trim()
        : undefined,

    numeroDocumento:
      cpfLimpo ||
      undefined,

    tipo:
      "F",

    endereco,
  };

  const resultado =
    await blingRequest(
      accessToken,

      `${BLING_API_URL}/contatos`,

      {
        method:
          "POST",

        body:
          JSON.stringify(
            novoContato
          ),
      }
    );

  contatoId =
    resultado?.data?.id ||
    null;

  if (
    !contatoId
  ) {
    throw new Error(
      "Bling não retornou o ID do contato criado."
    );
  }

  console.log(
    "✅ CLIENTE CRIADO NO BLING:",
    contatoId
  );

  return contatoId;
}

/* =====================================================
   CRIAR PEDIDO DE VENDA
===================================================== */

/*
 * produtoBlingId:
 *
 * Se vier informado pelo chamador,
 * ele será utilizado.
 *
 * Caso contrário:
 *
 * quantidade 1 -> BLING_PRODUCT_ID_1
 * quantidade 2 -> BLING_PRODUCT_ID_2
 */

export async function criarPedidoVenda({
  produtoBlingId,

  quantidade,

  valorProduto,

  valorFrete = 0,

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

  referencia,

  orderNsu,
}) {
  /* ===================================================
     QUANTIDADE
  =================================================== */

  const quantidadeNumero =
    numeroValido(
      quantidade
    );

  if (
    !quantidadeNumero ||
    quantidadeNumero <= 0 ||
    !Number.isInteger(
      quantidadeNumero
    )
  ) {
    throw new Error(
      "Quantidade do produto inválida."
    );
  }

  /* ===================================================
     NOME
  =================================================== */

  if (
    !nome ||
    String(nome).trim().length < 3
  ) {
    throw new Error(
      "Nome do cliente não informado."
    );
  }

  /* ===================================================
     VALORES
  =================================================== */

  const valorProdutoNumero =
    valorMonetario(
      valorProduto
    );

  const valorFreteNumero =
    valorMonetario(
      valorFrete
    );

  const valorTotalNumero =
    valorMonetario(
      valorTotal
    );

  if (
    valorProdutoNumero === null
  ) {
    throw new Error(
      "Valor do produto no pedido é inválido."
    );
  }

  if (
    valorFreteNumero === null
  ) {
    throw new Error(
      "Valor do frete no pedido é inválido."
    );
  }

  if (
    valorTotalNumero === null
  ) {
    throw new Error(
      "Valor total do pedido é inválido."
    );
  }

  /* ===================================================
     PRODUTO BLING
  =================================================== */

  const produtoId =
    resolverProdutoBlingId(
      quantidadeNumero,
      produtoBlingId
    );

  /* ===================================================
     ACCESS TOKEN
  =================================================== */

  const accessToken =
    await getAccessToken();

  /* ===================================================
     CLIENTE
  =================================================== */

  const contatoId =
    await obterOuAtualizarContato({
      accessToken,

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
    });

  /* ===================================================
     VALOR UNITÁRIO
  =================================================== */

  /*
   * Exemplo:
   *
   * quantidade = 1
   * valorProduto = 30
   *
   * item.valor = 30
   *
   * ----------------
   *
   * quantidade = 2
   * valorProduto = 55
   *
   * item.valor = 27.50
   *
   * Portanto, aqui o valorProduto representa
   * o valor TOTAL dos produtos.
   */

  const valorUnitario =
    Number(
      (
        valorProdutoNumero /
        quantidadeNumero
      ).toFixed(2)
    );

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
     OBSERVAÇÕES
  =================================================== */

  const observacoes = [
    "Pedido originado no site Vanti.",

    orderNsu
      ? `Order NSU: ${orderNsu}`
      : null,

    referencia
      ? `Referência: ${String(referencia).trim()}`
      : null,
  ]
    .filter(Boolean)
    .join(" ");

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
        Number(contatoId),
    },

    itens: [
      {
        quantidade:
          quantidadeNumero,

        valor:
          valorUnitario,

        produto: {
          id:
            Number(produtoId),
        },
      },
    ],

    observacoes,

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
     LOG
  =================================================== */

  console.log(
    "================================="
  );

  console.log(
    "📦 CRIANDO PEDIDO DE VENDA NO BLING"
  );

  console.log(
    "PRODUTO BLING:",
    produtoId
  );

  console.log(
    "QUANTIDADE:",
    quantidadeNumero
  );

  console.log(
    "VALOR DOS PRODUTOS:",
    valorProdutoNumero
  );

  console.log(
    "VALOR UNITÁRIO:",
    valorUnitario
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
    "CONTATO ID:",
    contatoId
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

  /* ===================================================
     CRIAR PEDIDO
  =================================================== */

  const resultadoPedido =
    await blingRequest(
      accessToken,

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

  /* ===================================================
     ID DO PEDIDO
  =================================================== */

  const pedidoCriado =
    resultadoPedido?.data ||
    resultadoPedido;

  const blingOrderId =
    pedidoCriado?.id ||
    null;

  if (
    !blingOrderId
  ) {
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
    "BLING ORDER ID:",
    blingOrderId
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

    produtoBlingId:
      produtoId,

    quantidade:
      quantidadeNumero,

    valorProduto:
      valorProdutoNumero,

    valorUnitario,

    valorFrete:
      valorFreteNumero,

    valorTotal:
      valorTotalNumero,

    data:
      resultadoPedido,
  };
}

/* =====================================================
   BUSCAR PRODUTO VANTI PELO SKU
===================================================== */

export async function buscarProdutoVanti(
  sku
) {

  const SKU =
    sku
      ? String(sku).trim()
      : "VTRP30MLQDS";

  if (!SKU) {

    throw new Error(
      "SKU do produto Vanti não informado."
    );

  }

  console.log(
    "================================="
  );

  console.log(
    "🔎 BUSCANDO PRODUTO VANTI NO BLING"
  );

  console.log(
    "SKU:",
    SKU
  );

  console.log(
    "================================="
  );


  /* ===================================================
     ACCESS TOKEN
  =================================================== */

  const accessToken =
    await getAccessToken();


  /* ===================================================
     CONSULTAR PRODUTO PELO SKU
  =================================================== */

  const url =
    `${BLING_API_URL}/produtos?codigo=${encodeURIComponent(SKU)}`;


  console.log(
    "URL:",
    url
  );


  const resultado =
    await blingRequest(
      accessToken,
      url,
      {
        method: "GET",
      }
    );


  console.log(
    "RESPOSTA DA BUSCA DO PRODUTO:"
  );

  console.log(
    JSON.stringify(
      resultado,
      null,
      2
    )
  );


  /* ===================================================
     EXTRAIR PRODUTO
  =================================================== */

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
      "❌ PRODUTO NÃO ENCONTRADO NO BLING"
    );

    console.error(
      "SKU:",
      SKU
    );

    return null;

  }


  const produto =
    produtos[0];


  /* ===================================================
     VALIDAR PRODUTO
  =================================================== */

  if (
    !produto?.id
  ) {

    throw new Error(
      `Bling encontrou o SKU ${SKU}, mas não retornou o ID do produto.`
    );

  }


  console.log(
    "================================="
  );

  console.log(
    "✅ PRODUTO VANTI ENCONTRADO"
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
    "PREÇO CADASTRADO NO BLING:",
    produto.preco
  );

  console.log(
    "================================="
  );


  return produto;

}

/* =====================================================
   TESTAR API DO BLING
===================================================== */

export async function testBlingApi() {
  const accessToken =
    await getAccessToken();

  const data =
    await blingRequest(
      accessToken,

      `${BLING_API_URL}/produtos?limite=1`,

      {
        method:
          "GET",
      }
    );

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

/* =====================================================
   EXPORTAÇÃO
===================================================== */

export {
  resolverProdutoBlingId,
};