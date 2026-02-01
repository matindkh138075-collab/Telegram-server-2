import fetch from "node-fetch";
import FormData from "form-data";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  const body = Buffer.concat(buffers);

  const form = new FormData();
  form.append("chat_id", process.env.CHAT_ID);
  form.append("photo", body, {
    filename: "photo.jpg",
    contentType: "image/jpeg"
  });

  const tg = await fetch(
    `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendPhoto`,
    { method: "POST", body: form }
  );

  if (!tg.ok) {
    return res.status(500).send("Telegram error");
  }

  res.status(200).send("OK");
}
