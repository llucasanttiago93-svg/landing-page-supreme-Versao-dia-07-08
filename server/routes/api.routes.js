import express from "express";

import {
  isAuthorized,
  calculateShipping,
} from "../services/melhorEnvio.service.js";

import {
  criarPagamento,
} from "../services/pagamento.service.js";


const router =
  express.Router();


/* =====================================================
   TESTE DO BACKEND
===================================================== */

router.get(
  "/test",
  (req, res) => {

    res.json({
      success: true,
      message:
        "Backend da Vanti funcionando!",
    });

  }
);


/* =====================================================
   COTAÇÃO DE FRETE
===================================================== */

router.post(
  "/frete",
  async (req, res) => {

    try {

      if (!isAuthorized()) {

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


      const data =
        await calculateShipping({
          cepDestino,
          quantidade,
        });


      res.json(
        data
      );


    } catch (error) {

      console.error(
        "Erro na cotação:",
        error.data || error
      );


      res
        .status(error.status || 500)
        .json(
          error.data || {
            error:
              "Erro interno ao calcular o frete.",
          }
        );

    }

  }
);


/* =====================================================
   CRIAR CHECKOUT INFINITEPAY
===================================================== */

router.post(
  "/pagamento",
  async (req, res) => {

    try {

      const resultado =
        await criarPagamento(
          req.body
        );


      res.json(
        resultado
      );


    } catch (error) {

      console.error(
        "Erro ao criar pagamento:",
        error.data || error
      );


      res
        .status(error.status || 500)
        .json(
          error.data || {
            error:
              "Erro interno ao criar checkout InfinitePay.",
          }
        );

    }

  }
);


export default router;