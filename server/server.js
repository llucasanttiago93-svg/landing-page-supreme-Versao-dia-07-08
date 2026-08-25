import express from "express";
import cors from "cors";

import {
  PORT,
} from "./config/config.js";

import {
  testarBanco,
} from "./config/database.js";

import apiRoutes from "./routes/api.routes.js";

import melhorEnvioRoutes from "./routes/melhorEnvio.routes.js";

import infinitePayRoutes from "./routes/infinitePay.routes.js";

import blingRoutes from "./routes/bling.routes.js";

import {
  enviarEmailTeste,
} from "./services/email.service.js";


/* =====================================================
   CONFIGURAÇÃO DO SERVIDOR
===================================================== */

const app = express();


/* =====================================================
   PORTA
===================================================== */

const SERVER_PORT =
  Number(process.env.PORT) || PORT;


const SERVER_HOST =
  "0.0.0.0";


/* =====================================================
   MIDDLEWARES
===================================================== */

app.use(
  cors()
);

app.use(
  express.json()
);


/* =====================================================
   ROTAS DA API
===================================================== */

app.use(
  "/api",
  apiRoutes
);


/* =====================================================
   ROTAS DO MELHOR ENVIO
===================================================== */

app.use(
  "/melhor-envio",
  melhorEnvioRoutes
);


/* =====================================================
   ROTAS DO BLING
===================================================== */

app.use(
  "/bling",
  blingRoutes
);


/* =====================================================
   ROTAS DA INFINITEPAY
===================================================== */

app.use(
  "/",
  infinitePayRoutes
);


/* =====================================================
   TESTE DE E-MAIL
===================================================== */

app.get(
  "/teste-email",
  async (req, res) => {

    try {

      await enviarEmailTeste();

      res.json({
        success: true,
        message: "E-mail de teste enviado com sucesso.",
      });

    } catch (error) {

      console.error(
        "❌ ERRO AO ENVIAR E-MAIL DE TESTE"
      );

      console.error(
        error
      );

      res.status(500).json({
        success: false,
        error:
          error?.message ||
          "Erro ao enviar e-mail.",
      });

    }

  }
);


/* =====================================================
   INICIAR SERVIDOR
===================================================== */

async function iniciarServidor() {

  /* ===================================================
     TESTAR MYSQL
  =================================================== */

  try {

    await testarBanco();

  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "❌ ERRO AO CONECTAR AO MYSQL"
    );

    console.error(
      "================================="
    );

    console.error(
      error.message
    );

    console.error(
      "================================="
    );

    /*
     * Não iniciamos o servidor se o banco
     * não estiver disponível.
     */

    process.exit(1);

  }


  /* ===================================================
     INICIAR EXPRESS
  =================================================== */

  app.listen(
    SERVER_PORT,
    SERVER_HOST,
    () => {

      console.log("");

      console.log(
        "================================="
      );

      console.log(
        "🚀 BACKEND VANTI ONLINE"
      );

      console.log(
        `Porta: ${SERVER_PORT}`
      );

      console.log(
        `Host: ${SERVER_HOST}`
      );

      console.log(
        "================================="
      );

    }
  );

}


iniciarServidor();