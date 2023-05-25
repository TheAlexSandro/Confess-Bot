const { Telegraf, TelegramError } = require('telegraf')
const { duaGram } = require("duagram")
const propertiesReader = require('properties-reader');
const db = propertiesReader('./path/to/properties.file');
const save = propertiesReader('./path/to/properties.file', {writer: { saveSections: true }});
const token = "5644595503:AAF0QVB1xll7K8NIbrHSXJw6PNfXZXiu0tM"
const user = new duaGram({
    api_id: 'idk',
    api_hash: 'idk',
    // Fill in the session here if you have one, or leave it blank
    session: 'idk', 
    connectionRetries: 3
})
const bot = new Telegraf(token);

// DATA BOT
const adminBot = 'idk'
const ubot = "idk"
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

function cbGetName(ctx) {
    var nn = clearHTML(ctx.callbackQuery.from.first_name);
    var userID = ctx.callbackQuery.from.id;
    var uname = ctx.callbackQuery.from.username;
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
        var langID = save.get('lang_id_' + chatID)
        var langEN = save.get('lang_en_' + chatID)
        var noLang = save.get('set_lang_' + chatID)

        if (!noLang) {
            var pesan = "🇬🇧 Please chosee your language first before using this bot."
            pesan += "\n🇮🇩 Pilih bahasa Anda terlebih dahulu sebelum menggunakan bot ini."
            var keyb = { inline_keyboard: [[
                { text: '🇬🇧 English', callback_data: 'lang_start_en' },
                { text: '🇮🇩 Indonesia', callback_data: 'lang_start_id' }
            ]] }

            return ctx.replyWithHTML(pesan, { reply_markup: keyb })
        }

        var pola = /^\/start$/i
        if (pola.exec(ctx.message.text)) {
            if (!langEN) {
                var pesan = "👋 Hello " + getName(ctx) + ", I am a Confess Bot! You can send secret messages through this bot to your crush, friends or family."
                pesan += "\n\n👉 How to? You simply press the /confess command then type a message and send the destination <b>ID</b> (not username)."
                pesan += "\n\n🤖 This bot assistant is: @ConfessAssistant"
                var keyb = { inline_keyboard: [[
                    { text: '🇬🇧 Lang', callback_data: 'lang_start_select' },
                    { text: 'ℹ️ About', callback_data: 'about_' }
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

            if (!langID) {
                var pesan = "👋 Halo " + getName(ctx) + ", saya adalah Confess Bot! Anda dapat mengirim pesan rahasia melalui bot ini untuk crush, teman atau keluarga Anda."
                pesan += "\n\n👉 Bagaimana caranya? Anda cukup menekan perintah /confess lalu ketik pesan dan kirim <b>ID</b> (bukan username) tujuan."
                pesan += "\n\n🤖 Asisten bot ini adalah: @ConfessAssistant"
                var keyb = { inline_keyboard: [[
                    { text: '🇮🇩 Lang', callback_data: 'lang_start_select' },
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
        }

        var pola = /^\/confess$/i
        if (pola.exec(ctx.message.text)) {
            if (!langEN) {
                var pesan = "❇️ Now, please type your message."
                var keyb = { inline_keyboard: [[
                    { text: '❌ Cancel', callback_data: 'cancel_confess' }
                ]] }

                ctx.replyWithHTML(pesan, { reply_markup: keyb })
                db.set('ses_name_' + chatID)
                return;
            }

            if (!langID) {
                var pesan = "❇️ Sekarang, silahkan ketik pesan Anda."
                var keyb = { inline_keyboard: [[
                    { text: '❌ Batal', callback_data: 'cancel_confess' }
                ]] }

                ctx.replyWithHTML(pesan, { reply_markup: keyb })
                db.set('ses_name_' + chatID)
                return;
            }
        }

        var pola = /^\/settings$/i
        if (pola.exec(ctx.message.text)) {
            if (!langEN) {
                var pesan = "⚙️ The following settings are available, please choose which one you want to change."
                var keyb = { inline_keyboard: [[
                    { text: '🇬🇧 Language', callback_data: 'lang_select' }
                ]] }
    
                ctx.replyWithHTML(pesan, { reply_markup: keyb })
                return;
            }
    
            if (!langID) {
                var pesan = "⚙️ Berikut pengaturan yang tersedia, silakan pilih mana yang ingin Anda ubah."
                var keyb = { inline_keyboard: [[
                    { text: '🇮🇩 Language', callback_data: 'lang_select' }
                ]] }
    
                ctx.replyWithHTML(pesan, { reply_markup: keyb })
                return;
            }
        }

        // SESSION
        var getSesName = db.get('ses_name_' + chatID)
        var getSesTujuan = db.get('ses_tujuan_' + chatID)
        var akhirSession = db.get('ses_akhir_' + chatID)
        var getConffessMsg = save.get('confess_' + chatID)
        var getConffessName = save.get('name_' + chatID)

        if (ctx.message.text) {
            if (!langEN) {
                if (getSesName) {
                    var txt = clearHTML(ctx.message.text)
                    var pesan = "✅ <b>Good!</b>\nNow, please send your name (better if it is kept secret)."
                    var keyb = { inline_keyboard: [[
                        { text: '❌ Cancel', callback_data: 'cancel_name' }
                    ]] }
    
                    ctx.replyWithHTML(pesan, { reply_markup: keyb })
                    save.set('confess_' + chatID, txt)
                    db.read('ses_name_' + chatID)
                    db.set('ses_tujuan_' + chatID, pesan)
                    return;
                }
    
                if (getSesTujuan) {
                    var txt = clearHTML(ctx.message.text)
                    var pesan = "✅ <b>Ok!</b>\nNow, please send the destination ID (ID must be a number and not a username)."
                    pesan += "\nIf you don't know how to get it, please type <code>@usinfobot {username}</code>."
                    pesan += "\nContoh: <code>@usinfobot @confesrobot</code>"
                    pesan += '\nIf so, select the one below, namely: "only ID", then send it here.'
                    var keyb = { inline_keyboard: [[
                        { text: '❌ Cancel', callback_data: 'cancel_tujuan' }
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
                        var psn = "📥 Hello " + getName(ctx) + ", there is a message from someone special for you."
                        psn += "\n——————————"
                        psn += "\nSender: " + getConffessName
                        psn += "\nMessage content\n" + getConffessMsg
                        psn += "\n——————————"
                        psn += "\n\nWant like this too? send your message at @ConfesRobot"
                        try {
                            user.sendMessage(txt, psn, { parse_mode: 'html' })
                            ctx.replyWithHTML("✅ Message have been sent.")
                            save.read('confess_' + chatID)
                            save.read('name_' + chatID)
                            save.set('sudah_send_' + txt)
                        } catch {
                            ctx.reply("⚠️ Failed to send message, 'PeerUser' not detected!\nThis can happen because the user with the ID you submitted uses 2-step verification.")
                        }
                        return;
                    } else {
                        return ctx.reply('⚠️ ID can only be of type number.')
                    }
                }
            }

            if (!langID) {
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
                    var txt = ctx.message.text
                    if (/\p{Number}+/mgu.exec(txt)) {
                        db.read('ses_akhir_' + chatID)
                        var psn = "📥 Halo " + getName(ctx) + ", ada pesan dari seseorang khusus untuk kamu."
                        psn += "\n——————————"
                        psn += "\nPengirim: " + getConffessName
                        psn += "\nIsi pesan:\n" + getConffessMsg
                        psn += "\n——————————"
                        psn += "\n\nIngin seperti ini juga? kirim pesanmu di @ConfesRobot"
                        try {
                            var jss = {
                                "peer": {
                                  "type": "user",
                                  "id": "" + txt + ""
                                },
                                "from": {
                                  "id": "" + txt + "",
                                  "apply_min_photo": true,
                                  "first_name": "Bot",
                                  "username": "" + ubot + ""
                                },
                                "id": 3451,
                                "in": true,
                                "date": 1667309769,
                                "text": "" + txt + "",
                                "chat": {
                                  "id": "" + txt + "",
                                  "apply_min_photo": true,
                                  "first_name": "Bot",
                                  "username": "" + txt + ""
                                },
                                "event": []
                            }
                            user.sendMessage(jss, psn, { parse_mode: 'html' })
                            ctx.replyWithHTML("✅ Pesan telah terkirim.")
                            save.read('confess_' + chatID)
                            save.read('name_' + chatID)
                            save.set('sudah_send_' + txt)
                        } catch(e) {
                            bot.telegram.sendMessage(chatID, "❌ Failed to send message to user! Userbot error, cannot find property 'peerUser' of  undefined.")
                        }
                        return;
                    } else {
                        return ctx.reply('⚠️ ID hanya boleh bertipe angka.')
                    }
                }
            }
        } else {
            if (getSesName || getSesTujuan || akhirSession) {
                if (!langEN) {
                    return ctx.reply('⚠️ Messages can only be of text type.')
                }

                if (!langID) {
                    return ctx.reply('⚠️ Pesan hanya boleh bertipe teks.')
                }
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
    var langID = save.get('lang_id_' + chatID)
    var langEN = save.get('lang_en_' + chatID)
    var noLang = save.get('set_lang_' + chatID)
    var cck;

    if (cck = /lang_(.+)/i.exec(data)) {
        var txt = cck[1]

        if (txt == 'start_en') {
            ctx.answerCbQuery('✅ Language successfully set to English.')
            var pesan = "👋 Hello " + cbGetName(ctx) + ", I am a Confess Bot! You can send secret messages through this bot to your crush, friends or family."
            pesan += "\n\n👉 How to? You simply press the /confess command then type a message and send the destination <b>ID</b> (not username)."
            pesan += "\n\n🤖 This bot assistant is: @ConfessAssistant"
            var keyb = { inline_keyboard: [[
                { text: '🇬🇧 Lang', callback_data: 'lang_start_select' },
                { text: 'ℹ️ About', callback_data: 'about_' }
            ]] }

            ctx.editMessageText(pesan, { reply_markup: keyb, parse_mode: 'html' })
            ctx.answerCbQuery('')
            save.set('lang_id_' + chatID)
            save.read('lang_en_' + chatID)
            save.set('set_lang_' + chatID)
            return;
        }

        if (txt == 'start_id') {
            ctx.answerCbQuery('✅ Bahasa berhasil di atur ke Indonesia.')
            var pesan = "👋 Halo " + cbGetName(ctx) + ", saya adalah Confess Bot! Anda dapat mengirim pesan rahasia melalui bot ini untuk crush, teman atau keluarga Anda."
            pesan += "\n\n👉 Bagaimana caranya? Anda cukup menekan perintah /confess lalu ketik pesan dan kirim <b>ID</b> (bukan username) tujuan."
            pesan += "\n\n🤖 Asisten bot ini adalah: @ConfessAssistant"
            var keyb = { inline_keyboard: [[
                { text: '🇮🇩 Lang', callback_data: 'lang_start_select' },
                { text: 'ℹ️ Tentang', callback_data: 'about_' }
            ]] }

            ctx.editMessageText(pesan, { reply_markup: keyb, parse_mode: 'html' })
            ctx.answerCbQuery('')
            save.set('lang_en_' + chatID)
            save.read('lang_id_' + chatID)
            save.set('set_lang_' + chatID)
            return;
        }

        if (!noLang) {
            return ctx.answerCbQuery("🇬🇧 Please chosee your language first before using this bot.\n\n🇮🇩 Pilih bahasa Anda terlebih dahulu sebelum menggunakan bot ini.", { show_alert: true })
        }

        if (txt == 'select') {
            if (!langEN) {
                var ab = "🔘"
                var bc = "Return"
                var cbb = "has_set"
            } else {
                var ab = ""
                var bc = "Return"
                var cbb = "lang_set_en"
            }

            if (!langID) {
                var tc = "🔘"
                var bc = "Kembali"
                var cbc = "has_set"
            } else {
                var tc = ""
                var bc = "Kembali"
                var cbc = "lang_set_id"
            }

            var pesan = "🇬🇧 Please select the language you want to use."
            pesan += "\n🇮🇩 Silahkan pilih bahasa yang ingin Anda gunakan."
            var keyb = { inline_keyboard: [[
                { text: "🇬🇧 English " + ab, callback_data: cbb },
                { text: "🇮🇩 Indonesia " + tc, callback_data: cbc }
            ],
            [
                { text: '⬅️ ' + bc, callback_data: 'settings_' }
            ]] }

            ctx.editMessageText(pesan, { reply_markup: keyb, parse_mode: 'html' })
            ctx.answerCbQuery('')
            return;
        }

        if (txt == 'set_en') {
            var keyb = { inline_keyboard: [[
                { text: "🇬🇧 English 🔘", callback_data: 'has_set' },
                { text: "🇮🇩 Indonesia", callback_data: 'lang_set_id' }
            ],
            [
                { text: '⬅️ Return', callback_data: 'settings_' }
            ]] }

            ctx.editMessageReplyMarkup(keyb)
            ctx.answerCbQuery('')
            save.set('lang_id_' + chatID)
            save.read('lang_en_' + chatID)
            return;
        }

        if (txt == 'set_id') {
            var keyb = { inline_keyboard: [[
                { text: "🇬🇧 English", callback_data: 'lang_Set_en' },
                { text: "🇮🇩 Indonesia 🔘", callback_data: 'has_set' }
            ],
            [
                { text: '⬅️ Kembali', callback_data: 'settings_' }
            ]] }

            ctx.editMessageReplyMarkup(keyb)
            ctx.answerCbQuery('')
            save.set('lang_en_' + chatID)
            save.read('lang_id_' + chatID)
            return;
        }

        // LANG_START_SELECT
        if (txt == 'start_select') {
            if (!langEN) {
                var ab = "🔘"
                var bc = "Return"
                var cbb = "has_set"
            } else {
                var ab = ""
                var bc = "Return"
                var cbb = "lang_start_set_en"
            }

            if (!langID) {
                var tc = "🔘"
                var bc = "Kembali"
                var cbc = "has_set"
            } else {
                var tc = ""
                var bc = "Kembali"
                var cbc = "lang_start_set_id"
            }

            var pesan = "🇬🇧 Please select the language you want to use."
            pesan += "\n🇮🇩 Silahkan pilih bahasa yang ingin Anda gunakan."
            var keyb = { inline_keyboard: [[
                { text: "🇬🇧 English " + ab, callback_data: cbb },
                { text: "🇮🇩 Indonesia " + tc, callback_data: cbc }
            ],
            [
                { text: '⬅️ ' + bc, callback_data: 'start_' }
            ]] }

            ctx.editMessageText(pesan, { reply_markup: keyb, parse_mode: 'html' })
            ctx.answerCbQuery('')
            return;
        }

        if (txt == 'start_set_en') {
            var keyb = { inline_keyboard: [[
                { text: "🇬🇧 English 🔘", callback_data: 'has_set' },
                { text: "🇮🇩 Indonesia", callback_data: 'lang_start_set_id' }
            ],
            [
                { text: '⬅️ Return', callback_data: 'start_' }
            ]] }

            ctx.editMessageReplyMarkup(keyb)
            ctx.answerCbQuery('')
            save.set('lang_id_' + chatID)
            save.read('lang_en_' + chatID)
            return;
        }

        if (txt == 'start_set_id') {
            var keyb = { inline_keyboard: [[
                { text: "🇬🇧 English", callback_data: 'lang_start_set_en' },
                { text: "🇮🇩 Indonesia 🔘", callback_data: 'has_set' }
            ],
            [
                { text: '⬅️ Kembali', callback_data: 'start_' }
            ]] }

            ctx.editMessageReplyMarkup(keyb)
            ctx.answerCbQuery('')
            save.set('lang_en_' + chatID)
            save.read('lang_id_' + chatID)
            return;
        }
    }

    if (!noLang) {
        return ctx.answerCbQuery("🇬🇧 Please chosee your language first before using this bot.\n\n🇮🇩 Pilih bahasa Anda terlebih dahulu sebelum menggunakan bot ini.", { show_alert: true })
    }

    if (/about_$/i.exec(data)) {
        if (!langEN) {
            var pesan = "ℹ️ About this bot."
            pesan += "\n\n🤖 Version: " + ver
            pesan += "\n🏗 Built with: Nodejs"
            pesan += "\n🧑‍💻 Developer: @" + aname
            pesan += "\n\nThis bot was created with the aim of making it easier for someone who wants to confess on Telegram to their crush, friend, or whoever. This bot is inspired by the confess bot on WhatsApp."
            var keyb = { inline_keyboard: [[
                { text: '⬅️ Return', callback_data: 'start_' }
            ]] }

            ctx.editMessageText(pesan, { reply_markup: keyb, parse_mode: 'html' })
            ctx.answerCbQuery('')
            return;
        }

        if (!langID) {
            var pesan = "ℹ️ Tentang bot ini."
            pesan += "\n\n🤖 Versi: " + ver
            pesan += "\n🏗 Dibangun dengan: Nodejs"
            pesan += "\n🧑‍💻 Developer: @" + aname
            pesan += "\n\nBot ini dibuat dengan tujuan memudahkan seseorang yang ingin melakukan confess di Telegram kepada crush, teman, atau siapapun itu. Bot ini terinspirasi dari bot confess yang ada di WhatsApp."
            var keyb = { inline_keyboard: [[
                { text: '⬅️ Kembali', callback_data: 'start_' }
            ]] }

            ctx.editMessageText(pesan, { reply_markup: keyb, parse_mode: 'html' })
            ctx.answerCbQuery('')
            return;
        }
    }

    if (/start_$/i.exec(data)) {
        if (!langEN) {
            var pesan = "Hello 👋 " + cbGetName(ctx) + ", I am a Confess Bot! You can send secret messages through this bot to your crush, friends or family."
            pesan += "\n\n👉 How to? You simply press the /confess command then type a message and send the destination <b>ID</b> (not username)."
            pesan += "\n\n🤖 This bot assistant is: @ConfessAssistant"
            var keyb = { inline_keyboard: [[
                { text: '🇬🇧 Lang', callback_data: 'lang_start_select' },
                { text: 'ℹ️ About', callback_data: 'about_' }
            ]] }

            ctx.editMessageText(pesan, { reply_markup: keyb, parse_mode: 'html' })
            ctx.answerCbQuery('')
            return;
        }

        if (!langID) {
            var pesan = "Halo 👋 " + cbGetName(ctx) + ", saya adalah Confess Bot! Anda dapat mengirim pesan rahasia melalui bot ini untuk crush, teman atau keluarga Anda."
            pesan += "\n\n👉 Bagaimana caranya? Anda cukup menekan perintah /confess lalu ketik pesan dan kirim <b>ID</b> (bukan username) tujuan."
            pesan += "\n\n🤖 Asisten bot ini adalah: @ConfessAssistant"
            var keyb = { inline_keyboard: [[
                { text: '🇮🇩 Lang', callback_data: 'lang_start_select' },
                { text: 'ℹ️ Tentang', callback_data: 'about_' }
            ]] }

            ctx.editMessageText(pesan, { reply_markup: keyb, parse_mode: 'html' })
            ctx.answerCbQuery('')
            return;
        }
    }

    if (cck = /cancel_(.+)/i.exec(data)) {
        var dt = cck[1]
        var getSesName = db.get('ses_name_' + chatID)
        var getSesTujuan = db.get('ses_tujuan_' + chatID)
        var akhirSession = db.get('ses_akhir_' + chatID)

        if (!langEN) {
            if (getSesName || getSesTujuan || akhirSession) {
                var pesan = "✅ The operation successfully cancelled."
                ctx.editMessageText(pesan)
                db.read('ses_name_' + chatID)
                db.read('ses_tujuan_' + chatID)
                db.read('ses_akhir_' + chatID)
                return;
            } else {
                var pesan = "🤓 There is no operation are running."
                return ctx.editMessageText(pesan)
            }
        }

        if (!langID) {
            if (getSesName || getSesTujuan || akhirSession) {
                var pesan = "✅ Operasi telah dibatalkan."
                ctx.editMessageText(pesan)
                db.read('ses_name_' + chatID)
                db.read('ses_tujuan_' + chatID)
                db.read('ses_akhir_' + chatID)
                return;
            } else {
                var pesan = "🤓 Tidak ada operasi yang sedang berjalan."
                return ctx.editMessageText(pesan)
            }
        }
    }

    if (/settings_$/i.exec(data)) {
        if (!langEN) {
            var pesan = "⚙️ The following settings are available, please choose which one you want to change."
            var keyb = { inline_keyboard: [[
                { text: '🇬🇧 Language', callback_data: 'lang_select' }
            ]] }

            ctx.editMessageText(pesan, { reply_markup: keyb, parse_mode: 'html' })
            ctx.answerCbQuery('')
            return;
        }

        if (!langID) {
            var pesan = "⚙️ Berikut pengaturan yang tersedia, silakan pilih mana yang ingin Anda ubah."
            var keyb = { inline_keyboard: [[
                { text: '🇮🇩 Language', callback_data: 'lang_select' }
            ]] }

            ctx.editMessageText(pesan, { reply_markup: keyb, parse_mode: 'html' })
            ctx.answerCbQuery('')
            return;
        }
    }

    if (/has_set$/i.exec(data)) {
        return ctx.answerCbQuery('')
    }
})

user.on('message', (msg) => {
    var sdh = save.get('sudah_send_' + msg.chat.id)

    if (/^\/js$/i.exec(msg.text)) {
        //if (msg.from.id == adminBot) {
            var js = JSON.stringify(msg, null, 2)
            user.sendMessage(msg, "<code>" + js + "</code>", { parse_mode: 'html' })
        //}
    }

    if (sdh) {
        msg.reply('Thank you for responding to this message..')
        save.read('sudah_send_' + msg.chat.id)
        return;
    } else {
        return msg.replyWithHTML('👋 Hello, if you want to send a confession message to your crush, friends or family. You can use @' + ubot)
    }
})

bot.launch()
user.start()
