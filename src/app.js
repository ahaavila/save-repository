const express = require("express");
const { uuid } = require("uuidv4");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);  
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { 
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  // Procuro pela posição do meu repositorio atraves do ID
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  // Se o repositório não existir eu retorno erro
  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' });
  }

  // Recupero os likes que meu repositório tem
  const { likes } = repositories[repositoryIndex];

  // Passo os dados para uma variavel
  const repository = {
    id, 
    title,
    url,
    techs,
    likes,
  }

  // Sobre-escrevo os dados do meu repositorio com os dados da minha variavel repository
  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  // Procuro pela posição do meu repositorio atraves do ID
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  // Se o repositório não existir eu retorno erro
  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' });
  }

  // excluo o repositoryIndex
  repositories.splice(repositoryIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  // Procuro pela posição do meu repositorio atraves do ID
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  // Se o repositório não existir eu retorno erro
  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found!' });
  }

  const { title, url, techs, likes } = repositories[repositoryIndex];

  // const like = likes + 1;

  const repository = {
    id,
    title,
    url,
    techs,
    likes: likes + 1,
  }

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

module.exports = app;
