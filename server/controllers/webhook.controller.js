import {
  checkPayment,
} from "../services/infinitePay.service.js";

import {
  criarPedidoVenda,
  buscarProdutoVanti,
} from "../services/bling.service.js";

import pool from "../config/database.js";


/* =====================================================
   WEBHOOK INFINITEPAY
===================================================== */

export async function webhookInfinitePay(
  req,
  res
) {

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
      order_nsu,
      receipt_url,
      items,
    } = data;


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


    const pedido =
      pedidos[0];


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
       BUSCAR PRODUTO NO BLING PELO SKU
    ================================================= */

    console.log(
      "================================="
    );

    console.log(
      "🔎 BUSCANDO PRODUTO NO BLING"
    );

    console.log(
      "SKU:",
      "VTRP30MLQDS"
    );

    console.log(
      "================================="
    );


    const produtoBling =
      await buscarProdutoVanti();


    /* =================================================
       VALIDAR PRODUTO
    ================================================= */

    if (
      !produtoBling ||
      !produtoBling.id
    ) {

      throw new Error(
        "Produto VTRP30MLQDS não encontrado no Bling."
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
      !resultadoBling.id
    ) {

      throw new Error(
        "Bling não retornou o ID do pedido criado."
      );

    }


    const blingOrderId =
      resultadoBling.id;


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
      "Mensagem:",
      error.message
    );

    console.error(
      "Status:",
      error.status
    );

    console.error(
      "Dados:",
      error.data
    );

    console.error(
      "Stack:",
      error.stack
    );

    console.error(
      "================================="
    );


    /*
     * Se o Bling falhar, retornamos erro.
     *
     * O pagamento já foi salvo como pago no MySQL.
     *
     * Como bling_order_id ainda estará vazio,
     * um novo webhook poderá tentar novamente
     * enviar o pedido ao Bling.
     */

    return res.sendStatus(400);

  }

}