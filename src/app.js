const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

function checkChangeLike(request, response, next) {
  const { likes } = request.body;
  if (likes) {
    return response.status(400).json({ likes: 0 });
  }

  return next();
}
app.use(checkChangeLike);
const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repositorie = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositorieIndex = repositories.findIndex((repositorie) => {
    return repositorie.id === id;
  });

  if (repositorieIndex < 0) {
    return response
      .status(400)
      .json({ error: "Não foi possível encontrar o repositório" });
  }
  const repositorie = {
    id,
    title,
    url,
    techs,
  };

  repositories[repositorieIndex] = repositorie;

  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex((repositorie) => {
    return repositorie.id === id;
  });

  if (repositorieIndex < 0) {
    return response
      .status(400)
      .json({ error: "Não foi possível encontrar o repositório" });
  }

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositorieIndex = repositories.findIndex((repositorie) => {
    return repositorie.id === id;
  });

  const repositorie = repositories.find((repositorie) => {
    return repositorie.id === id;
  });

  if (repositorieIndex < 0) {
    return response
      .status(400)
      .json({ error: "Não foi possível encontrar o repositório" });
  }

  repositorie.likes = repositorie.likes + 1;

  repositories[repositorieIndex] = repositorie;

  return response.status(200).json(repositorie);
});

module.exports = app;
