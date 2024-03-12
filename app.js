require("dotenv").config();
const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const { MongoStore } = require("wwebjs-mongo");
const mongoose = require("mongoose");
const qrcode = require("qrcode-terminal");
// const botRoutes = require("./routes/botRoutes");

const app = express();
app.set("view engine", "ejs");
app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const { DB_URI, PORT } = process.env;

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "session",
  }),
});

client.initialize();

let number = 0;

// mongoose.connect(DB_URI)
//   .then(() => {
//   const store = new MongoStore({ mongoose: mongoose });
//   const client = new Client({
//     authStrategy: new RemoteAuth({
//       store: store,
//       backupSyncIntervalMs: 300000,
//     }),
//   });

//   console.log("\nConnected to the DB!")
//   console.log("\nInitializing....");

//  client.on("remote_session_saved", () => {
//    console.log("\nSession Saved!!");
//  });

//   client.initialize();
// }).catch(error => console.log({ error }));

client.on("message", async (message) => {
  await console.log("\n" + message);
  console.log(message.author);
  console.log(`\nMessage received 🙃: ${message.body}`);
});

client.on("message", async (message) => {
  if (message.body === "!ping") {
    await message.reply("You pinged me! yay!!🥲");
  }
});

client.on("message", async (message) => {
  let mess = await message.body;
  mess = mess.split(' ');
  console.log(mess)
  if (mess[0] === '.kick') {
    const chat = await message.getChat();
    let msg = await chat.participants;

    for (i = 0; i < msg.length; i++) {
      let userr = msg[i];
      
      let tagger = userr.id.user + '@c.us';
      if (tagger === message.author) {
        
        if (!userr.isAdmin) {
          await message.reply("You are not an admin!");
        } else {

          try {
            await chat.removeParticipants([mess[1]]);
            await message.reply('User has been kicked! yay 🙂');
            break;
          } catch (err) {
            await message.reply("User not kicked!");
          }

        }
      }
    }
  }
})

client.on("message", async (message) => {
  if (message.body === ".everyone") {
    const chat = await message.getChat();
    let msg = await chat.participants;

    for (i = 0; i < msg.length; i++) {
      let userr = msg[i];
      
      let tagger = userr.id.user + '@c.us';
      if (tagger === message.author) {
        if (!userr.isAdmin) {
          await message.reply("You are not an admin!");
        } else {

          let text = "";
          let mentions = [];

          msg.forEach((member) => {
            mentions.push(`${member.id.user}@c.us`);
            text += `@${member.id.user}\n`;
          });
      
          await message.reply(text, message.from, { mentions });
        }
      }
    }
  }
});

client.on("ready", () => {
  console.log("\nReady to rock!");
});

client.on("qr", (qr) => {
  number += 1;
  console.log(`\nGeneraating QR Code.... ${number}`);
  qrcode.generate(qr, { small: true });
});

app.get("/", (req, res) => {
  return res.render("index");
});

app.post("/genQR", (req, res) => {
  console.log("\nAbout to generate QR code...");
  client.on("qr", async (qr) => {
    number += 1;
    console.log(`\nGeneraating QR Code.... ${number}`);
    qrcode.generate(qr, { small: true });
    const qrcode = await qrcode.generate(qr, { small: true });
    console.log(qrcode);
    res.send(qrcode);
  });
});

// app.listen(PORT, console.log(`Listening to port ${PORT}`));
