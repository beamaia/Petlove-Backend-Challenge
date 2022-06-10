const customExpress = require('./config/customExpress')
const connection = require('./database/db')
const express = require('express')

/**
 * Conecta com o servidor backend e cria as tabelas do bd
 */
// connection.connect(erro => {
//     if(erro) {
//         console.log(erro);
//     } else {
//         console.log('Connected successfully');
        

//         app.use('/', express.static(__dirname + '/api/'));
//         app.listen(8080, () => console.log('Servidor Backend, rodando na porta 8080'));
//     }
// })

const app = customExpress();
app.listen(8080, () => {
    console.log('Servidor online na porta', 8080);
})