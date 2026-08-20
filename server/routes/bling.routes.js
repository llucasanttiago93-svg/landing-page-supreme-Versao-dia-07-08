import express from "express";

import {
  getAuthorizationUrl,
  exchangeCodeForToken,
  saveTokens,
  testBlingApi,
} from "../services/bling.service.js";


const router =
  express.Router();


/* =====================================================
   INICIAR AUTORIZAÇÃO DO BLING
===================================================== */

router.get(
  "/authorize",
  (req, res) => {

    try {

      const authorizationUrl =
        getAuthorizationUrl();


      console.log(
        "================================="
      );

      console.log(
        "🔐 INICIANDO AUTORIZAÇÃO BLING"
      );

      console.log(
        "REDIRECIONANDO PARA:"
      );

      console.log(
        authorizationUrl
      );

      console.log(
        "================================="
      );


      return res.redirect(
        authorizationUrl
      );


    } catch (error) {

      console.error(
        "❌ ERRO AO INICIAR AUTORIZAÇÃO BLING"
      );

      console.error(
        error
      );


      return res
        .status(500)
        .json({

          success:
            false,

          error:
            "Não foi possível iniciar a autorização do Bling.",

        });

    }

  }
);


/* =====================================================
   CALLBACK DO BLING
===================================================== */

router.get(
  "/callback",
  async (req, res) => {

    try {

      const {
        code,
        error,
        error_description,
      } = req.query;


      /* =================================================
         BLING RETORNOU ERRO
      ================================================= */

      if (error) {

        console.error(
          "================================="
        );

        console.error(
          "❌ BLING RETORNOU ERRO"
        );

        console.error(
          "ERROR:",
          error
        );

        console.error(
          "DESCRIPTION:",
          error_description
        );

        console.error(
          "================================="
        );


        return res
          .status(400)
          .send(`

            <html>

              <head>
                <meta charset="UTF-8">
                <title>Erro Bling</title>
              </head>

              <body>

                <h1>Erro na autorização do Bling</h1>

                <p>
                  ${error}
                </p>

                <p>
                  ${
                    error_description ||
                    ""
                  }
                </p>

              </body>

            </html>

          `);

      }


      /* =================================================
         VALIDAR CODE
      ================================================= */

      if (!code) {

        console.error(
          "❌ Callback do Bling sem code."
        );


        return res
          .status(400)
          .send(`

            <html>

              <head>
                <meta charset="UTF-8">
                <title>Erro Bling</title>
              </head>

              <body>

                <h1>Erro na autorização</h1>

                <p>
                  O Bling não enviou o código de autorização.
                </p>

              </body>

            </html>

          `);

      }


      console.log(
        "================================="
      );

      console.log(
        "🔐 CALLBACK BLING RECEBIDO"
      );

      console.log(
        "CODE RECEBIDO"
      );

      console.log(
        "================================="
      );


      /* =================================================
         TROCAR CODE POR TOKENS
      ================================================= */

      const tokenData =
        await exchangeCodeForToken(
          code
        );


      console.log(
        "================================="
      );

      console.log(
        "✅ TOKENS RECEBIDOS DO BLING"
      );

      console.log(
        "================================="
      );


      /* =================================================
         SALVAR TOKENS
      ================================================= */

      await saveTokens(
        tokenData
      );


      /* =================================================
         TESTAR API
      ================================================= */

      let testeApi = null;


      try {

        testeApi =
          await testBlingApi();

      } catch (error) {

        console.error(
          "⚠️ Tokens salvos, mas teste da API falhou."
        );

        console.error(
          error.message
        );

      }


      /* =================================================
         RESPOSTA
      ================================================= */

      return res
        .status(200)
        .send(`

          <html>

            <head>

              <meta
                charset="UTF-8"
              >

              <title>
                Bling autorizado
              </title>

              <style>

                body {

                  font-family:
                    Arial,
                    sans-serif;

                  display:
                    flex;

                  align-items:
                    center;

                  justify-content:
                    center;

                  min-height:
                    100vh;

                  margin:
                    0;

                  background:
                    #f5f5f5;

                }

                .box {

                  background:
                    white;

                  padding:
                    40px;

                  border-radius:
                    12px;

                  text-align:
                    center;

                  box-shadow:
                    0 4px 20px
                    rgba(
                      0,
                      0,
                      0,
                      0.10
                    );

                }

                h1 {

                  color:
                    #16a34a;

                }

              </style>

            </head>


            <body>

              <div class="box">

                <h1>
                  ✅ Bling autorizado!
                </h1>

                <p>
                  A autorização foi concluída
                  com sucesso.
                </p>

                <p>
                  Os tokens foram salvos
                  no banco de dados.
                </p>

                <p>
                  Agora podemos conectar
                  os pedidos ao Bling.
                </p>

              </div>

            </body>

          </html>

        `);


    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "❌ ERRO NO CALLBACK BLING"
      );

      console.error(
        "================================="
      );

      console.error(
        "Mensagem:",
        error.message
      );

      console.error(
        "Status:",
        error.status
      );

      console.error(
        "Dados:",
        error.data
      );

      console.error(
        "================================="
      );


      return res
        .status(
          error.status ||
          500
        )
        .json({

          success:
            false,

          error:
            "Erro ao concluir autorização do Bling.",

          details:
            error.data ||
            error.message,

        });

    }

  }
);


/* =====================================================
   TESTAR BLING
===================================================== */

router.get(
  "/test",
  async (req, res) => {

    try {

      const data =
        await testBlingApi();


      return res.json({

        success:
          true,

        message:
          "API do Bling funcionando.",

        data,

      });


    } catch (error) {

      console.error(
        "❌ ERRO NO TESTE BLING"
      );

      console.error(
        error
      );


      return res
        .status(
          error.status ||
          500
        )
        .json({

          success:
            false,

          error:
            error.message,

          details:
            error.data ||
            null,

        });

    }

  }
);


export default router;