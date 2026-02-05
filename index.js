const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const INSTANCE_ID = process.env.INSTANCE_ID;
const ZAPI_TOKEN = process.env.ZAPI_TOKEN;
const ZAPI_URL = process.env.ZAPI_URL || "https://api.z-api.io";

const instanceBase = `${ZAPI_URL}/instances/${INSTANCE_ID}/token/${ZAPI_TOKEN}`;

app.get("/", (req, res) => {
  res.send("ONLINE");
});

app.post("/webhook", async (req, res) => {
  try {
    // responde rápido pro webhook não ficar pendurado
    res.sendStatus(200);

    console.log("WEBHOOK RECEBIDO:");
    console.log(JSON.stringify(req.body, null, 2));

    // formato que costuma vir da Z-API:
    const phone = req.body.phone;
    const msg = req.body?.text?.message;

    // ignora se não tiver mensagem
    if (!phone || !msg) {
      console.log("Sem phone ou msg. Ignorando.");
      return;
    }

    // ignora mensagens enviadas por você (pra não loopar)
    if (req.body.fromMe === true) {
      console.log("Mensagem fromMe=true. Ignorando.");
      return;
    }

    const reply = `Recebi: ${msg}\n\nDigite 1 para Times\nDigite 2 para Selecoes`;

    // envia resposta
    const r = await axios.post(`${instanceBase}/send-text`, {
      phone: phone,
      message: reply
    });

    console.log("Resposta enviada. Status:", r.status);
    console.log("Retorno:", JSON.stringify(r.data, null, 2));
  } catch (err) {
    console.log("ERRO AO RESPONDER:");
    console.log(err?.response?.status, err?.response?.data || err.message);
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Rodando na porta", PORT));

