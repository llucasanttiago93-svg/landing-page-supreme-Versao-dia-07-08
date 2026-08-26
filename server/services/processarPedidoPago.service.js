import {
  checkPayment,
} from "./infinitePay.service.js";

import {
  criarPedidoVenda,
  buscarProdutoVanti,
} from "./bling.service.js";

import pool from "../config/database.js";

import {
  enviarEmailErroBling,
} from "./email.service.js";


/* =====================================================
   PROCESSAR PEDIDO PAGO
===================================================== */

export async function processarPedidoPago({

  orderNsu,

  transactionNsu,
  invoiceSlug,

  amount,
  paidAmount,
  installments,
  captureMethod,
  receiptUrl,
  items,

}) {

  let pedido = null;

  let etapa =
    "inicio";


  try {

    /* =================================================
       VALIDAR IDENTIFICADORES
    ================================================= */

    if (!orderNsu) {

      throw new Error(
        "order_nsu não informado."
      );

    }

    if (!transactionNsu) {

      throw new Error(
        "transaction_nsu não informado."
      );

    }

    if (!invoiceSlug) {

      throw new Error(
        "invoice_slug/slug não informado."
      );

    }


    /* =================================================
       PROCURAR PEDIDO
    ================================================= */

    console.log(
      "================================="
    );

    console.log(
      "PROCURANDO PEDIDO NO MYSQL"
    );

    console.log(
      "ORDER NSU:",
      orderNsu
    );

    console.log(
      "================================="
    );


    const [
      pedidos
    ] =
      await pool.execute(

        `
        SELECT

          id,
          order_nsu,
          status,

          quantidade,

          valor_produto,
          valor_frete,

          shipping_id,
          shipping_name,
          shipping_company,
          shipping_delivery_time,

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
          estado,

          invoice_slug,
          transaction_nsu,
          paid_amount,
          installments,
          capture_method,
          receipt_url,
          paid_at,

          bling_order_id,
          bling_status,

          created_at,
          updated_at

        FROM pedidos

        WHERE order_nsu = ?

        LIMIT 1
        `,

        [
          orderNsu
        ]

      );


    /* =================================================
       PEDIDO NÃO ENCONTRADO
    ================================================= */

    if (
      pedidos.length === 0
    ) {

      throw new Error(
        `Pedido não encontrado no MySQL: ${orderNsu}`
      );

    }


    pedido =
      pedidos[0];


    console.log(
      "PEDIDO ENCONTRADO:"
    );

    console.log(
      pedido
    );


    /* =================================================
       JÁ FOI ENVIADO AO BLING
    ================================================= */

    if (
      pedido.bling_order_id
    ) {

      console.log(
        "================================="
      );

      console.log(
        "⚠️ PEDIDO JÁ ENVIADO AO BLING"
      );

      console.log(
        "ORDER NSU:",
        orderNsu
      );

      console.log(
        "BLING ORDER ID:",
        pedido.bling_order_id
      );

      console.log(
        "================================="
      );


      return {

        success:
          true,

        alreadyProcessed:
          true,

        blingOrderId:
          pedido.bling_order_id,

      };

    }


    /* =================================================
       PEDIDO JÁ SENDO PROCESSADO
    ================================================= */

    if (
      pedido.bling_status ===
      "processando"
    ) {

      console.log(
        "================================="
      );

      console.log(
        "⚠️ PEDIDO JÁ ESTÁ SENDO PROCESSADO"
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

        processing:
          true,

      };

    }


    /* =================================================
       CONFIRMAR PAGAMENTO
    ================================================= */

    etapa =
      "pagamento";


    let payment;


    if (
      pedido.status === "pago" &&
      pedido.transaction_nsu
    ) {

      console.log(
        "================================="
      );

      console.log(
        "⚠️ PAGAMENTO JÁ ESTÁ MARCADO COMO PAGO"
      );

      console.log(
        "Vamos continuar para o Bling."
      );

      console.log(
        "================================="
      );


      payment = {

        paid:
          true,

        paid_amount:
          pedido.paid_amount,

        installments:
          pedido.installments,

        capture_method:
          pedido.capture_method,

        receipt_url:
          pedido.receipt_url,

        invoice_slug:
          pedido.invoice_slug,

        transaction_nsu:
          pedido.transaction_nsu,

      };


    } else {

      console.log(
        "================================="
      );

      console.log(
        "CONFIRMANDO PAGAMENTO NA INFINITEPAY"
      );

      console.log(
        "ORDER NSU:",
        orderNsu
      );

      console.log(
        "TRANSACTION NSU:",
        transactionNsu
      );

      console.log(
        "SLUG:",
        invoiceSlug
      );

      console.log(
        "================================="
      );


      payment =
        await checkPayment({

          orderNsu,

          transactionNsu,

          slug:
            invoiceSlug,

        });

    }


    console.log(
      "RESULTADO PAYMENT_CHECK:"
    );

    console.log(
      JSON.stringify(
        payment,
        null,
        2
      )
    );


    /* =================================================
       PAGAMENTO NÃO CONFIRMADO
    ================================================= */

    if (
      !payment ||
      payment.paid !== true
    ) {

      console.warn(
        "⚠️ PAGAMENTO AINDA NÃO CONFIRMADO."
      );


      return {

        success:
          false,

        paid:
          false,

        message:
          "Pagamento ainda não confirmado.",

      };

    }


    /* =================================================
       DADOS DO PAGAMENTO
    ================================================= */

    const valorPago =
      payment.paid_amount ??
      paidAmount ??
      null;


    const numeroParcelas =
      payment.installments ??
      installments ??
      null;


    const metodoCaptura =
      payment.capture_method ??
      captureMethod ??
      null;


    const comprovante =
      payment.receipt_url ??
      receiptUrl ??
      null;


    const slug =
      payment.invoice_slug ??
      invoiceSlug;


    const transacao =
      payment.transaction_nsu ??
      transactionNsu;


    console.log(
      "================================="
    );

    console.log(
      "✅ PAGAMENTO CONFIRMADO"
    );

    console.log(
      "================================="
    );


    /* =================================================
       ATUALIZAR PAGAMENTO NO MYSQL
    ================================================= */

    await pool.execute(

      `
      UPDATE pedidos

      SET

        status = ?,

        invoice_slug = ?,

        transaction_nsu = ?,

        paid_amount = ?,

        installments = ?,

        capture_method = ?,

        receipt_url = ?,

        paid_at = NOW(),

        updated_at = NOW()

      WHERE id = ?

      LIMIT 1
      `,

      [

        "pago",

        slug,

        transacao,

        valorPago,

        numeroParcelas,

        metodoCaptura,

        comprovante,

        pedido.id

      ]

    );


    console.log(
      "================================="
    );

    console.log(
      "✅ PEDIDO ATUALIZADO NO MYSQL"
    );

    console.log(
      "ID:",
      pedido.id
    );

    console.log(
      "ORDER NSU:",
      orderNsu
    );

    console.log(
      "STATUS: pago"
    );

    console.log(
      "TRANSACTION NSU:",
      transacao
    );

    console.log(
      "VALOR PAGO:",
      valorPago
    );

    console.log(
      "================================="
    );


    /* =================================================
       DEFINIR SKU
    ================================================= */

    etapa =
      "bling";


    const quantidade =
      Number(
        pedido.quantidade
      );


    let skuProduto;


    if (
      quantidade === 1
    ) {

      skuProduto =
        process.env.BLING_SKU_1_UNIDADE ||
        "VTRP30MLQDS";


    } else if (
      quantidade === 2
    ) {

      skuProduto =
        process.env.BLING_SKU_2_UNIDADES ||
        "VTKT6RPS";


    } else {

      throw new Error(
        `Quantidade não suportada para integração com o Bling: ${quantidade}`
      );

    }


    /* =================================================
       BUSCAR PRODUTO NO BLING
    ================================================= */

    console.log(
      "================================="
    );

    console.log(
      "🔎 BUSCANDO PRODUTO NO BLING"
    );

    console.log(
      "QUANTIDADE DO PEDIDO:",
      quantidade
    );

    console.log(
      "SKU ESCOLHIDO:",
      skuProduto
    );

    console.log(
      "================================="
    );


    const produtoBling =
      await buscarProdutoVanti(
        skuProduto
      );


    if (
      !produtoBling ||
      !produtoBling.id
    ) {

      throw new Error(
        `Produto ${skuProduto} não encontrado no Bling.`
      );

    }


    console.log(
      "================================="
    );

    console.log(
      "✅ PRODUTO ENCONTRADO NO BLING"
    );

    console.log(
      "ID:",
      produtoBling.id
    );

    console.log(
      "NOME:",
      produtoBling.nome
    );

    console.log(
      "SKU:",
      produtoBling.codigo
    );

    console.log(
      "================================="
    );


    /* =================================================
       MARCAR COMO PROCESSANDO
    ================================================= */

    const [
      resultadoProcessamento
    ] =
      await pool.execute(

        `
        UPDATE pedidos

        SET

          bling_status = ?,

          updated_at = NOW()

        WHERE id = ?

        AND bling_order_id IS NULL

        AND (
          bling_status IS NULL
          OR bling_status <> 'processando'
        )

        LIMIT 1
        `,

        [

          "processando",

          pedido.id

        ]

      );


    if (
      resultadoProcessamento.affectedRows !== 1
    ) {

      console.log(
        "⚠️ PEDIDO JÁ ESTÁ SENDO PROCESSADO POR OUTRA REQUISIÇÃO."
      );


      return {

        success:
          true,

        processing:
          true,

      };

    }


    /* =================================================
       CRIAR PEDIDO NO BLING
    ================================================= */

    console.log(
      "================================="
    );

    console.log(
      "📦 ENVIANDO PEDIDO PARA O BLING"
    );

    console.log(
      "ORDER NSU:",
      orderNsu
    );

    console.log(
      "PRODUTO BLING ID:",
      produtoBling.id
    );

    console.log(
      "QUANTIDADE:",
      pedido.quantidade
    );

    console.log(
      "VALOR PRODUTO:",
      pedido.valor_produto
    );

    console.log(
      "VALOR FRETE:",
      pedido.valor_frete
    );

    console.log(
      "VALOR TOTAL:",
      pedido.valor_total
    );

    console.log(
      "CLIENTE:",
      pedido.nome
    );

    console.log(
      "FRETE ID:",
      pedido.shipping_id
    );

    console.log(
      "FRETE SERVIÇO:",
      pedido.shipping_name
    );

    console.log(
      "TRANSPORTADORA:",
      pedido.shipping_company
    );

    console.log(
      "PRAZO:",
      pedido.shipping_delivery_time
    );

    console.log(
      "================================="
    );


    const resultadoBling =
      await criarPedidoVenda({

        produtoBlingId:
          produtoBling.id,

        quantidade:
          pedido.quantidade,

        valorProduto:
          pedido.valor_produto,

        valorFrete:
          pedido.valor_frete,

        shippingId:
          pedido.shipping_id,

        shippingName:
          pedido.shipping_name,

        shippingCompany:
          pedido.shipping_company,

        shippingDeliveryTime:
          pedido.shipping_delivery_time,

        valorTotal:
          pedido.valor_total,

        nome:
          pedido.nome,

        email:
          pedido.email,

        telefone:
          pedido.telefone,

        cpf:
          pedido.cpf,

        cep:
          pedido.cep,

        rua:
          pedido.rua,

        numero:
          pedido.numero,

        complemento:
          pedido.complemento,

        referencia:
          pedido.referencia,

        bairro:
          pedido.bairro,

        cidade:
          pedido.cidade,

        estado:
          pedido.estado,

        orderNsu:
          orderNsu,

      });


    /* =================================================
       VALIDAR RESPOSTA DO BLING
    ================================================= */

    if (
      !resultadoBling ||
      !resultadoBling.blingOrderId
    ) {

      throw new Error(
        "Bling não retornou o ID do pedido criado."
      );

    }


    const blingOrderId =
      resultadoBling.blingOrderId;


    /* =================================================
       SALVAR BLING NO MYSQL
    ================================================= */

    await pool.execute(

      `
      UPDATE pedidos

      SET

        bling_order_id = ?,

        bling_status = ?,

        updated_at = NOW()

      WHERE id = ?

      LIMIT 1
      `,

      [

        String(
          blingOrderId
        ),

        "criado",

        pedido.id

      ]

    );


    /* =================================================
       SUCESSO
    ================================================= */

    console.log(
      "================================="
    );

    console.log(
      "✅ PEDIDO CRIADO NO BLING"
    );

    console.log(
      "ORDER NSU:",
      orderNsu
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

      paid:
        true,

      blingOrderId:
        blingOrderId,

    };


  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "❌ ERRO AO PROCESSAR PEDIDO PAGO"
    );

    console.error(
      "ETAPA:",
      etapa
    );

    console.error(
      "ORDER NSU:",
      orderNsu
    );

    console.error(
      "ERRO:",
      error?.message
    );

    console.error(
      "STACK:",
      error?.stack
    );

    console.error(
      "================================="
    );


    /* =================================================
       REGISTRAR ERRO DO BLING
    ================================================= */

    if (
      etapa === "bling" &&
      orderNsu &&
      pedido
    ) {

      try {

        const [
          resultadoUpdate
        ] =
          await pool.execute(

            `
            UPDATE pedidos

            SET

              bling_status = ?,

              bling_error = ?,

              updated_at = NOW()

            WHERE id = ?

            AND (
              bling_status IS NULL
              OR bling_status <> 'erro'
            )

            LIMIT 1
            `,

            [

              "erro",

              error?.message ||
              "Erro desconhecido ao enviar pedido para o Bling.",

              pedido.id

            ]

          );


        if (
          resultadoUpdate.affectedRows === 1
        ) {

          try {

            await enviarEmailErroBling({

              orderNsu:
                orderNsu,

              nome:
                pedido.nome,

              email:
                pedido.email,

              telefone:
                pedido.telefone,

              cpf:
                pedido.cpf,

              valorTotal:
                pedido.valor_total,

              erro:
                error?.message ||
                "Erro desconhecido ao enviar pedido para o Bling.",

            });


            console.log(
              "📧 ALERTA DE ERRO DO BLING ENVIADO POR E-MAIL"
            );


          } catch (emailError) {

            console.error(
              "❌ NÃO FOI POSSÍVEL ENVIAR O ALERTA POR E-MAIL"
            );

            console.error(
              emailError?.message ||
              emailError
            );

          }

        }

      } catch (dbError) {

        console.error(
          "❌ NÃO FOI POSSÍVEL REGISTRAR O ERRO DO BLING NO MYSQL"
        );

        console.error(
          "ORDER NSU:",
          orderNsu
        );

        console.error(
          "ERRO ORIGINAL:",
          error?.message
        );

        console.error(
          "ERRO MYSQL:",
          dbError?.message
        );

      }

    }


    throw error;

  }

}