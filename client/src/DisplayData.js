import { useQuery, gql, useLazyQuery } from "@apollo/client"
import { useState } from "react"

const QUERY_ALL_USERS = gql`
    query GetAllUsers {
    users {
        name
        id
        age
        username
        nationality
    }
}
`
const QUERY_ALL_MOVIES = gql`
    query GetAllMovies {
        movies {
            name
            yearOfPublication
            isInTheaters
        }
    }
`

const QUERY_GET_MOVIE_BY_NAME = gql`
    query Movie($name: String!) {
        movie(name: $name) {
            name
            yearOfPublication
            isInTheaters
        }
    }
`

export const DisplayData = () => {
    const [movieSearched, setMovieSearched] = useState("")
    const {data, loading, error} = useQuery(QUERY_ALL_USERS)
    const {data: movieData, loading: movieLoading, error: movieError} = useQuery(QUERY_ALL_MOVIES)
    const [fetchMovie, {data: movieSearchedData, error: MovieError}] = useLazyQuery(QUERY_GET_MOVIE_BY_NAME)
    if(loading) return <h1>Data is Loading...</h1>
    if (data) {
        console.log(data)
    }
    if (error) {
        console.log(error)
    }
    
    if (movieError) {
        console.log(movieError)
    }
    return (
        <>
            <h1>List of users:</h1>
            <div>
                {
                    data && data.users.map((user) => {
                        return(
                            <div key={user.id}>
                                <h1>
                                    Name: {user.name}
                                </h1>
                                <h1>
                                    Username: {user.username}
                                </h1>
                                <h1>
                                    Age: {user.age}
                                </h1>
                                <h1>
                                    Nationality: {user.nationality}
                                </h1>
                            </div>
                        )
                    })
                }
                {
                    movieData && movieData.movies.map((movie) => {
                        return (
                            <h1 key = {movie.name}>Movie name: {movie.name}</h1>
                        )
                    })
                }
                    <div>
                        <input type="text" placeholder="Interstellar" onChange={(event) => {
                            setMovieSearched(event.target.value)
                        }} />
                        <button onClick={() => {
                            fetchMovie({
                                variables: {
                                    name: movieSearched,
                                }
                            })
                        }}>Fetch Data</button>
                        <div>
                            {
                                movieSearchedData && <div>
                                   <h1> Movie: {movieSearchedData.movie.name}</h1>
                                   <h1> Year Of Publication: {movieSearchedData.movie.yearOfPublication}</h1>
                                    </div>
                            }
                        </div>
                    </div>
            </div>
        </>
    )
}