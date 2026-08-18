import express from "express";
import cors from "cors";

import {
  PORT,
} from "./config/config.js";

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

/*
 * Na Hostinger, a porta é fornecida pela variável
 * de ambiente PORT.
 *
 * Quando estivermos rodando localmente, usamos
 * a porta definida no config.js como fallback.
 */

const SERVER_PORT =
  Number(process.env.PORT) || PORT;


/*
 * Escutar em 0.0.0.0 permite que a aplicação
 * receba conexões externas quando estiver hospedada.
 */

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