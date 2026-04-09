
import React from "react";
import { useEffect, useState } from "react";
import "./App.css";

const API_ENDPOINT = "http://localhost:4000/";

const allMoviesQuery = `
  query {
    movies {
      id
      title
      director {
        name
      }
    }
    directors {
      id
      name
    }
  }
`;

const moviesByDirectorQuery = (directorId) => `
  query {
    getMoviesByDirector(directorId: "${directorId}") {
      id
      title
      director {
        name
      }
    }
  }
`;

export default function App() {
  const [movies, setMovies] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [title, setTitle] = useState("");
  const [directorId, setDirectorId] = useState("");

  const fetchAllMovies = async () => {
    const res = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: allMoviesQuery
      })
    });
    const data = await res.json();
    setMovies(data.data.movies);
    setDirectors(data.data.directors);
  };

  const fetchMoviesByDirector = async (directorId) => {
    const res = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: moviesByDirectorQuery(directorId)
      })
    });

    const data = await res.json();
    setMovies(data.data.getMoviesByDirector);
    setDirectors(data.data.getMoviesByDirector.map(m => m.director));
  };

  const addMovie = async () => {
    await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation {
            addMovie(title: "${title}", directorId: "${directorId}") {
              id
            }
          }
        `
      })
    });

    setTitle("");
    fetchAllMovies();
  };

  useEffect(() => {
    fetchAllMovies();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Movies</h2>
      <table className="movies-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Director</th>
          </tr>
        </thead>
        <tbody>
          {movies.map(m => (
            <tr key={m.id}>
              <td>{m.title}</td>
              <td>{m.director?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <ul>
        {movies.map(m => (
          <li key={m.id}>
            {m.title} - {m.director?.name}
          </li>
        ))}
      </ul> */}

      <h2>Add Movie</h2>
      <input
        placeholder="Movie Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <select onChange={e => setDirectorId(e.target.value)}>
        <option>Select Director</option>
        {directors.map(d => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <button onClick={addMovie}>Add</button>
    </div>
  );
}
