const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;
const filePath = './superheroes.json';

function cleanSuperhero(superhero) {
    delete superhero['valid'];
    return superhero;
}

function getSuperhero(index) {
    // console.log(index);
    const superheroesFile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
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
    const superheroesFile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    // console.log(superheroesFile);
    let superheroes = superheroesFile.superheroes;
    const validSuperheroes = superheroes.filter(superhero => superhero.valid).map(cleanSuperhero);
    // console.log(validSuperheroes);
    return validSuperheroes;
}



function addSuperhero(name, alterEgo, power, url) {
    const superheroesFile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const count = superheroesFile.count;
    let superheroes = superheroesFile.superheroes;
    const newSuperhero = {id: count+1, valid: true, name: name, alterEgo: alterEgo, power: power, url: url};
    superheroes.push(newSuperhero);
    const output = JSON.stringify( { count: count+1, superheroes: superheroes} );
    console.log(output);
    const filePath2 = './superheroes2.json';
    fs.writeFile(filePath2, output, err => {
        if (err) {
            console.log('Error writing ' + filePath2, err)
        } else {
            console.log('Successfully wrote' + filePath2)
        }
    });
    return newSuperhero;
}

// see https://stackoverflow.com/questions/44736327/node-js-cors-issue-response-to-preflight-request-doesnt-pass-access-control-c
// and https://github.com/expressjs/cors
app.options('*', cors());   // see https://github.com/expressjs/cors

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/superhero/:id', function (req, res) {
        res.send(JSON.stringify(getSuperhero(req.params['id'] - 1), null, 4));
    }
);

app.get('/superheroes', (req, res) => res.send(JSON.stringify(getSuperheroes())));



app.post('/superhero', function (req, res) {
    console.log(req.query);
    //addSuperhero(req.query['name'], req.query['alterEgo'], req.query['power'], req.query['url']);
    res.json( addSuperhero(req.query['name'], req.query['alterEgo'], req.query['power'], req.query['url']) );
    res.sendStatus(200)

});

app.put('/user', function (req, res) {
    res.send('Got a PUT request at /user')
});

app.delete('/user', function (req, res) {
    res.send('Got a DELETE request at /user')
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`));

