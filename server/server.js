import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = 3001;

app.use(cors());
app.use(express.json());

/* =====================================================
   MELHOR ENVIO
===================================================== */

const MELHOR_ENVIO_URL =
  "https://sandbox.melhorenvio.com.br";

const CLIENT_ID =
  process.env.MELHOR_ENVIO_CLIENT_ID;

const CLIENT_SECRET =
  process.env.MELHOR_ENVIO_CLIENT_SECRET;

const CALLBACK_URL =
  "https://clavicle-legroom-sedative.ngrok-free.dev/melhor-envio/callback";

let accessToken =
  process.env.MELHOR_ENVIO_ACCESS_TOKEN || null;

let refreshToken =
  process.env.MELHOR_ENVIO_REFRESH_TOKEN || null;


/* =====================================================
   INFINITEPAY
===================================================== */

const INFINITEPAY_URL =
  "https://api.checkout.infinitepay.io";

const INFINITEPAY_HANDLE =
  "vanticosmeticos";


/*
 * URL pública do seu site/backend.
 *
 * Como estamos usando ngrok durante os testes,
 * usamos o mesmo endereço público.
 */

const PUBLIC_BASE_URL =
  process.env.PUBLIC_BASE_URL ||
  "https://clavicle-legroom-sedative.ngrok-free.dev";


/*
 * Página para onde o cliente será enviado
 * depois de concluir o pagamento.
 */

const PAYMENT_SUCCESS_URL =
  `${PUBLIC_BASE_URL}/pagamento-concluido`;


/*
 * Endpoint que receberá a confirmação
 * automática da InfinitePay.
 */

const INFINITEPAY_WEBHOOK_URL =
  `${PUBLIC_BASE_URL}/webhook-infinitepay`;


/* =====================================================
   TESTE DO BACKEND
===================================================== */

app.get("/api/test", (req, res) => {

  res.json({
    success: true,
    message: "Backend da Vanti funcionando!",
  });

});


/* =====================================================
   AUTORIZAÇÃO MELHOR ENVIO
===================================================== */

app.get(
  "/melhor-envio/authorize",
  (req, res) => {

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
      `&scope=${encodeURIComponent(scopes)}`;

    res.redirect(authorizationUrl);

  }
);


/* =====================================================
   CALLBACK DO MELHOR ENVIO
===================================================== */

