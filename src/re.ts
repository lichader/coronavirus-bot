import axios from 'axios'

axios.get('https://view.inews.qq.com/g2/getOnsInfo?name=disease_h5')
    .then((response) => {
        console.log(JSON.parse(response.data.data))

        let stats = JSON.parse(response.data.data)

        console.log(stats.areaTree)
    })
