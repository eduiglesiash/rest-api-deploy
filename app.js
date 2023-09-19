const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const cors = require('cors')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')

const app = express()
app.use(express.json())
app.use(
  cors({
    origin: (origin, callback) => {
      // Métodos normales: GET/HEAD/POST
      // Métodos Complejos: PUT/PATCH/DELETE

      // Cors PRE-FLIGHT
      // OPTIONS
      const ACCEPTED_ORIGINS = ['http://localhost:8080', 'http://localhost:1234', 'https://movies.com']

      if (ACCEPTED_ORIGINS.includes(origin) || !origin){
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    }
  })
)
app.disable('x-powered-by')

// Los recursos que sean MOVIES se indentifica con /movies
app.get('/movies', (req, res) => {
  const { genre } = req.query

  if (genre) {
    // const filteredMovies = movies.filter(movie => movie.genre.includes(genre))
    const filteredMovies = movies.some((movie) => movie.genre.toLowercase() === genre.toLocaleLowerCase())
    res.json(filteredMovies)
  }
  // Salida sin filtra
  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  // path-to-regexp
  const { id } = req.params

  const movie = movies.find((movie) => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404), json({ mesage: ' Movies not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    // 422 Unprocessable Entity
    return res.status(422).json({ error: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: crypto.randomUUID(), // uuid v4
    ...result.data
  }

  // Esto no es res porque estamos guardando el estado de la aplicación en memoria
  movies.push(newMovie)

  // Si se crea correctamente se devuelve un status code de 201 y además se devuelve el nuevo item creado
  // Para evitar que se haga una petición con un dato nuevo
  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie Not Found' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex((movie) => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})


// Revisar que el puerto venga siempre por variable de entorno
// Las variables de entorno siempre tienen que ir en mayúscula
const PORT = process.env.PORT ?? 1234
app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})

/* 
IDEMPOTENCIA: 
Propiedad de realizar una acción determinada varias veces y aún así consguier siempre el mismo resutlado que obterndría al hacerlo una vez.

POST => Crear un nuevo elemento en el servidor
PUT => Actualizar totalmente un elemento ya exsistente o crearlo si no existe 
PATCH => Actualizar parcialmente un elemento/recurso

*/
