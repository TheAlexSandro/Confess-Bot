const { Telegraf, TelegramError } = require('telegraf')
const { duaGram } = require("duagram")
const propertiesReader = require('properties-reader');
const db = propertiesReader('./path/to/properties.file');
const save = propertiesReader('./path/to/properties.file', {writer: { saveSections: true }});
const token = "5644595503:AAF0QVB1xll7K8NIbrHSXJw6PNfXZXiu0tM"
const user = new duaGram({
    api_id: 15270252,
    api_hash: '5ca33806c55e59c8b60b66363c0cd354',
    // Fill in the session here if you have one, or leave it blank
    session: '1AQAOMTQ5LjE1NC4xNzUuNjABu4kbLTnG7ILeJFHqHj4wO5A8RoDC9XMK4px6kYz86uRqr4WdDc8QmYW79wjf8PxT0TdZTfZMxiDJoeKmQ/8dp7jyoGNaMpuDih+Nl4HqexocA6+jwrSrhRLo+zuo//PHnmAYjknZtpHQkxeZq4wc2RBDO2YtQIXv3nUASWoU3RA0wa2unyZgUIVOBGQSMMqhKN8I+TtvQJpmnfqDRA7ok2Zkd80EyC1Z/dmJV7VbZv03/TsjOov2pUDndcotiIWbzd8j+D2E7hvie0T/Ya4ue/7k1RifLyCgmmo7iSq0ATTMPF+wJa4hrT8/x3s0YWAJngJJG1WJAPU2Nl47my7EuBE=', 
    connectionRetries: 3
})
const bot = new Telegraf(token);

// DATA BOT
const adminBot = 1434949478
const ubot = "ConfesRobot"
const ver = "1.0.1"
const aname = "TheAlexSandro"

// FUNGSI SAJA
function typeCheck(value) {
    const return_value = Object.prototype.toString.call(value);
    // we can also use regex to do this...
    const type = return_value.substring(
        return_value.indexOf(" ") + 1,
        return_value.indexOf("]"));

    return type.toLowerCase();
}

