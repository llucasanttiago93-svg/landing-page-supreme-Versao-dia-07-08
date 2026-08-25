import express from "express";

import {
  getAuthorizationUrl,
  authorizeWithCode,
} from "../services/melhorEnvio.service.js";


const router =
  express.Router();


/* =====================================================
   AUTORIZAÇÃO MELHOR ENVIO
===================================================== */

router.get(
  "/authorize",
  (req, res) => {

    try {

      const authorizationUrl =
        getAuthorizationUrl();


      res.redirect(
        authorizationUrl
      );


    } catch (error) {

      console.error(
        "Erro ao gerar autorização Melhor Envio:",
        error
      );


      res.status(500).json({

        error:
          "Erro ao iniciar autorização do Melhor Envio.",

      });

    }

  }
);


/* =====================================================
   CALLBACK DO MELHOR ENVIO
===================================================== */

router.get(
  "/callback",
  async (req, res) => {

    const {
      code,
      error,
    } = req.query;


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

      await authorizeWithCode(
        code
      );


      console.log(
        "================================="
      );

      console.log(
        "MELHOR ENVIO AUTORIZADO!"
      );

      console.log(
        "Access Token recebido."
      );

      console.log(
        "Refresh Token recebido."
      );

      console.log(
        "================================="
      );


      res.send(`
        <h1>Melhor Envio autorizado!</h1>
        <p>A integração do Melhor Envio foi autorizada com sucesso.</p>
        <p>Você já pode fechar esta página.</p>
      `);


    } catch (error) {

      console.error(
        "Erro Melhor Envio:",
        error.data || error
      );


      res
        .status(error.status || 500)
        .json(
          error.data || {
            error:
              "Erro ao solicitar token ao Melhor Envio.",
          }
        );

    }

  }
);


export default router;