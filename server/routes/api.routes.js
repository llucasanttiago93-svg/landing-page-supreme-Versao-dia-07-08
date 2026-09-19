import express from "express";
import { rateLimit } from "express-rate-limit";

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
   LIMITADOR DE COTAÇÃO DE FRETE
===================================================== */

const limiteFrete =
  rateLimit({

    // Janela de 10 minutos
    windowMs:
      10 * 60 * 1000,

    // Máximo de 30 cotações por IP
    limit:
      30,

    standardHeaders:
      "draft-8",

    legacyHeaders:
      false,

    message: {

      error:
        "Muitas cotações de frete. Aguarde alguns minutos e tente novamente.",

    },

  });


/* =====================================================
   LIMITADOR DE PAGAMENTO
===================================================== */

const limitePagamento =
  rateLimit({

    // Janela de 10 minutos
    windowMs:
      10 * 60 * 1000,

    // Máximo de 10 tentativas de checkout por IP
    limit:
      10,

    standardHeaders:
      "draft-8",

    legacyHeaders:
      false,

    message: {

      error:
        "Muitas tentativas de pagamento. Aguarde alguns minutos e tente novamente.",

    },

  });


/* =====================================================
   COTAÇÃO DE FRETE
===================================================== */

router.post(
  "/frete",
  limiteFrete,

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
  limitePagamento,

  async (req, res) => {

    try {

      const origin = req.get("origin");

      if (origin?.endsWith(".netlify.app")) {

        return res.status(403).json({

          error:
            "Pagamento desativado na versão demonstrativa.",

        });

      }

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