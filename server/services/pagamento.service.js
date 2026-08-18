import {
  INFINITEPAY_HANDLE,
  PAYMENT_SUCCESS_URL,
  INFINITEPAY_WEBHOOK_URL,
} from "../config/config.js";

import {
  createCheckout,
} from "./infinitePay.service.js";


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
     VALOR DO PRODUTO
  =================================================== */

  const valorProduto =
    quantidade === 2
      ? 97
      : 57;


  /* ===================================================
     CONVERSÃO PARA CENTAVOS
  =================================================== */

  const produtoCentavos =
    Math.round(
      valorProduto * 100
    );


  const freteCentavos =
    Math.round(
      frete * 100
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
     PAYLOAD INFINITEPAY
  =================================================== */

  const payload = {

    handle:
      INFINITEPAY_HANDLE,


    items: [

      {

        quantity:
          quantidade,

        price:
          produtoCentavos,

        description:
          quantidade === 2
            ? "Queridinho Supreme - 2 unidades"
            : "Queridinho Supreme - 1 unidade",

      },


      {

        quantity: 1,

        price:
          freteCentavos,

        description:
          "Frete",

      },

    ],


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
     LOG DO PEDIDO
  ===================================================== */

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
    "FRETE:",
    frete
  );

  console.log(
    "TOTAL:",
    valorProduto + frete
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


  /* ===================================================
     CRIAR CHECKOUT NA INFINITEPAY
  =================================================== */

  const data =
    await createCheckout(
      payload
    );


  /* ===================================================
     SUCESSO
  =================================================== */

  console.log(
    "CHECKOUT INFINITEPAY CRIADO!"
  );

  console.log(
    JSON.stringify(
      data,
      null,
      2
    )
  );


  return {

    success: true,

    order_nsu:
      orderNsu,

    ...data,

  };

}