import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = 3001;

app.use(cors());
app.use(express.json());


/* =========================================
   TESTE DO BACKEND
========================================= */

app.get("/api/test", (req, res) => {

  res.json({
    success: true,
    message: "Backend Vanti funcionando!",
  });

});


/* =========================================
   FUTURAS INTEGRAÇÕES
========================================= */

// InfinitePay
// Bling
// Webhooks


/* =========================================
   INICIAR SERVIDOR
========================================= */

app.listen(PORT, () => {

  console.log("");
  console.log("===============================");
  console.log("🚀 BACKEND VANTI ONLINE");
  console.log(`http://localhost:${PORT}`);
  console.log("===============================");
  console.log("");

});