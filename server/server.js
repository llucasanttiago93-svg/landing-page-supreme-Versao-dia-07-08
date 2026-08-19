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
   ROTAS DA INFINITEPAY
===================================================== */

app.use(
  "/",
  infinitePayRoutes
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