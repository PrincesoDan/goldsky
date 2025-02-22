# Goldsky Documentation Examples

This repo contains public examples of Goldsky Mirror Pipelines and Subgraphs that are referrenced accross the [Goldsky documentation](https://docs.goldsky.com/)


## Commands Golsky

#### login
goldsky login --token  

#### Secret list 
goldsky secret list

#### Create secret config
goldsky secret create --name TU_SECRETO_POSTGRES --value '{
  "type": "jdbc",
  "protocol": "postgresql",
  "host": "tu.host.db",
  "port": 5432,
  "databaseName": "tuBaseDeDatos",
  "user": "tuUsuario",
  "password": "tuContraseña"
}'

#### Cargar archivo.yaml
goldsky pipeline apply stellar-transactions.yaml --status ACTIVE

#### Monitoreo pipeline
goldsky pipeline monitor stellar-transactions

#### Parar el monitoreo
goldsky pipeline stop stellar-transactions