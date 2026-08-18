import dotenv from "dotenv";

dotenv.config();


/* =====================================================
   TESTE DAS VARIÁVEIS DE AMBIENTE
===================================================== */

console.log("=================================");
console.log("TESTE DAS VARIÁVEIS DE AMBIENTE");

console.log(
  "PUBLIC_BASE_URL:",
  process.env.PUBLIC_BASE_URL
);

console.log(
  "MELHOR_ENVIO_CLIENT_ID:",
  process.env.MELHOR_ENVIO_CLIENT_ID
);

console.log(
  "ORIGIN_CEP:",
  process.env.ORIGIN_CEP
);

console.log("=================================");


/* =====================================================
   SERVIDOR
===================================================== */

const PORT = 3001;


/* =====================================================
   MELHOR ENVIO
===================================================== */

const MELHOR_ENVIO_URL =
  "https://sandbox.melhorenvio.com.br";

const CLIENT_ID =
  process.env.MELHOR_ENVIO_CLIENT_ID;

const CLIENT_SECRET =
  process.env.MELHOR_ENVIO_CLIENT_SECRET;

const PUBLIC_BASE_URL =
  process.env.PUBLIC_BASE_URL;

const CALLBACK_URL =
  `${PUBLIC_BASE_URL}/melhor-envio/callback`;


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


/* =====================================================
   URLS PÚBLICAS
===================================================== */

const PAYMENT_SUCCESS_URL =
  `${PUBLIC_BASE_URL}/pagamento-concluido`;

const INFINITEPAY_WEBHOOK_URL =
  `${PUBLIC_BASE_URL}/webhook-infinitepay`;


/* =====================================================
   EXPORTAÇÕES
===================================================== */

export {
  PORT,

  MELHOR_ENVIO_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  CALLBACK_URL,

  accessToken,
  refreshToken,

  INFINITEPAY_URL,
  INFINITEPAY_HANDLE,

  PUBLIC_BASE_URL,
  PAYMENT_SUCCESS_URL,
  INFINITEPAY_WEBHOOK_URL,
};