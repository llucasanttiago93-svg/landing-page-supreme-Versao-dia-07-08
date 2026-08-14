import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = 3001;

app.use(cors());
app.use(express.json());

const MELHOR_ENVIO_URL = "https://sandbox.melhorenvio.com.br";

const CLIENT_ID = process.env.MELHOR_ENVIO_CLIENT_ID;
const CLIENT_SECRET = process.env.MELHOR_ENVIO_CLIENT_SECRET;

const CALLBACK_URL =
  "https://clavicle-legroom-sedative.ngrok-free.dev/melhor-envio/callback";

let accessToken = process.env.MELHOR_ENVIO_ACCESS_TOKEN || null;
let refreshToken = process.env.MELHOR_ENVIO_REFRESH_TOKEN || null;


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

app.get("/melhor-envio/authorize", (req, res) => {

  const scopes = [
    "shipping-calculate",
    "ecommerce-shipping",
  ].join(" ");

  const authorizationUrl =
    `${MELHOR_ENVIO_URL}/oauth/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(CALLBACK_URL)}` +
    `&response_type=code` +
    `&state=vanti-checkout` +
    `&scope=${encodeURIComponent(scopes)}`;

  res.redirect(authorizationUrl);
});


/* =====================================================
   CALLBACK DO MELHOR ENVIO
===================================================== */

app.get("/melhor-envio/callback", async (req, res) => {

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
          grant_type: "authorization_code",
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: CALLBACK_URL,
          code,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {

      console.error("Erro Melhor Envio:", data);

      return res.status(response.status).json(data);
    }

    accessToken = data.access_token;
    refreshToken = data.refresh_token;

    console.log("=================================");
    console.log("MELHOR ENVIO AUTORIZADO!");
    console.log("Access Token recebido.");
    console.log("Refresh Token recebido.");
    console.log("=================================");

    res.send(`
      <h1>Melhor Envio autorizado!</h1>
      <p>A integração Sandbox foi autorizada com sucesso.</p>
      <p>Você já pode fechar esta página.</p>
    `);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Erro ao solicitar token ao Melhor Envio.",
    });

  }

});


/* =====================================================
   COTAÇÃO DE FRETE
===================================================== */

app.post("/api/frete", async (req, res) => {

  try {

    if (!accessToken) {

      return res.status(401).json({
        error: "Melhor Envio ainda não foi autorizado.",
        authorizeUrl: "/melhor-envio/authorize",
      });

    }

    const {
      cepDestino,
      quantidade,
    } = req.body;


    if (!cepDestino) {

      return res.status(400).json({
        error: "CEP de destino não informado.",
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
        postal_code: process.env.ORIGIN_CEP,
      },

      to: {
        postal_code: cepDestino.replace(/\D/g, ""),
      },

      products: [

        {
          id: "queridinho-supreme",

          width: 12,

          height: 5,

          length: 17,

          weight: peso,

          insurance_value: valorProduto,

          quantity: 1,
        },

      ],

    };


    const response = await fetch(
      `${MELHOR_ENVIO_URL}/api/v2/me/shipment/calculate`,
      {

        method: "POST",

        headers: {

          "Authorization": `Bearer ${accessToken}`,

          "Accept": "application/json",

          "Content-Type": "application/json",

          "User-Agent":
            "Vanti Cosméticos (lucasantiago93@gmail.com)",

        },

        body: JSON.stringify(payload),

      }
    );


    const data = await response.json();


    if (!response.ok) {

      console.error(
        "Erro na cotação:",
        JSON.stringify(data, null, 2)
      );

      return res.status(response.status).json(data);

    }


    res.json(data);


  } catch (error) {

    console.error(error);

    res.status(500).json({

      error: "Erro interno ao calcular o frete.",

    });

  }

});


/* =====================================================
   INICIAR SERVIDOR
===================================================== */

app.listen(PORT, () => {

  console.log("");
  console.log("=================================");
  console.log("🚀 BACKEND VANTI ONLINE");
  console.log(`http://localhost:${PORT}`);
  console.log("=================================");
  console.log("");

});