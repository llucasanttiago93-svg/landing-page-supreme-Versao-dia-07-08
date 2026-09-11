import express from "express";
import { rateLimit } from "express-rate-limit";

import {
  responderComIA,
} from "../services/ia.service.js";


const router =
  express.Router();


/* =====================================================
   LIMITADOR DE REQUISIÇÕES DA IA
===================================================== */

const limiteIA =
  rateLimit({

    // Janela de 10 minutos
    windowMs:
      10 * 60 * 1000,

    // Máximo de 20 mensagens por IP
    limit:
      20,

    // Headers modernos de rate limit
    standardHeaders:
      "draft-8",

    // Não utilizar os headers antigos
    legacyHeaders:
      false,

    // Resposta quando ultrapassar o limite
    message: {

      error:
        "Muitas mensagens enviadas. Aguarde alguns minutos e tente novamente.",

    },

  });


/* =====================================================
   CHAT COM A IA
===================================================== */

router.post(
  "/chat",
  limiteIA,

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
         LIMITAR TAMANHO DA MENSAGEM
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
         VALIDAR E LIMITAR HISTÓRICO
      =============================================== */

      let historicoSeguro = [];


      if (
        Array.isArray(historico)
      ) {

        historicoSeguro =
          historico
            .filter(
              (item) =>
                item &&
                typeof item === "object"
            )
            .slice(-12)
            .map(
              (item) => ({

                role:
                  typeof item.role === "string"
                    ? item.role
                    : "",

                content:
                  typeof item.content === "string"
                    ? item.content.slice(0, 1000)
                    : "",

              })
            )
            .filter(
              (item) =>
                item.content.trim()
            );

      }


      /* ===============================================
         LIMITAR TAMANHO TOTAL DO HISTÓRICO
      =============================================== */

      let totalCaracteres =
        0;


      historicoSeguro =
        historicoSeguro.filter(
          (item) => {

            const tamanho =
              item.content.length;


            if (
              totalCaracteres + tamanho >
              6000
            ) {

              return false;

            }


            totalCaracteres +=
              tamanho;


            return true;

          }
        );


      /* ===============================================
         RESPONDER
      =============================================== */

      const resposta =
        await responderComIA({

          mensagem:
            mensagem.trim(),

          historico:
            historicoSeguro,

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