function clearHTML(s) {
    if (!s || typeCheck(s) !== "string") return s
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function getName(ctx) {
    var nn = clearHTML(ctx.message.from.first_name);
    var userID = ctx.message.from.id;
    var uname = ctx.message.from.username;
    if (uname) {
        var ab = "@" + uname
    } else {
        var ab = "<a href='tg://user?id=" + userID + "'>" + nn + "</a>"
    }

    return ab;
}

// PENDETEKSIAN PESAN
bot.on('message', (ctx) => {
    try {
        var chatID = ctx.message.chat.id;

        var pola = /^\/start$/i
        if (pola.exec(ctx.message.text)) {
            var pesan = "Halo 👋 " + getName(ctx) + ", saya ada Confess Bot! Anda dapat mengirim pesan rahasia melalui bot ini untuk crush, teman atau keluarga Anda."
            pesan += "\n\n👉 Bagaimana caranya? Anda cukup menekan perintah /confess lalu ketik pesan dan kirim <b>ID</b> (bukan username) tujuan."
            pesan += "\n\n🤖 Asisten bot ini adalah: @ConfessAssistant"
            var keyb = { inline_keyboard: [[
                { text: 'ℹ️ Tentang', callback_data: 'about_' }
            ]] }

            ctx.replyWithHTML(pesan, { reply_markup: keyb })
            if (ctx.from.id !== adminBot) {
                var psn = "Ada yg akses saya:"
                psn += "\nNama: " + getName(ctx)
                psn += "\nID: <code>" + chatID + "</code>"
                bot.telegram.sendMessage(adminBot, psn, { parse_mode: 'html' })
            }
            return;
        }

        var pola = /^\/confess$/i
        if (pola.exec(ctx.message.text)) {
            var pesan = "❇️ Sekarang, silahkan ketik pesan Anda."
            var keyb = { inline_keyboard: [[
                { text: '❌ Batal', callback_data: 'cancel_confess' }
            ]] }

            ctx.replyWithHTML(pesan, { reply_markup: keyb })
            db.set('ses_name_' + chatID)
            return;
        }

        // SESSION
        var getSesName = db.get('ses_name_' + chatID)
        var getSesTujuan = db.get('ses_tujuan_' + chatID)
        var akhirSession = db.get('ses_akhir_' + chatID)
        var getConffessMsg = save.get('confess_' + chatID)
        var getConffessName = save.get('name_' + chatID)

        if (ctx.message.text) {
            if (getSesName) {
                var txt = clearHTML(ctx.message.text)
                var pesan = "✅ <b>Bagus!</b>\nSekarang, silahkan kirim nama Anda (lebih baik jika di rahasiakan)."
                var keyb = { inline_keyboard: [[
                    { text: '❌ Batal', callback_data: 'cancel_name' }
                ]] }

                ctx.replyWithHTML(pesan, { reply_markup: keyb })
                save.set('confess_' + chatID, txt)
                db.read('ses_name_' + chatID)
                db.set('ses_tujuan_' + chatID, pesan)
                return;
            }

            if (getSesTujuan) {
                var txt = clearHTML(ctx.message.text)
                var pesan = "✅ <b>Ok!</b>\nSekarang, silahkan kirim ID tujuan (ID harus berbentuk angka dan bukan username)."
                pesan += "\nJika tidak tahu cara mendapatkannya silahkan ketik <code>@usinfobot {username}</code>."
                pesan += "\nContoh: <code>@usinfobot @confesrobot</code>"
                pesan += '\nJika sudah, pilih yang bawah, yaitu: "only ID", lalu kirim kesini.'
                var keyb = { inline_keyboard: [[
                    { text: '❌ Batal', callback_data: 'cancel_tujuan' }
                ]] }

                ctx.replyWithHTML(pesan, { reply_markup: keyb })
                save.set('name_' + chatID, txt)
                db.read('ses_tujuan_' + chatID)
                db.set('ses_akhir_' + chatID, pesan)
                return;
            }

            if (akhirSession) {
                var txt = clearHTML(ctx.message.text)
                if (/\p{Number}+/mgu.exec(txt)) {
                    db.read('ses_akhir_' + chatID)
                    var psn = "📥 Halo " + getName(ctx) + ", ada pesan dari seseorang khusus untuk kamu."
                    psn += "\n——————————"
                    psn += "\nPengirim: " + getConffessName
                    psn += "\nIsi pesan:\n" + getConffessMsg
                    psn += "\n——————————"
                    psn += "\n\nIngin seperti ini juga? kirim pesanmu di @ConfesRobot"
                    try {
                        user.sendMessage(txt, psn, { parse_mode: 'html' })
                        ctx.replyWithHTML("✅ Pesan telah terkirim.")
                        save.read('confess_' + chatID)
                        save.read('name_' + chatID)
                        save.set('sudah_send_' + txt)
                    } catch {
                        ctx.reply("⚠️ Gagal mengirim pesan, 'PeerUser' tidak terdeteksi!\nHal ini bisa terjadi karena pengguna dengan ID yang anda kirim menggunakan verifikasi 2 langkah.")
                    }
                    return;
                } else {
                    return ctx.reply('⚠️ ID hanya boleh bertipe angka.')
                }
            }
        } else {
            if (getSesName || getSesTujuan || akhirSession) {
                return ctx.reply('⚠️ Pesan hanya boleh bertipe teks.')
            }
        }
    } catch(e) {
        var err = e.message;
        ctx.reply(err)
    }
    return;
})

bot.on('callback_query', (ctx) => {
    var data = ctx.callbackQuery.data;
    var chatID = ctx.callbackQuery.from.id;
    var cck;

    if (/about_$/i.exec(data)) {
        var pesan = "ℹ️ Tentang bot ini."
        pesan += "\n\n🤖 Versi: " + ver
        pesan += "\n🏗 Dibangun dengan: Nodejs"
        pesan += "\n🧑‍💻 Developer: @" + aname
        pesan += "\n\nBot ini dibuat dengan tujuan memudahkan seseorang yang ingin melakukan menfess di Telegram kepada crush, teman, atau siapapun itu. Bot ini terinspirasi dari bot confess yang ada di WhatsApp."
        var keyb = { inline_keyboard: [[
            { text: '⬅️ Kembali', callback_data: 'start_' }
        ]] }

        ctx.editMessageText(pesan, { reply_markup: keyb, parse_mode: 'html' })
        ctx.answerCbQuery('')
        return;
    }

    if (/start_$/i.exec(data)) {
        var nn = clearHTML(ctx.callbackQuery.from.first_name);
        var userID = ctx.callbackQuery.from.id;
        var uname = ctx.callbackQuery.from.username;
        if (uname) {
            var ab = "@" + uname
        } else {
            var ab = "<a href='tg://user?id=" + userID + "'>" + nn + "</a>"
        }

        var pesan = "Halo 👋 " + ab + ", saya ada Confess Bot! Anda dapat mengirim pesan rahasia melalui bot ini untuk crush, teman atau keluarga Anda."
        pesan += "\n\n👉 Bagaimana caranya? Anda cukup menekan perintah /confess lalu ketik pesan dan kirim <b>ID</b> (bukan username) tujuan."
        pesan += "\n\n🤖 Asisten bot ini adalah: @ConfessAssistant"
        var keyb = { inline_keyboard: [[
            { text: 'ℹ️ Tentang', callback_data: 'about_' }
        ]] }

        ctx.editMessageText(pesan, { reply_markup: keyb, parse_mode: 'html' })
        ctx.answerCbQuery('')
        return;
    }

    if (cck = /cancel_(.+)/i.exec(data)) {
        var dt = cck[1]
        var getSesName = db.get('ses_name_' + chatID)
        var getSesTujuan = db.get('ses_tujuan_' + chatID)
        var akhirSession = db.get('ses_akhir_' + chatID)

        if (dt == 'confess') {
            if (getSesName) {
                var pesan = "✅ Operasi telah dibatalkan."
                ctx.editMessageText(pesan)
                db.read('ses_name_' + chatID)
                return;
            } else {
                var pesan = "🤓 Tidak ada operasi yang sedang berjalan."
                return ctx.editMessageText(pesan)
            }
        }

        if (dt == 'name') {
            if (getSesTujuan) {
                var pesan = "✅ Operasi telah dibatalkan."
                ctx.editMessageText(pesan)
                db.read('ses_tujuan_' + chatID)
                return;
            } else {
                var pesan = "🤓 Tidak ada operasi yang sedang berjalan."
                return ctx.editMessageText(pesan)
            }
        }

        if (dt == 'tujuan') {
            if (akhirSession) {
                var pesan = "✅ Operasi telah dibatalkan."
                ctx.editMessageText(pesan)
                db.read('ses_akhir_' + chatID)
                return;
            } else {
                var pesan = "🤓 Tidak ada operasi yang sedang berjalan."
                return ctx.editMessageText(pesan)
            }
        }
    }
})

user.on('message', (msg) => {
    var sdh = save.get('sudah_send_' + msg.chat.id)

    if (sdh) {
        msg.reply('Terimakasih sudah merespon pesan ini.')
        save.read('sudah_send_' + msg.chat.id)
        return;
    }

    return msg.replyWithHTML('👋 Halo, jika kamu ingin mengirim pesan confess ke crush, teman atau keluarga. Kamu dapat menggunakan @' + ubot)
})

bot.launch()
user.start()