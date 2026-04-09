
const { gql } = require("apollo-server");
const fs = require("fs");

const DB_FILE = __dirname + "/data.json";

const readDB = () => JSON.parse(fs.readFileSync(DB_FILE));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

const typeDefs = gql`
  type Movie {
    id: ID!
    title: String!
    director: Director
  }

  type Director {
    id: ID!
    name: String!
    movies: [Movie]
  }

  type Query {
    movies: [Movie]
    directors: [Director]
    getMoviesByDirector(directorId: ID!): [Movie]
  }

  type Mutation {
    addMovie(title: String!, directorId: ID!): Movie
  }
`;

const resolvers = {
  Query: {
    movies: () => readDB().movies,
    directors: () => readDB().directors,
    getMoviesByDirector: (_, { directorId }) => {
      const db = readDB();
      return db.movies.filter(m => m.directorId === directorId);
    }
  },

  Movie: {
    director: (parent) => {
      const db = readDB();
      return db.directors.find(d => d.id === parent.directorId);
    }
  },

  Director: {
    movies: (parent) => {
      const db = readDB();
      return db.movies.filter(m => m.directorId === parent.id);
    }
  },

  Mutation: {
    addMovie: (_, { title, directorId }) => {
      const db = readDB();

      const newMovie = {
        id: String(Date.now()),
        title,
        directorId
      };

      db.movies.push(newMovie);
      writeDB(db);

      return newMovie;
    }
  }
};

module.exports = { typeDefs, resolvers };
