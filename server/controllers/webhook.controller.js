import {
  checkPayment,
} from "../services/infinitePay.service.js";

import {
  criarPedidoVenda,
  buscarProdutoVanti,
} from "../services/bling.service.js";

import pool from "../config/database.js";

import {
  enviarEmailErroBling,
} from "../services/email.service.js";


/* =====================================================
   WEBHOOK INFINITEPAY
===================================================== */

export async function webhookInfinitePay(req, res) {

  let etapa = "inicio";
  let order_nsu = null;
  let pedido = null;

  try {

    const data =
      req.body;


    /* =================================================
       DADOS DO WEBHOOK
    ================================================= */

    const {
      invoice_slug,
      amount,
      paid_amount,
      installments,
      capture_method,
      transaction_nsu,
      order_nsu: orderNsuWebhook,
      receipt_url,
      items,
    } = data;

    order_nsu = orderNsuWebhook;


    /* =================================================
       LOG
    ================================================= */

    console.log(
      "================================="
    );

    console.log(
      "WEBHOOK INFINITEPAY RECEBIDO"
    );

    console.log(
      "ORDER NSU:",
      order_nsu
    );

    console.log(
      "TRANSACTION NSU:",
      transaction_nsu
    );

    console.log(
      "INVOICE SLUG:",
      invoice_slug
    );

    console.log(
      "VALOR:",
      amount
    );

    console.log(
      "VALOR PAGO:",
      paid_amount
    );

    console.log(
      "PARCELAS:",
      installments
    );

    console.log(
      "MÉTODO:",
      capture_method
    );

    console.log(
      "COMPROVANTE:",
      receipt_url
    );

    console.log(
      "ITENS:",
      items
    );

    console.log(
      "================================="
    );


    /* =================================================
       VALIDAÇÃO
    ================================================= */

    if (!order_nsu) {

      console.warn(
        "Webhook sem order_nsu."
      );

      return res.sendStatus(400);

    }


    if (!transaction_nsu) {

      console.warn(
        "Webhook sem transaction_nsu."
      );

      return res.sendStatus(400);

    }


    if (!invoice_slug) {

      console.warn(
        "Webhook sem invoice_slug."
      );

      return res.sendStatus(400);

    }


    /* =================================================
       PROCURAR PEDIDO NO MYSQL
    ================================================= */

    console.log(
      "================================="
    );

    console.log(
      "PROCURANDO PEDIDO NO MYSQL"
    );

    console.log(
      "ORDER NSU:",
      order_nsu
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
          order_nsu
        ]

      );


    /* =================================================
       PEDIDO NÃO ENCONTRADO
    ================================================= */

    if (
      pedidos.length === 0
    ) {

      console.warn(
        "Pedido não encontrado no banco."
      );

      console.warn(
        "ORDER NSU:",
        order_nsu
      );

      /*
       * Retornamos 200 para evitar que a
       * InfinitePay fique reenviando indefinidamente
       * um pedido que não existe no nosso banco.
      */

      return res.sendStatus(200);

    }


    pedido = pedidos[0];


    console.log(
      "PEDIDO ENCONTRADO:"
    );

    console.log(
      pedido
    );


    /* =================================================
       VERIFICAR SE JÁ FOI ENVIADO AO BLING
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
        order_nsu
      );

      console.log(
        "BLING ORDER ID:",
        pedido.bling_order_id
      );

      console.log(
        "================================="
      );


      return res.sendStatus(200);

    }


    /* =================================================
       VERIFICAR SE JÁ POSSUI ERRO NO BLING
    ================================================= */

    if (
      pedido.bling_status === "erro"
    ) {

      console.log(
        "================================="
      );

      console.log(
        "⚠️ PEDIDO JÁ POSSUI ERRO NO BLING"
      );

      console.log(
        "ORDER NSU:",
        order_nsu
      );

      console.log(
        "❌ NÃO VAMOS TENTAR ENVIAR NOVAMENTE AO BLING"
      );

      console.log(
        "📧 O ALERTA JÁ FOI PROCESSADO"
      );

      console.log(
        "================================="
      );


      return res.sendStatus(200);

    }


    /* =================================================
       CONFIRMAR PAGAMENTO NA INFINITEPAY
    ================================================= */

    console.log(
      "================================="
    );

    console.log(
      "CONFIRMANDO PAGAMENTO"
    );

    console.log(
      "================================="
    );


    let payment;


    /*
     * Se o pedido já estiver marcado como pago,
     * mas ainda não tiver sido enviado ao Bling,
     * não precisamos consultar novamente a InfinitePay.
     *
     * Isso permite que um webhook reenviado continue
     * o processo exatamente de onde parou.
    */

    if (
      pedido.status === "pago" &&
      pedido.transaction_nsu
    ) {

      console.log(
        "⚠️ PAGAMENTO JÁ ESTÁ MARCADO COMO PAGO."
      );

      console.log(
        "Vamos continuar para o Bling."
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

      payment =
        await checkPayment({

          orderNsu:
            order_nsu,

          transactionNsu:
            transaction_nsu,

          slug:
            invoice_slug,

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
        "Pagamento ainda NÃO confirmado."
      );


      return res.sendStatus(200);

    }


    /* =================================================
       PAGAMENTO CONFIRMADO
    ================================================= */

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
       DADOS DO PAGAMENTO
    ================================================= */

    const valorPago =
      payment.paid_amount ??
      paid_amount ??
      null;


    const numeroParcelas =
      payment.installments ??
      installments ??
      null;


    const metodoCaptura =
      payment.capture_method ??
      capture_method ??
      null;


    const comprovante =
      payment.receipt_url ??
      receipt_url ??
      null;


    const slug =
      payment.invoice_slug ??
      invoice_slug;


    const transacao =
      payment.transaction_nsu ??
      transaction_nsu;


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


    /* =================================================
       CONFIRMAR ATUALIZAÇÃO
    ================================================= */

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
      order_nsu
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
      "PARCELAS:",
      numeroParcelas
    );

    console.log(
      "================================="
    );


    /* =================================================
       DETERMINAR PRODUTO BLING PELA QUANTIDADE
    ================================================= */

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

      /*
       * TEMPORÁRIO:
       *
       * Enquanto o produto específico de 2 unidades
       * não foi criado no Bling, usamos o produto
       * VTKT6RPS apenas para testar a integração.
      */

      skuProduto =
        process.env.BLING_SKU_2_UNIDADES ||
        "VTKT6RPS";


    } else {

      throw new Error(
        `Quantidade não suportada para integração com o Bling: ${quantidade}`
      );

    }


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

    etapa = "bling";

    const produtoBling =
      await buscarProdutoVanti(
        skuProduto
      );


    /* =================================================
       VALIDAR PRODUTO
    ================================================= */

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
      order_nsu
    );

    console.log(
      "PRODUTO BLING ID:",
      produtoBling.id
    );

    console.log(
      "PRODUTO BLING SKU:",
      produtoBling.codigo
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
      "================================="
    );


    /* =================================================
       MARCAR COMO PROCESSANDO
    ================================================= */

    await pool.execute(

      `
      UPDATE pedidos

      SET

        bling_status = ?,

        updated_at = NOW()

      WHERE id = ?

      LIMIT 1
      `,

      [

        "processando",

        pedido.id

      ]

    );


    /* =================================================
       CRIAR PEDIDO DE VENDA NO BLING
    ================================================= */

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
          order_nsu,

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
       SALVAR PEDIDO DO BLING NO MYSQL
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
       CONFIRMAR BLING
    ================================================= */

    console.log(
      "================================="
    );

    console.log(
      "✅ PEDIDO CRIADO NO BLING"
    );

    console.log(
      "ORDER NSU:",
      order_nsu
    );

    console.log(
      "BLING ORDER ID:",
      blingOrderId
    );

    console.log(
      "PRODUTO BLING ID:",
      produtoBling.id
    );

    console.log(
      "================================="
    );


    /* =================================================
       FINAL
    ================================================= */

    return res.sendStatus(200);


  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "❌ ERRO NO WEBHOOK INFINITEPAY"
    );

    console.error(
      "================================="
    );

    console.error(
      "Etapa:",
      etapa
    );

    console.error(
      "Mensagem:",
      error?.message
    );

    console.error(
      "Status:",
      error?.status
    );

    console.error(
      "Dados:",
      error?.data
    );

    console.error(
      "Stack:",
      error?.stack
    );

    console.error(
      "================================="
    );


    /* =================================================
       ERRO DURANTE PROCESSAMENTO DO BLING
    ================================================= */

    if (
      etapa === "bling" &&
      order_nsu
    ) {

      try {

        const [resultadoUpdate] =
          await pool.execute(
            `
        UPDATE pedidos

        SET

          bling_status = ?,

          bling_error = ?,

          updated_at = NOW()

        WHERE order_nsu = ?

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

              order_nsu

            ]

          );


        /* ==========================================
           VERIFICAR SE FOI A PRIMEIRA VEZ
        ========================================== */

        if (
          resultadoUpdate.affectedRows === 1
        ) {

          console.log(
            "================================="
          );

          console.log(
            "⚠️ ERRO DO BLING REGISTRADO NO MYSQL"
          );

          console.log(
            "ORDER NSU:",
            order_nsu
          );

          console.log(
            "ERRO:",
            error?.message
          );

          console.log(
            "================================="
          );


          /* ==========================================
             ENVIAR ALERTA POR E-MAIL
          ========================================== */

          try {

            await enviarEmailErroBling({

              orderNsu:
                order_nsu,

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


        } else {

          console.log(
            "ℹ️ ERRO DO BLING JÁ REGISTRADO — E-MAIL NÃO SERÁ ENVIADO NOVAMENTE"
          );

          console.log(
            "ORDER NSU:",
            order_nsu
          );

        }


        /* ==========================================
           IMPORTANTE:
           O WEBHOOK FOI RECEBIDO.
           RESPONDER 200 EVITA NOVOS REENVios
           DA INFINITEPAY.
        ========================================== */

        return res.sendStatus(200);


      } catch (dbError) {

        console.error(
          "================================="
        );

        console.error(
          "❌ NÃO FOI POSSÍVEL REGISTRAR O ERRO DO BLING NO MYSQL"
        );

        console.error(
          "ORDER NSU:",
          order_nsu
        );

        console.error(
          "Erro original:",
          error?.message
        );

        console.error(
          "Erro ao atualizar MySQL:",
          dbError?.message
        );

        console.error(
          "================================="
        );

        /*
         * Aqui mantemos 400 porque realmente
         * não conseguimos processar o webhook.
         */

        return res.sendStatus(400);

      }

    }


    /* ==========================================
       OUTROS ERROS DO WEBHOOK
    ========================================== */

    return res.sendStatus(400);
  }
}