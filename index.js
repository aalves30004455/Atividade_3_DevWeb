const PORT = 8000
const express = require ('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { response } = require('express')
const app = express()

const newspapers = [
   
    {
        name: 'CarAndDriver',
        adress: 'https://www.caranddriver.com/this-week-in-cars/features/g27271118/best-hybrid-electric-cars',
        base: 'https://www.caranddriver.com'
    },
    {
        name: 'WhatCar',
        adress: 'https://www.whatcar.com/news/the-best-hybrid-cars-in-2021-and-one-to-avoid/n23554',
        base: 'https://www.whatcar.com'
    },
    {
        name: 'carmagazine',
        adress: 'https://www.carmagazine.co.uk/car-reviews/engine-hybrid/',
        base: 'https://www.carmagazine.co.uk'
    },
    {
        name: 'automotiveworld',
        adress: 'https://www.automotiveworld.com/articles/',
        base: 'https://www.automotiveworld.com'
    }

]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.adress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
        
            $('a:contains("hybrid")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name

                })

            })

        })


    
})


app.get('/', (req,res) => {
    res.json('Welcome to my Hybrid news API')
})

app.get('/news', (req,res) => {
    res.json(articles)

})

app.get('/news/:newspaperId', (req,res) => {
    const newspaperId = req.params.newspaperId
    
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].adress
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

   

    
    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("hybrid")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })

            })
            res.json(specificArticles)
        }).catch(err => console.log(err))

})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
