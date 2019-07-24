const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

function cleanSuperhero(superhero) {
    delete superhero['valid'];
    return superhero;
}

function getSuperhero(index) {
    // console.log(index);
    const superheroesFile = JSON.parse(fs.readFileSync('./superheroes.json', 'utf8'));
    if (index >= superheroesFile.count) {
        console.log('index too big');
        return '{}';
    }
    let retVal = superheroesFile.superheroes[index];
    if (! retVal['valid']){
        console.log('invalid record');
        return '{}';
    }
    // console.log(retVal)
    return cleanSuperhero(retVal);
}

function getSuperheroes() {
    const superheroesFile = JSON.parse(fs.readFileSync('./superheroes.json', 'utf8'));
    // console.log(superheroesFile);
    let superheroes = superheroesFile.superheroes;
    const validSuperheroes = superheroes.filter(superhero => superhero.valid).map(cleanSuperhero);
    // console.log(validSuperheroes);
    return validSuperheroes;
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/superhero/:id', function (req, res) {
        res.send(JSON.stringify(getSuperhero(req.params['id'] - 1)));
    }
);

app.get('/superheroes', (req, res) => res.send(JSON.stringify(getSuperheroes())));



app.post('/', function (req, res) {
    res.send('Got a POST request')
});

app.put('/user', function (req, res) {
    res.send('Got a PUT request at /user')
});

app.delete('/user', function (req, res) {
    res.send('Got a DELETE request at /user')
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
