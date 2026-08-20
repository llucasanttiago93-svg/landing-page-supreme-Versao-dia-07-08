import {
  INFINITEPAY_HANDLE,
  PAYMENT_SUCCESS_URL,
  INFINITEPAY_WEBHOOK_URL,
} from "../config/config.js";

import {
  createCheckout,
} from "./infinitePay.service.js";

import pool from "../config/database.js";


/* =====================================================
   MODO DE TESTE TEMPORÁRIO
===================================================== */

/*
 * TRUE = teste de R$ 1,00 total
 *
 * Produto = R$ 1,00
 * Frete   = R$ 0,00
 * Total   = R$ 1,00
 *
 * IMPORTANTE:
 * No modo de teste, o frete NÃO será enviado
 * como item para a InfinitePay.
 *
 * Depois do teste:
 * alterar para FALSE.
 */

const TEST_PAYMENT_MODE = true;


/* =====================================================
   CRIAR PAGAMENTO
===================================================== */

export async function criarPagamento({
  quantidade,
  frete,
  cliente,
  endereco,
}) {

  /* ===================================================
     VALIDAÇÃO DA QUANTIDADE
  =================================================== */

  if (![1, 2].includes(quantidade)) {

    const error =
      new Error(
        "Quantidade de produtos inválida."
      );

    error.status = 400;

    throw error;
  }


  /* ===================================================
     VALIDAÇÃO DO FRETE
  =================================================== */

  if (
    typeof frete !== "number" ||
    !Number.isFinite(frete) ||
    frete < 0
  ) {

    const error =
      new Error(
        "Valor do frete inválido."
      );

    error.status = 400;

    throw error;
  }


  /* ===================================================
     VALIDAÇÃO DO CLIENTE
  =================================================== */

  if (!cliente) {

    const error =
      new Error(
        "Dados do cliente não informados."
      );

    error.status = 400;

    throw error;
  }


  const nome =
    String(cliente.nome || "")
      .trim();


  const email =
    String(cliente.email || "")
      .trim();


  const telefone =
    String(cliente.telefone || "")
      .trim();


  const cpf =
    String(cliente.cpf || "")
      .replace(/\D/g, "");


  if (nome.length < 3) {

    const error =
      new Error(
        "Nome completo inválido."
      );

    error.status = 400;

    throw error;
  }


  if (
    !email ||
    !email.includes("@")
  ) {

    const error =
      new Error(
        "E-mail inválido."
      );

    error.status = 400;

    throw error;
  }


  if (
    telefone.replace(/\D/g, "")
      .length < 10
  ) {

    const error =
      new Error(
        "Telefone inválido."
      );

    error.status = 400;

    throw error;
  }


  if (cpf.length !== 11) {

    const error =
      new Error(
        "CPF inválido."
      );

    error.status = 400;

    throw error;
  }


  /* ===================================================
     VALIDAÇÃO DO ENDEREÇO
  =================================================== */

  if (!endereco) {

    const error =
      new Error(
        "Endereço de entrega não informado."
      );

    error.status = 400;

    throw error;
  }


  const cep =
    String(endereco.cep || "")
      .replace(/\D/g, "");


  const rua =
    String(endereco.rua || "")
      .trim();


  const numero =
    String(endereco.numero || "")
      .trim();


  const complemento =
    String(
      endereco.complemento || ""
    ).trim();


  const bairro =
    String(endereco.bairro || "")
      .trim();


  const cidade =
    String(endereco.cidade || "")
      .trim();


  const estado =
    String(endereco.estado || "")
      .trim()
      .toUpperCase();


  if (cep.length !== 8) {

    const error =
      new Error(
        "CEP do endereço inválido."
      );

    error.status = 400;

    throw error;
  }


  if (rua.length < 3) {

    const error =
      new Error(
        "Rua inválida."
      );

    error.status = 400;

    throw error;
  }


  if (!numero) {

    const error =
      new Error(
        "Número do endereço não informado."
      );

    error.status = 400;

    throw error;
  }


  if (bairro.length < 2) {

    const error =
      new Error(
        "Bairro inválido."
      );

    error.status = 400;

    throw error;
  }


  if (cidade.length < 2) {

    const error =
      new Error(
        "Cidade inválida."
      );

    error.status = 400;

    throw error;
  }


  if (estado.length !== 2) {

    const error =
      new Error(
        "Estado inválido."
      );

    error.status = 400;

    throw error;
  }


  /* ===================================================
     VALOR NORMAL DO PRODUTO
  =================================================== */

  const valorProdutoNormal =
    quantidade === 2
      ? 97
      : 57;


  /* ===================================================
     VALORES DO PEDIDO
  =================================================== */

  /*
   * MODO DE TESTE:
   *
   * Produto = R$ 1,00
   * Frete   = R$ 0,00
   * Total    = R$ 1,00
   *
   * MODO NORMAL:
   *
   * 1 unidade = R$ 57,00
   * 2 unidades = R$ 97,00
   * + frete
   */

  const valorProduto =
    TEST_PAYMENT_MODE
      ? 1
      : valorProdutoNormal;


  const valorFrete =
    TEST_PAYMENT_MODE
      ? 0
      : frete;


  const valorTotal =
    valorProduto + valorFrete;


  /* ===================================================
     CONVERSÃO PARA CENTAVOS
  =================================================== */

  const produtoCentavos =
    Math.round(
      valorProduto * 100
    );


  const freteCentavos =
    Math.round(
      valorFrete * 100
    );


  /* ===================================================
     ORDER NSU
  =================================================== */

  const orderNsu =
    `VANTI-${Date.now()}`;


  /* ===================================================
     TELEFONE
  =================================================== */

  let telefoneNumeros =
    telefone.replace(/\D/g, "");


  /*
   * A InfinitePay espera o telefone
   * em formato internacional.
   *
   * Se o cliente digitou apenas
   * DDD + número, adicionamos 55.
   */

  if (
    telefoneNumeros.length === 10 ||
    telefoneNumeros.length === 11
  ) {

    telefoneNumeros =
      `55${telefoneNumeros}`;

  }


  const telefoneInfinitePay =
    `+${telefoneNumeros}`;


  /* ===================================================
     LOG DO PEDIDO
  =================================================== */

  console.log(
    "================================="
  );

  console.log(
    "CRIANDO PEDIDO VANTI"
  );

  console.log(
    "MODO DE TESTE:",
    TEST_PAYMENT_MODE
  );

  console.log(
    "ORDER NSU:",
    orderNsu
  );

  console.log(
    "CLIENTE:",
    {
      nome,
      email,
      telefone:
        telefoneInfinitePay,
    }
  );

  console.log(
    "ENDEREÇO:",
    {
      cep,
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
    }
  );

  console.log(
    "QUANTIDADE:",
    quantidade
  );

  console.log(
    "VALOR PRODUTO:",
    valorProduto
  );

  console.log(
    "VALOR FRETE:",
    valorFrete
  );

  console.log(
    "TOTAL:",
    valorTotal
  );

  console.log(
    "================================="
  );


  /* ===================================================
     SALVAR PEDIDO NO MYSQL
  =================================================== */

  try {

    const [result] =
      await pool.execute(

        `
        INSERT INTO pedidos (
          order_nsu,
          status,
          quantidade,
          valor_produto,
          valor_frete,
          valor_total,
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
          estado
        )

        VALUES (
          ?,
          'aguardando_pagamento',
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?,
          ?
        )
        `,

        [
          orderNsu,
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
        ]

      );


    console.log(
      "================================="
    );

    console.log(
      "✅ PEDIDO SALVO NO MYSQL"
    );

    console.log(
      "ID DO PEDIDO:",
      result.insertId
    );

    console.log(
      "ORDER NSU:",
      orderNsu
    );

    console.log(
      "STATUS:",
      "aguardando_pagamento"
    );

    console.log(
      "================================="
    );


  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "❌ ERRO AO SALVAR PEDIDO NO MYSQL"
    );

    console.error(
      "Mensagem:",
      error.message
    );

    console.error(
      "Código:",
      error.code
    );

    console.error(
      "ORDER NSU:",
      orderNsu
    );

    console.error(
      "================================="
    );

    throw error;
  }


  /* ===================================================
     ITENS DO CHECKOUT INFINITEPAY
  =================================================== */

  const items = [

    {
      quantity: 1,

      price:
        produtoCentavos,

      description:
        TEST_PAYMENT_MODE
          ? "Teste Vanti - R$ 1,00"
          : quantidade === 2
            ? "Queridinho Supreme - 2 unidades"
            : "Queridinho Supreme - 1 unidade",
    },

  ];


  /*
   * SOMENTE NO MODO NORMAL:
   *
   * Adicionamos o frete como item.
   *
   * No teste não enviamos frete de R$ 0,00.
   */

  if (!TEST_PAYMENT_MODE) {

    items.push({

      quantity: 1,

      price:
        freteCentavos,

      description:
        "Frete",

    });

  }


  /* ===================================================
     PAYLOAD INFINITEPAY
  =================================================== */

  const payload = {

    handle:
      INFINITEPAY_HANDLE,


    items:
      items,


    order_nsu:
      orderNsu,


    /* ================================================
       DADOS DO CLIENTE
    ================================================ */

    customer: {

      name:
        nome,

      email:
        email,

      phone_number:
        telefoneInfinitePay,

    },


    /* ================================================
       ENDEREÇO DE ENTREGA
    ================================================ */

    address: {

      cep:
        cep,

      street:
        rua,

      neighborhood:
        bairro,

      number:
        numero,

      complement:
        complemento,

    },


    /* ================================================
       REDIRECIONAMENTO
    ================================================ */

    redirect_url:
      PAYMENT_SUCCESS_URL,


    /* ================================================
       WEBHOOK
    ================================================ */

    webhook_url:
      INFINITEPAY_WEBHOOK_URL,

  };


  /* ===================================================
     LOG DO PAYLOAD
  =================================================== */

  console.log(
    "================================="
  );

  console.log(
    "CRIANDO CHECKOUT INFINITEPAY"
  );

  console.log(
    "ORDER NSU:",
    orderNsu
  );

  console.log(
    "PAYLOAD INFINITEPAY:"
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


  /* ===================================================
     CRIAR CHECKOUT NA INFINITEPAY
  =================================================== */

  let data;

  try {

    data =
      await createCheckout(
        payload
      );

  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "❌ ERRO AO CRIAR CHECKOUT INFINITEPAY"
    );

    console.error(
      "Mensagem:",
      error.message
    );

    console.error(
      "Status:",
      error.status
    );

    console.error(
      "Dados retornados pela InfinitePay:"
    );

    console.error(
      JSON.stringify(
        error.data,
        null,
        2
      )
    );

    console.error(
      "ORDER NSU:",
      orderNsu
    );

    console.error(
      "================================="
    );


    /*
     * O pedido continua salvo no MySQL
     * como aguardando_pagamento.
     */

    throw error;
  }


  /* ===================================================
     SUCESSO
  =================================================== */

  console.log(
    "================================="
  );

  console.log(
    "✅ CHECKOUT INFINITEPAY CRIADO!"
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


  /* ===================================================
     RETORNO
  =================================================== */

  return {

    success:
      true,

    order_nsu:
      orderNsu,

    ...data,

  };

}