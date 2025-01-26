import express from 'express'


const app = express();

app.get('/', (req, res) => {
    res.send('hello world')
});

app.listen(5000, () => {
    try {
        console.log('server running ')
    } catch (error) {
        console.log(error)
    }
})