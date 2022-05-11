import { useQuery, gql, useLazyQuery, useMutation } from "@apollo/client"
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

const CREATE_USER_MUTATION = gql`
    mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
            name
            id
        }
    }
`
const DELETE_USER_MUTATION = gql`
   mutation($deleteUserId: ID!) {
    deleteUser(id: $deleteUserId) {
        id
    }
}
`

export const DisplayData = () => {
    const [movieSearched, setMovieSearched] = useState("")

    // CreateUser states
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [age, setAge] = useState(0)
    const [nationality, setNationality] = useState("")
    const [idToDelete, setIdToDelete] = useState("")

    const {data, loading, refetch} = useQuery(QUERY_ALL_USERS)
    const {data: movieData, loading: movieLoading, error: movieError} = useQuery(QUERY_ALL_MOVIES)
    const [fetchMovie, {data: movieSearchedData, error: MovieError}] = useLazyQuery(QUERY_GET_MOVIE_BY_NAME)
    const [createUser] = useMutation(CREATE_USER_MUTATION)
    const [deleteUser] = useMutation(DELETE_USER_MUTATION)

    if(loading) return <h1>Data is Loading...</h1>
  
    return (
        <>
            <h1>List of users:</h1>
            <div>
                <div>
                    <input type="text" placeholder="name" onChange={(event) => {
                            setName(event.target.value)
                        }} />
                    <input type="text" placeholder="username" onChange={(event) => {
                            setUsername(event.target.value)
                        }} />
                    <input type="number" placeholder="age" onChange={(event) => {
                            setAge(Number(event.target.value))
                        }}/>
                    <input type="text" placeholder="nationality" onChange={(event) => {
                            setNationality(event.target.value.toUpperCase())
                        }} />
                    <button onClick={() => {
                        createUser({variables: {
                            input:{
                                name,
                                username,
                                age,
                                nationality
                            }
                        }})
                        refetch()
                    }}>Create User</button>
                </div>
                <h1>Delete user</h1>
                <div>
                    <input type="text" placeholder="id to delete" onChange={(e) => {
                        setIdToDelete(e.target.value)
                    }}/>
                    <button onClick={() => {
                        deleteUser({variables: {deleteUserId: idToDelete}})
                        refetch()
                    }}>Delete User</button>
                </div>
                {
                    data && data.users.map((user) => {
                        return(
                            <div key={user.id}>
                                <h1>
                                    Id: {user.id}
                                </h1>
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