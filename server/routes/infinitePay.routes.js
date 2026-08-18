import express from "express";

import {
  pagamentoConcluido,
} from "../controllers/pagamentoConcluido.controller.js";

import {
  webhookInfinitePay,
} from "../controllers/webhook.controller.js";


const router =
  express.Router();


/* =====================================================
   PÁGINA DE PAGAMENTO CONCLUÍDO
===================================================== */

router.get(
  "/pagamento-concluido",
  pagamentoConcluido
);


/* =====================================================
   WEBHOOK INFINITEPAY
===================================================== */

router.post(
  "/webhook-infinitepay",
  webhookInfinitePay
);


export default router;