app.get(
  "/melhor-envio/callback",
  async (req, res) => {

    const { code, error } = req.query;


    if (error) {

      return res.status(400).send(`
        <h1>Erro na autorização</h1>
        <p>${error}</p>
      `);

    }


    if (!code) {

      return res.status(400).send(`
        <h1>Código não encontrado</h1>
      `);

    }


    try {

      const response = await fetch(
        `${MELHOR_ENVIO_URL}/oauth/token`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent":
              "Vanti Cosméticos (lucasantiago93@gmail.com)",
          },

          body: JSON.stringify({

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


      if (!response.ok) {

        console.error(
          "Erro Melhor Envio:",
          data
        );

        return res
          .status(response.status)
          .json(data);

      }


      accessToken =
        data.access_token;

      refreshToken =
        data.refresh_token;


      console.log(
        "================================="
      );

      console.log(
        "MELHOR ENVIO AUTORIZADO!"
      );

      console.log(
        "Access Token recebido."
      );

      console.log(
        "Refresh Token recebido."
      );

      console.log(
        "================================="
      );


      res.send(`
        <h1>Melhor Envio autorizado!</h1>
        <p>A integração Sandbox foi autorizada com sucesso.</p>
        <p>Você já pode fechar esta página.</p>
      `);


    } catch (error) {

      console.error(error);

      res.status(500).json({
        error:
          "Erro ao solicitar token ao Melhor Envio.",
      });

    }

  }
);


/* =====================================================
   COTAÇÃO DE FRETE
===================================================== */

app.post(
  "/api/frete",
  async (req, res) => {

    try {

      if (!accessToken) {

        return res.status(401).json({

          error:
            "Melhor Envio ainda não foi autorizado.",

          authorizeUrl:
            "/melhor-envio/authorize",

        });

      }


      const {
        cepDestino,
        quantidade,
      } = req.body;


      if (!cepDestino) {

        return res.status(400).json({

          error:
            "CEP de destino não informado.",

        });

      }


      /* ================================================
         DADOS DO PRODUTO
      ================================================ */

      const peso =
        quantidade === 2
          ? 0.2
          : 0.1;


      const valorProduto =
        quantidade === 2
          ? 97
          : 57;


      const payload = {

        from: {

          postal_code:
            process.env.ORIGIN_CEP,

        },


        to: {

          postal_code:
            cepDestino.replace(/\D/g, ""),

        },


        products: [

          {

            id:
              "queridinho-supreme",

            width: 12,

            height: 5,

            length: 17,

            weight: peso,

            insurance_value:
              valorProduto,

            quantity: 1,

          },

        ],

      };


      const response =
        await fetch(
          `${MELHOR_ENVIO_URL}/api/v2/me/shipment/calculate`,
          {

            method: "POST",

            headers: {

              "Authorization":
                `Bearer ${accessToken}`,

              "Accept":
                "application/json",

              "Content-Type":
                "application/json",

              "User-Agent":
                "Vanti Cosméticos (lucasantiago93@gmail.com)",

            },

            body:
              JSON.stringify(payload),

          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        console.error(
          "Erro na cotação:",
          JSON.stringify(
            data,
            null,
            2
          )
        );

        return res
          .status(response.status)
          .json(data);

      }


      res.json(data);


    } catch (error) {

      console.error(error);

      res.status(500).json({

        error:
          "Erro interno ao calcular o frete.",

      });

    }

  }
);


/* =====================================================
   CRIAR CHECKOUT INFINITEPAY
===================================================== */

app.post(
  "/api/pagamento",
  async (req, res) => {

    try {

      const {

        quantidade,

        frete,

        cliente,

        endereco,

        freteDetalhes,

      } = req.body;


      /* ================================================
         VALIDAÇÃO DA QUANTIDADE
      ================================================ */

      if (![1, 2].includes(quantidade)) {

        return res.status(400).json({

          error:
            "Quantidade de produtos inválida.",

        });

      }


      /* ================================================
         VALIDAÇÃO DO FRETE
      ================================================ */

      if (
        typeof frete !== "number" ||
        !Number.isFinite(frete) ||
        frete < 0
      ) {

        return res.status(400).json({

          error:
            "Valor do frete inválido.",

        });

      }


      /* ================================================
         VALIDAÇÃO DO CLIENTE
      ================================================ */

      if (!cliente) {

        return res.status(400).json({

          error:
            "Dados do cliente não informados.",

        });

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

        return res.status(400).json({

          error:
            "Nome completo inválido.",

        });

      }


      if (
        !email ||
        !email.includes("@")
      ) {

        return res.status(400).json({

          error:
            "E-mail inválido.",

        });

      }


      if (
        telefone.replace(/\D/g, "")
          .length < 10
      ) {

        return res.status(400).json({

          error:
            "Telefone inválido.",

        });

      }


      if (cpf.length !== 11) {

        return res.status(400).json({

          error:
            "CPF inválido.",

        });

      }


      /* ================================================
         VALIDAÇÃO DO ENDEREÇO
      ================================================ */

      if (!endereco) {

        return res.status(400).json({

          error:
            "Endereço de entrega não informado.",

        });

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

        return res.status(400).json({

          error:
            "CEP do endereço inválido.",

        });

      }


      if (rua.length < 3) {

        return res.status(400).json({

          error:
            "Rua inválida.",

        });

      }


      if (!numero) {

        return res.status(400).json({

          error:
            "Número do endereço não informado.",

        });

      }


      if (bairro.length < 2) {

        return res.status(400).json({

          error:
            "Bairro inválido.",

        });

      }


      if (cidade.length < 2) {

        return res.status(400).json({

          error:
            "Cidade inválida.",

        });

      }


      if (estado.length !== 2) {

        return res.status(400).json({

          error:
            "Estado inválido.",

        });

      }


      /* ================================================
         VALOR DO PRODUTO
      ================================================ */

      const valorProduto =
        quantidade === 2
          ? 97
          : 57;


      /* ================================================
         CONVERSÃO PARA CENTAVOS
      ================================================ */

      const produtoCentavos =
        Math.round(
          valorProduto * 100
        );


      const freteCentavos =
        Math.round(
          frete * 100
        );


      /* ================================================
         ORDER NSU
      ================================================ */

      const orderNsu =
        `VANTI-${Date.now()}`;


      /* ================================================
         TELEFONE
      ================================================ */

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


      /* ================================================
         PAYLOAD INFINITEPAY
      ================================================ */

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


        /* ============================================
           DADOS DO CLIENTE
        ============================================ */

        customer: {

          name:
            nome,

          email:
            email,

          phone_number:
            telefoneInfinitePay,

        },


        /* ============================================
           ENDEREÇO DE ENTREGA
        ============================================ */

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


        /* ============================================
           REDIRECIONAMENTO
        ============================================ */

        redirect_url:
          PAYMENT_SUCCESS_URL,


        /* ============================================
           WEBHOOK
        ============================================ */

        webhook_url:
          INFINITEPAY_WEBHOOK_URL,

      };


      /* ================================================
         LOG DO PEDIDO
      ================================================ */

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
          telefone: telefoneInfinitePay,
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


      /* ================================================
         REQUISIÇÃO PARA INFINITEPAY
      ================================================ */

      const response =
        await fetch(
          `${INFINITEPAY_URL}/links`,
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              "Accept":
                "application/json",

            },

            body:
              JSON.stringify(payload),

          }
        );


      const data =
        await response.json();


      /* ================================================
         ERRO
      ================================================ */

      if (!response.ok) {

        console.error(
          "Erro InfinitePay:",
          JSON.stringify(
            data,
            null,
            2
          )
        );

        return res
          .status(response.status)
          .json(data);

      }


      /* ================================================
         SUCESSO
      ================================================ */

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


      res.json({

        success: true,

        order_nsu:
          orderNsu,

        ...data,

      });


    } catch (error) {

      console.error(
        "Erro interno InfinitePay:",
        error
      );

      res.status(500).json({

        error:
          "Erro interno ao criar checkout InfinitePay.",

      });

    }

  }
);


