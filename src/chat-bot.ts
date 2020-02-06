import { Wechaty, log, Contact } from 'wechaty'
import axios from 'axios'


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

            let response = await axios.get('https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5')
            let numbers = JSON.parse(response.data.data)
            
            let totalConfirm = numbers.chinaTotal.confirm
            let totalDead = numbers.chinaTotal.dead
            let totalHeal = numbers.chinaTotal.heal

            let todayChina = `中国确诊：${totalConfirm}
死亡：${totalDead}
治愈：${totalHeal}
时间：${numbers.lastUpdateTime}`

            console.log(todayChina)
            room.say(todayChina)

            let australia = numbers.areaTree.find(item => item.name === "澳大利亚")

            if (australia) {
                let ausConfirm = australia.total.confirm
                let ausDead = australia.total.dead
                let ausHeal = australia.total.heal

                let todayAustralia = `澳洲确诊：${ausConfirm}
死亡：${ausDead}
治愈：${ausHeal}`

                console.log(todayAustralia)
                room.say(todayAustralia)
            }

        }
    }

    const SLEEP = parseInt(process.env.MESSAGE_INTERVAL)
    log.info('Bot', 'I will re-dump contact weixin id & names after %d second... ', SLEEP)
    setTimeout(main, SLEEP * 1000)

}
