# 🐕‍🦺 Petlove

Trabalho 1 para a disciplina Banco de Dados I, com base no [desafio de backend do Petlove](https://github.com/petlove/vagas/tree/master/backend-ruby) e desenvolvido por [Beatriz Maia](https://github.com/beamaia) e [Sophie Dilhon](https://github.com/AHalic).

## Enunciado 
### Cenário: Você precisa escrever uma aplicação para gestão de animais.
- Pessoas tem animais, e animais tem tipos.
- Uma pessoa tem os atributos nome, documento (CPF), data de nascimento, endereço com número, rua, cidade e CEP e telefone.
- Um animal tem os atributos nome, dono, tipo, data de nascimento e ID único.
- Um tipo de animal tem os atributo nome e ID único.
- Um tipo de serviço tem os atributo nome e ID único.
- Um horário reservardo tem os atributos animal, tipo de serviço, horário e ID único.

### Regras
- Pessoas podem ter vários animais
- Animais só podem pertencer a uma pessoa
- CPFs não podem repetir
- Um horário só pode ser ocupado por um tipo de serviço e animal.

### Questões a serem respondidas
- Qual é o custo médio dos animais do tipo cachorro?
- Quantos cachorros existem no sistema?
- Qual o nome dos donos dos cachorros (Array de nomes)
- Retorne as pessoas ordenando pelo custo que elas tem com os animais (Maior para menor)
- Levando em consideração o custo mensal, qual será o custo de 3 meses de cada pessoa?

# Special thanks

To get started with the docker image, we used [docker-compose-postgres-template](https://github.com/alexeagleson/docker-node-postgres-template) by [alexeagleson](https://github.com/alexeagleson). The repository was very helpful in order to understand more about Docker and Docker-compose. 
