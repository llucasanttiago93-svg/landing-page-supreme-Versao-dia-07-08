import express from "express";

import {
  responderComIA,
} from "../services/ia.service.js";


const router =
  express.Router();


/* =====================================================
   TESTE ONLINE DA IA
===================================================== */

router.get(
  "/teste",
  async (req, res) => {

    try {

      const resposta =
        await responderComIA({

          mensagem:
            "Oi! Diga em uma frase para que serve o Queridinho Supreme.",

          historico:
            [],

        });


      return res.json({

        sucesso:
          true,

        resposta,

      });


    } catch (error) {

      console.error(
        "❌ Erro no teste da IA:",
        error
      );


      return res.status(500).json({

        sucesso:
          false,

        erro:
          error.message,

      });

    }

  }
);


/* =====================================================
   CHAT COM A IA
===================================================== */

router.post(
  "/chat",
  async (req, res) => {

    try {

      const {
        mensagem,
        historico,
      } = req.body;


      /* ===============================================
         VALIDAR MENSAGEM
      =============================================== */

      if (
        typeof mensagem !== "string" ||
        !mensagem.trim()
      ) {

        return res.status(400).json({

          error:
            "Mensagem não informada.",

        });

      }


      /* ===============================================
         LIMITAR TAMANHO
      =============================================== */

      if (
        mensagem.length > 2000
      ) {

        return res.status(400).json({

          error:
            "Mensagem muito longa.",

        });

      }


      /* ===============================================
         RESPONDER
      =============================================== */

      const resposta =
        await responderComIA({

          mensagem:
            mensagem.trim(),

          historico:
            Array.isArray(historico)
              ? historico
              : [],

        });


      return res.json({

        resposta,

      });


    } catch (error) {

      console.error(
        "❌ Erro na IA:",
        error
      );


      return res.status(500).json({

        error:
          "Não foi possível responder agora.",

      });

    }

  }
);


export default router;