const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const INSTANCE_ID = process.env.INSTANCE_ID;
const TOKEN = process.env.TOKEN;

app.get("/", (req, res) => {
  res.send("Bot online");
});

app.post("/webhook", async (req, res) => {
  try {
    console.log("Webhook recebido:", JSON.stringify(req.body, null, 2));

    const phone = req.body.phone;
    const message = req.body?.text?.message;

    if (!phone || !message) {
      return res.sendStatus(200);
    }

    await axios.post(
      `https://api.z-api.io/instances/${INSTANCE_ID}/token/${TOKEN}/send-text`,
      {
        phone: phone,
        message:
          "Bem-vindo a TC Sports.\n" +
          "Times do Brasil, Europa e selecoes.\n" +
          "Digite o nome do time."
      }
    );

    res.sendStatus(200);
  } catch (err) {
    console.log("Erro:", err.response?.data || err.message);
    res.sendStatus(200);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
