import crypto from "crypto";


import {
  BLING_CLIENT_ID,
  BLING_CLIENT_SECRET,
  BLING_REDIRECT_URI,
} from "../config/config.js";


import pool from "../config/database.js";


/*
router.get(
  "/testar-logisticas",
  async (req, res) => {

    try {

      const resultado =
        await testarLogisticas();

      res.json(
        resultado
      );

    } catch (error) {

      console.error(
        "❌ ERRO AO CONSULTAR LOGÍSTICAS DO BLING"
      );

      console.error(
        error.response?.data ||
        error.message ||
        error
      );


      res
        .status(
          error.response?.status || 500
        )
        .json(
          error.response?.data || {
            error:
              error.message ||
              "Erro ao consultar logísticas.",
          }
        );

    }

  }
);*/


/* =====================================================
   CONFIGURAÇÕES DA API BLING
===================================================== */

const BLING_API_URL =
  "https://api.bling.com.br/Api/v3";


const BLING_AUTH_URL =
  "https://www.bling.com.br/Api/v3/oauth/authorize";


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

async function salvarState(
  state
) {

  /*
   * Remove states antigos.
   *
   * O state de autorização tem vida curta.
   * Mantemos somente estados recentes no banco.
   */

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


  /*
   * Salva o novo state.
   */

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

export async function validarState(
  state
) {

  if (!state) {

    console.error(
      "❌ STATE NÃO INFORMADO."
    );

    return false;

  }


  /*
   * Procurar exatamente o state
   * que foi gerado antes do login.
   */

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


  /*
   * State não existe.
   */

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


  /*
   * Validar se o state ainda está
   * dentro do período permitido.
   *
   * 10 minutos.
   */

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


    /*
     * Apagar state expirado.
     */

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


  /*
   * State é válido.
   *
   * Agora consumimos o state para impedir
   * que ele seja utilizado novamente.
   */

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

  /*
   * Gerar novo state aleatório.
   */

  const state =
    gerarState();


  /*
   * Salvar state no MySQL
   * antes de enviar o usuário para o Bling.
   */

  await salvarState(
    state
  );


  /*
   * Montar parâmetros OAuth.
   *
   * Segundo a documentação do Bling:
   *
   * response_type = code
   * client_id = ID do aplicativo
   * state = sequência aleatória
   *
   * redirect_uri não é necessário aqui,
   * pois já está cadastrado no aplicativo.
   */

  const params =
    new URLSearchParams({

      response_type:
        "code",

      client_id:
        BLING_CLIENT_ID,

      state:
        state,

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
    "STATE GERADO:"
  );

  console.log(
    state
  );

  console.log(
    "URL:"
  );

  console.log(
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


  const expiresAt =
    expires_in
      ? new Date(
        Date.now() +
        Number(expires_in) *
        1000
      )
      : null;


  /*
   * Manter apenas um conjunto de tokens.
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
    "✅ TOKENS DO BLING SALVOS NO MYSQL."
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
   LER TOKENS
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
      "❌ ERRO AO RENOVAR TOKEN DO BLING"
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
   OBTER ACCESS TOKEN VÁLIDO
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


    /*
     * Renovar 1 minuto antes
     * da expiração.
     */

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
   REQUISIÇÃO PADRÃO PARA API BLING
===================================================== */

async function blingRequest(
  accessToken,
  url,
  options = {}
) {

  const maxTentativas = 3;

  for (
    let tentativa = 1;
    tentativa <= maxTentativas;
    tentativa++
  ) {

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


    /*
     * =====================================================
     * RATE LIMIT — 429
     * =====================================================
     */

    if (
      response.status === 429
    ) {

      console.warn(
        `⚠️ BLING RATE LIMIT (429) — tentativa ${tentativa}/${maxTentativas}`
      );


      if (
        tentativa < maxTentativas
      ) {

        /*
         * Tempo informado pelo Bling,
         * caso exista.
         */

        const retryAfter =
          response.headers.get(
            "Retry-After"
          );


        let espera =
          retryAfter
            ? Number(retryAfter) * 1000
            : tentativa * 3000;


        /*
         * Segurança para não esperar
         * um tempo absurdo.
         */

        if (
          !Number.isFinite(
            espera
          )
        ) {

          espera =
            tentativa * 3000;

        }


        espera =
          Math.min(
            espera,
            15000
          );


        console.log(
          `⏳ Aguardando ${espera / 1000}s antes de tentar novamente...`
        );


        await new Promise(
          resolve =>
            setTimeout(
              resolve,
              espera
            )
        );


        continue;

      }


      /*
       * Esgotou as tentativas.
       */

      const error =
        new Error(
          "Bling está temporariamente indisponível por excesso de requisições (429)."
        );


      error.status =
        429;


      error.data =
        data;


      throw error;

    }


    /*
     * =====================================================
     * OUTROS ERROS
     * =====================================================
     */

    if (
      !response.ok
    ) {

      console.error(
        "================================="
      );

      console.error(
        "❌ ERRO NA API DO BLING"
      );

      console.error(
        "STATUS:",
        response.status
      );

      console.error(
        "URL:",
        url
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
          "Erro na API do Bling."
        );


      error.status =
        response.status;


      error.data =
        data;


      throw error;

    }


    /*
     * =====================================================
     * SUCESSO
     * =====================================================
     */

    return data;

  }

}

/* =====================================================
   ESCOLHER PRODUTO BLING PELA QUANTIDADE
===================================================== */

function resolverProdutoBlingId(
  quantidade,
  produtoBlingIdInformado
) {

  /*
   * Se o chamador informar explicitamente
   * um ID, ele tem prioridade.
   */

  if (
    produtoBlingIdInformado
  ) {

    return String(
      produtoBlingIdInformado
    );

  }


  const quantidadeNumero =
    Number(
      quantidade
    );


  /*
   * 1 UNIDADE
   */

  if (
    quantidadeNumero === 1
  ) {

    if (
      !process.env.BLING_PRODUCT_ID_1
    ) {

      throw new Error(
        "BLING_PRODUCT_ID_1 não configurado."
      );

    }


    return String(
      process.env.BLING_PRODUCT_ID_1
    );

  }


  /*
   * 2 UNIDADES
   */

  if (
    quantidadeNumero === 2
  ) {

    if (
      !process.env.BLING_PRODUCT_ID_2
    ) {

      throw new Error(
        "BLING_PRODUCT_ID_2 não configurado."
      );

    }


    return String(
      process.env.BLING_PRODUCT_ID_2
    );

  }


  throw new Error(
    `Não existe produto Bling configurado para ${quantidadeNumero} unidades.`
  );

}


/* =====================================================
   UTILITÁRIO — CPF
===================================================== */

function limparCpf(
  valor
) {

  return valor
    ? String(valor)
      .replace(
        /\D/g,
        ""
      )
    : "";

}


/* =====================================================
   UTILITÁRIO — CEP
===================================================== */

function limparCep(
  valor
) {

  return valor
    ? String(valor)
      .replace(
        /\D/g,
        ""
      )
    : "";

}


/* =====================================================
   UTILITÁRIO — NÚMERO
===================================================== */

function numeroValido(
  valor
) {

  const numero =
    Number(
      valor
    );


  return Number.isFinite(
    numero
  )
    ? numero
    : null;

}


/* =====================================================
   UTILITÁRIO — VALOR MONETÁRIO
===================================================== */

function valorMonetario(
  valor
) {

  const numero =
    Number(
      valor
    );


  if (
    !Number.isFinite(numero) ||
    numero < 0
  ) {

    return null;

  }


  return Number(
    numero.toFixed(2)
  );

}


/* =====================================================
   FINAL DA PARTE 1
===================================================== */

/* =====================================================
   BUSCAR PRODUTO VANTI NO BLING
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


  const accessToken =
    await getAccessToken();


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


  const params =
    new URLSearchParams({

      codigo:
        SKU,

    });


  const data =
    await blingRequest(

      accessToken,

      `${BLING_API_URL}/produtos?${params.toString()}`,

      {
        method:
          "GET",
      }

    );


  const produtos =
    Array.isArray(
      data?.data
    )
      ? data.data
      : [];


  if (
    produtos.length === 0
  ) {

    throw new Error(
      `Produto Vanti não encontrado no Bling pelo SKU: ${SKU}`
    );

  }


  const produto =
    produtos[0];


  console.log(
    "================================="
  );

  console.log(
    "✅ PRODUTO VANTI ENCONTRADO"
  );

  console.log(
    JSON.stringify(
      produto,
      null,
      2
    )
  );

  console.log(
    "================================="
  );


  return produto;

}


/* =====================================================
   OBTER OU ATUALIZAR CONTATO NO BLING
===================================================== */

export async function obterOuAtualizarContato({

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

  const accessToken =
    await getAccessToken();


  const cpfLimpo =
    limparCpf(
      cpf
    );


  /*
   * Endereço geral do contato.
   *
   * IMPORTANTE:
   * o Bling utiliza "endereco.geral"
   * para o endereço principal do contato.
   */

  const enderecoGeral = {

    endereco:
      rua
        ? String(rua).trim()
        : "",

    numero:
      numero !== undefined &&
        numero !== null &&
        String(numero).trim() !== ""
        ? String(numero).trim()
        : "",

    complemento:
      complemento
        ? String(complemento).trim()
        : "",

    bairro:
      bairro
        ? String(bairro).trim()
        : "",

    cep:
      limparCep(
        cep
      ),

    municipio:
      cidade
        ? String(cidade).trim()
        : "",

    uf:
      estado
        ? String(estado).trim()
        : "",

  };


  console.log(
    "================================="
  );

  console.log(
    "📍 DADOS DO ENDEREÇO DO CONTATO"
  );

  console.log(
    "Rua:",
    enderecoGeral.endereco
  );

  console.log(
    "Número:",
    enderecoGeral.numero
  );

  console.log(
    "Complemento:",
    enderecoGeral.complemento
  );

  console.log(
    "Bairro:",
    enderecoGeral.bairro
  );

  console.log(
    "CEP:",
    enderecoGeral.cep
  );

  console.log(
    "Cidade:",
    enderecoGeral.municipio
  );

  console.log(
    "UF:",
    enderecoGeral.uf
  );

  console.log(
    "================================="
  );


  /*
   * Procurar contato existente.
   *
   * Primeiro pelo CPF.
   */

  let contatoExistente =
    null;


  if (
    cpfLimpo
  ) {

    const params =
      new URLSearchParams({

        numeroDocumento:
          cpfLimpo,

      });


    const resultado =
      await blingRequest(

        accessToken,

        `${BLING_API_URL}/contatos?${params.toString()}`,

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
      contatos.length > 0
    ) {

      contatoExistente =
        contatos[0];

    }

  }


  /*
   * Se não encontrou pelo CPF,
   * procurar pelo e-mail.
   */

  if (
    !contatoExistente &&
    email
  ) {

    const params =
      new URLSearchParams({

        email:
          String(
            email
          ).trim(),

      });


    const resultado =
      await blingRequest(

        accessToken,

        `${BLING_API_URL}/contatos?${params.toString()}`,

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
      contatos.length > 0
    ) {

      contatoExistente =
        contatos[0];

    }

  }


  /* ===================================================
     ATUALIZAR CONTATO EXISTENTE
  =================================================== */

  if (
    contatoExistente?.id
  ) {

    const contatoId =
      Number(
        contatoExistente.id
      );


    const contatoAtualizado = {

      id:
        contatoId,

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

      tipo:
        "F",

      situacao:
        "A",

      endereco: {

        geral:
          enderecoGeral,

      },

    };


    console.log(
      "================================="
    );

    console.log(
      "🔄 ATUALIZANDO CLIENTE EXISTENTE NO BLING"
    );

    console.log(
      "ID DO CONTATO:",
      contatoId
    );

    console.log(
      "NÚMERO DA CASA:",
      enderecoGeral.numero
    );

    console.log(
      "BODY COMPLETO:"
    );

    console.log(
      JSON.stringify(
        contatoAtualizado,
        null,
        2
      )
    );

    console.log(
      "================================="
    );


    const resultadoAtualizacao =
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
      "================================="
    );

    console.log(
      "✅ CLIENTE ATUALIZADO NO BLING"
    );

    console.log(
      "ID:",
      contatoId
    );

    console.log(
      "NÚMERO ENVIADO:",
      enderecoGeral.numero
    );

    console.log(
      "RESPOSTA DO BLING:"
    );

    console.log(
      JSON.stringify(
        resultadoAtualizacao,
        null,
        2
      )
    );

    console.log(
      "================================="
    );


    return {

      id:
        contatoId,

      contato:
        resultadoAtualizacao?.data ||
        resultadoAtualizacao ||
        contatoAtualizado,

      novo:
        false,

    };

  }


  /* ===================================================
     CRIAR NOVO CONTATO
  =================================================== */

  const novoContato = {

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

    tipo:
      "F",

    situacao:
      "A",

    endereco: {

      geral:
        enderecoGeral,

    },

  };


  console.log(
    "================================="
  );

  console.log(
    "🆕 CRIANDO NOVO CLIENTE NO BLING"
  );

  console.log(
    "NÚMERO DA CASA:",
    enderecoGeral.numero
  );

  console.log(
    "BODY COMPLETO:"
  );

  console.log(
    JSON.stringify(
      novoContato,
      null,
      2
    )
  );

  console.log(
    "================================="
  );


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


  const contatoCriado =
    resultado?.data ||
    resultado;


  const contatoId =
    contatoCriado?.id;


  if (
    !contatoId
  ) {

    throw new Error(
      "Bling criou o contato, mas não retornou o ID."
    );

  }


  console.log(
    "================================="
  );

  console.log(
    "✅ NOVO CLIENTE CRIADO NO BLING"
  );

  console.log(
    "ID:",
    contatoId
  );

  console.log(
    "NÚMERO ENVIADO:",
    enderecoGeral.numero
  );

  console.log(
    "================================="
  );


  return {

    id:
      Number(
        contatoId
      ),

    contato:
      contatoCriado,

    novo:
      true,

  };

}


/* =====================================================
   CRIAR PEDIDO DE VENDA NO BLING
===================================================== */

export async function criarPedidoVenda({

  orderNsu,

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

  quantidade,

  valorUnitario,

  valorTotal,

  valorFrete,

  shippingId,

  shippingName,

  shippingCompany,

  shippingDeliveryTime,

  referencia,

  produtoBlingId,

  sku,

}) {

  const accessToken =
    await getAccessToken();


  const quantidadeNumero =
    Number(
      quantidade
    );


  if (
    !Number.isFinite(
      quantidadeNumero
    ) ||
    quantidadeNumero <= 0
  ) {

    throw new Error(
      "Quantidade do pedido inválida."
    );

  }


  const valorUnitarioNumero =
    valorMonetario(
      valorUnitario !== undefined &&
        valorUnitario !== null
        ? valorUnitario
        : valorTotal
    );


  if (
    valorUnitarioNumero === null
  ) {

    throw new Error(
      "Valor unitário do pedido inválido."
    );

  }


  const valorTotalNumero =
    valorMonetario(
      valorTotal
    );


  const valorFreteNumero =
    valorMonetario(
      valorFrete
    ) || 0;


  /*
   * Resolver o produto do Bling.
   *
   * A regra atual é:
   *
   * 1 unidade -> produto 1
   * 2 unidades -> produto 2
   *
   * Se um ID for informado explicitamente,
   * ele tem prioridade.
   */

  const produtoId =
    resolverProdutoBlingId(

      quantidadeNumero,

      produtoBlingId

    );


  console.log(
    "================================="
  );

  console.log(
    "🛒 PREPARANDO PEDIDO PARA O BLING"
  );

  console.log(
    "Order NSU:",
    orderNsu
  );

  console.log(
    "Quantidade:",
    quantidadeNumero
  );

  console.log(
    "Valor unitário:",
    valorUnitarioNumero
  );

  console.log(
    "Valor total:",
    valorTotalNumero
  );

  console.log(
    "Frete:",
    valorFreteNumero
  );

  console.log(
    "SKU:",
    sku
  );

  console.log(
    "Produto Bling ID:",
    produtoId
  );

  console.log(
    "Número:",
    numero
  );

  console.log(
    "Referência:",
    referencia
  );

  console.log(
    "================================="
  );


  /* ===================================================
     CONTATO BLING
  =================================================== */

  const contato =
    await obterOuAtualizarContato({

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


  const contatoId =
    contato.id;


  if (
    !contatoId
  ) {

    throw new Error(
      "Não foi possível obter o ID do contato no Bling."
    );

  }


  /* ===================================================
     OBSERVAÇÕES
  =================================================== */

  const observacoesArray = [];


  if (
    orderNsu
  ) {

    observacoesArray.push(
      `Pedido Vanti: ${String(orderNsu).trim()}`
    );

  }


  if (
    referencia
  ) {

    observacoesArray.push(
      `Referência: ${String(referencia).trim()}`
    );

  }


  const observacoes =
    observacoesArray.length > 0
      ? observacoesArray.join(
        " | "
      )
      : undefined;


  /* ===================================================
    PEDIDO BLING
 =================================================== */

  const hoje =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone: "America/Sao_Paulo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).format(
      new Date()
    );


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
          valorUnitarioNumero,

        produto: {

          id:
            Number(
              produtoId
            ),

        },

      },

    ],

    observacoes,

    transporte: {

      fretePorConta:
        0,

      frete:
        valorFreteNumero,

      quantidadeVolumes:
        1,

      pesoBruto:
        0.1,

      prazoEntrega:
        shippingDeliveryTime !== undefined &&
          shippingDeliveryTime !== null
          ? Number(
            shippingDeliveryTime
          )
          : 0,

      contato: {

        id:
          0,

        nome:
          String(
            shippingName || ""
          ).trim(),

      },

      etiqueta: {

        nome:
          String(
            nome || ""
          ).trim(),

        endereco:
          String(
            rua || ""
          ).trim(),

        numero:
          numero !== undefined &&
            numero !== null
            ? String(
              numero
            ).trim()
            : "",

        complemento:
          String(
            complemento || ""
          ).trim(),

        municipio:
          String(
            cidade || ""
          ).trim(),

        uf:
          String(
            estado || ""
          ).trim(),

        cep:
          limparCep(
            cep
          ),

        bairro:
          String(
            bairro || ""
          ).trim(),

        nomePais:
          "Brasil",

      },

      volumes: [

        {

          servico:
            "",

          codigoRastreamento:
            "",

        }

      ],

    },

  };

  /* ===================================================
     LOG DO BODY
  =================================================== */

  console.log(
    "================================="
  );

  console.log(
    "📦 BODY ENVIADO AO BLING:"
  );

  console.log(
    JSON.stringify(
      pedidoBling,
      null,
      2
    )
  );

  console.log(
    "================================="
  );


  /* ===================================================
     CRIAR PEDIDO
  =================================================== */

  const resultado =
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


  console.log(
    "================================="
  );

  console.log(
    "✅ PEDIDO CRIADO NO BLING"
  );

  console.log(
    JSON.stringify(
      resultado,
      null,
      2
    )
  );

  console.log(
    "================================="
  );


  const pedidoCriado =
    resultado?.data ||
    resultado;


  return {

    success:
      true,

    blingOrderId:
      pedidoCriado?.id ||
      null,

    pedido:
      pedidoCriado,

    contatoId:
      Number(
        contatoId
      ),

    produtoId:
      Number(
        produtoId
      ),

  };

}


/* =====================================================
   FINAL DA PARTE 2
===================================================== */

/* =====================================================
   FINAL DO ARQUIVO
===================================================== */


/* =====================================================
   TESTAR API DO BLING
===================================================== */

export async function testBlingApi() {

  const accessToken =
    await getAccessToken();


  const params =
    new URLSearchParams({

      limite:
        "1",

    });


  const resultado =
    await blingRequest(

      accessToken,

      `${BLING_API_URL}/produtos?${params.toString()}`,

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
      resultado,
      null,
      2
    )
  );

  console.log(
    "================================="
  );


  return resultado;

}

/* =====================================================
   TESTAR PEDIDO DE VENDA ESPECÍFICO
===================================================== */

export async function testarPedidoVenda() {

  const accessToken =
    await getAccessToken();

  const pedidoId =
    "26698998182";

  console.log(
    "================================="
  );

  console.log(
    "🔎 CONSULTANDO PEDIDO MANUAL NO BLING"
  );

  console.log(
    "ID:",
    pedidoId
  );

  console.log(
    "================================="
  );


  const resultado =
    await blingRequest(

      accessToken,

      `${BLING_API_URL}/pedidos/vendas/${pedidoId}`,

      {
        method:
          "GET",
      }

    );


  console.log(
    "================================="
  );

  console.log(
    "✅ PEDIDO MANUAL RETORNADO PELO BLING"
  );

  console.log(
    JSON.stringify(
      resultado,
      null,
      2
    )
  );

  console.log(
    "================================="
  );


  return resultado;

}


/* =====================================================
   EXPORTAÇÕES
===================================================== */

export default {

  getAuthorizationUrl,

  validarState,

  exchangeCodeForToken,

  saveTokens,

  getTokens,

  refreshAccessToken,

  getAccessToken,

  buscarProdutoVanti,

  obterOuAtualizarContato,

  criarPedidoVenda,

  testBlingApi,

};

/* =====================================================
   TESTAR LOGÍSTICAS DO BLING
===================================================== */

export async function testarLogisticas() {

  console.log(
    "================================="
  );

  console.log(
    "🚚 CONSULTANDO LOGÍSTICAS DO BLING"
  );

  console.log(
    "================================="
  );


  const accessToken =
    await getAccessToken();


  const resultado =
    await blingRequest(

      accessToken,

      `${BLING_API_URL}/logisticas`,

      {
        method:
          "GET",
      }

    );


  console.log(
    "================================="
  );

  console.log(
    "✅ LOGÍSTICAS RETORNADAS PELO BLING"
  );

  console.log(
    JSON.stringify(
      resultado,
      null,
      2
    )
  );

  console.log(
    "================================="
  );


  return resultado;

}


/* =====================================================
   TESTAR UMA LOGÍSTICA ESPECÍFICA DO BLING
===================================================== */

export async function testarLogisticaDetalhada() {

  console.log(
    "================================="
  );

  console.log(
    "🚚 CONSULTANDO LOGÍSTICA BLING"
  );

  console.log(
    "ID: 1150802"
  );

  console.log(
    "================================="
  );


  const accessToken =
    await getAccessToken();


  const resultado =
    await blingRequest(

      accessToken,

      `${BLING_API_URL}/logisticas/1150802`,

      {
        method:
          "GET",
      }

    );


  console.log(
    "================================="
  );

  console.log(
    "✅ LOGÍSTICA DETALHADA RETORNADA"
  );

  console.log(
    JSON.stringify(
      resultado,
      null,
      2
    )
  );

  console.log(
    "================================="
  );


  return resultado;

}