/* =====================================================
   PÁGINA DE PAGAMENTO CONCLUÍDO
===================================================== */

app.get(
  "/pagamento-concluido",
  (req, res) => {

    const {
      receipt_url,
      order_nsu,
      slug,
      capture_method,
      transaction_nsu,
    } = req.query;


    console.log(
      "================================="
    );

    console.log(
      "PAGAMENTO CONCLUÍDO"
    );

    console.log(
      "Order NSU:",
      order_nsu
    );

    console.log(
      "Slug:",
      slug
    );

    console.log(
      "Método:",
      capture_method
    );

    console.log(
      "Transaction NSU:",
      transaction_nsu
    );

    console.log(
      "================================="
    );


    res.send(`
      <!DOCTYPE html>

      <html lang="pt-BR">

      <head>

        <meta charset="UTF-8">

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        >

        <title>
          Pedido confirmado - Vanti Cosméticos
        </title>

        <style>

          body {
            font-family: Arial, sans-serif;
            background: #f8f8f8;
            margin: 0;
            padding: 40px 20px;
            text-align: center;
          }

          .box {
            max-width: 520px;
            margin: 60px auto;
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow:
              0 10px 40px rgba(0,0,0,0.08);
          }

          h1 {
            margin-bottom: 12px;
          }

          p {
            color: #555;
            line-height: 1.6;
          }

          .order {
            margin-top: 24px;
            padding: 16px;
            background: #f5f5f5;
            border-radius: 10px;
            font-size: 14px;
            word-break: break-word;
          }

          a {
            display: inline-block;
            margin-top: 24px;
            background: #ec7404;
            color: white;
            text-decoration: none;
            padding: 14px 24px;
            border-radius: 8px;
            font-weight: bold;
          }

        </style>

      </head>

      <body>

        <div class="box">

          <h1>
            Pagamento recebido!
          </h1>

          <p>
            Obrigado pela sua compra na
            Vanti Cosméticos.
          </p>

          ${
            order_nsu
              ? `
                <div class="order">
                  Pedido:
                  <strong>
                    ${order_nsu}
                  </strong>
                </div>
              `
              : ""
          }

          <p>
            Seu pedido será preparado
            para envio.
          </p>

          ${
            receipt_url
              ? `
                <a
                  href="${receipt_url}"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver comprovante
                </a>
              `
              : ""
          }

        </div>

      </body>

      </html>
    `);

  }
);


/* =====================================================
   WEBHOOK INFINITEPAY
===================================================== */

app.post(
  "/webhook-infinitepay",
  async (req, res) => {

    try {

      const data =
        req.body;


      console.log(
        "================================="
      );

      console.log(
        "WEBHOOK INFINITEPAY RECEBIDO"
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


      /*
       * Neste momento estamos apenas
       * recebendo e registrando a confirmação.
       *
       * Depois podemos conectar isso ao
       * sistema de pedidos da Vanti.
       */


      return res.sendStatus(200);


    } catch (error) {

      console.error(
        "Erro no webhook InfinitePay:",
        error
      );

      return res.sendStatus(400);

    }

  }
);


/* =====================================================
   INICIAR SERVIDOR
===================================================== */

app.listen(
  PORT,
  () => {

    console.log("");

    console.log(
      "================================="
    );

    console.log(
      "🚀 BACKEND VANTI ONLINE"
    );

    console.log(
      `http://localhost:${PORT}`
    );

    console.log(
      "================================="
    );

    console.log("");

    console.log(
      "InfinitePay:"
    );

    console.log(
      INFINITEPAY_HANDLE
    );

    console.log("");

    console.log(
      "Redirect:"
    );

    console.log(
      PAYMENT_SUCCESS_URL
    );

    console.log("");

    console.log(
      "Webhook:"
    );

    console.log(
      INFINITEPAY_WEBHOOK_URL
    );

    console.log("");

  }
);