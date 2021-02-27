const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

(async () => { //criacao de um bloco asyncrono, fazendo possivel a gente criar varias coisas assim, god demais tho, faz com que a API espere a conexão para ai sim rodar

  const url = 'mongodb://localhost:27017';

  const dbName = 'Ocean_DataBase_03_02_2021';

  console.info('Conectando ao banco de dados MongoDB...');

  const client = await MongoClient.connect(url);

  const db = client.db(dbName);

  console.info('MongoDB conectado com sucesso!');

  const app = express();

  app.use(bodyParser.json());

  const port = 3000;

  const mensagens = db.collection('Mensagens');

  app.get('/', (req, res) => {
      res.send('Hello World');
  });

    // Criar (Create)
  app.post('/mensagens', async (req,res) =>{
    const mensagem = req.body;

    await mensagens.insertOne(mensagem);

    res.send('Mensagem criada com sucesso.');
  });

  //Leitura dos dados (Read all)
  app.get('/mensagens', async (req, res) => {
      res.send(await mensagens.find().toArray());
  });

  //Ler Individual (Read Single)
  app.get('/mensagens/:id', async (req, res) => {
    const id = req.params.id;

    const mensagem = await mensagens.findOne({ _id: ObjectId(id) });
    
    res.send(mensagem);
  });

  // Atualizar/editar uma mensagem já existente (Update)
  app.put('/mensagens/:id', async (req, res) => {
    const id = req.params.id;

    const mensagem = req.body;

    await mensagens.updateOne(
      { _id: ObjectId(id) },
      { 
          $set: {
          ...mensagem
        }
      }
    );

    res.send('Mensagem Editada com Sucesso.');
  });

  // Remoção (Delete)
  app.delete('/mensagens/:id', async (req, res) => {
    const id = req.params.id;

    await mensagens.deleteOne({ _id: ObjectId(id) });

    res.send('Mensagem Removida com sucesso.')
  });

  app.listen(port, () => {
    console.info('Servidor rodando em http://localhost:' + port);
  });

})();