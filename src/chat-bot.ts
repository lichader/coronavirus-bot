import { Wechaty, log, Contact } from 'wechaty'
import QrcodeTerminal from 'qrcode-terminal'
import {Request} from "request"


const bot = Wechaty.instance()

bot.on('login', async function (this, user) {
        log.info('Bot', `${user.name()} logined`)
        await this.say('wechaty contact-bot just logined')

        /**
         * Main Contact Bot start from here
         */
        await main()

    })
    .on('logout', user => log.info('Bot', `${user.name()} logouted`))
    .on('error', e => log.info('Bot', 'error: %s', e))
    .on('scan', (qrcode, status) => console.log(`Scan QR Code to login: ${status}\nhttps://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrcode)}`))


bot.start()
    .catch(async e => {
        log.error('Bot', 'init() fail: %s', e)
        await bot.stop()

        process.exit(1)
    })

/**
 * Main Contact Bot
 */
async function main() {
    const firstTime = await bot.Room.findAll()

    log.info('Bot', '#######################')
    log.info('Bot', 'Found %d rooms\n', firstTime.length)

    log.info('Bot', 'warm up complete. Start second time looking up')

    const roomName = process.env.ROOM_NAME
    log.info('Bot', `Search ${roomName}`)

    const roomList = await bot.Room.findAll()
    log.info('Bot', 'Found %d rooms\n', roomList.length)

    for (let i = 0; i < roomList.length; i++) {
        const room = roomList[i]
        const topic = await room.topic()

        if (topic.includes(roomName)){
            log.info('Bot', `found the room ${room.id}`)

            log.info('Bot', 'Start getting numbers')
            
            // room.say("Hello")
        }
    }

    const SLEEP = parseInt(process.env.INTERVAL)
    log.info('Bot', 'I will re-dump contact weixin id & names after %d second... ', SLEEP)
    setTimeout(main, SLEEP * 1000)

}
