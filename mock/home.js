const data = require('./data.json')

module.exports=[
    {
        url:'/home/list',
        type:'get',
        response:config=>{
            const item =data.items
            return {
                code:20000,
                data
            }
        }
    }
]