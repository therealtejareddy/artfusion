import React, {useContext} from 'react'
import authContext from '../context/authContext'

function Home() {
  let {userData} = useContext(authContext)
  return (
    <pre>{JSON.stringify(userData,undefined,2)}</pre>
  )
}

export default Home
