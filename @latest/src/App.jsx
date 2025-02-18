import React from 'react'
import Search from './components/Search.jsx'

const App = () => {
  const [searchTerm, setSearchTerm] = React.useState('')
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header className="">
          <img src="./hero.png" alt="Heor Banner" />
          <h1>Find <span className="text-gradient">Movies</span>You'll Enjoy Without the Hassle</h1>
        </header>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <h2>{searchTerm}</h2>
      </div>

    </main>
  )
}

export default App