import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Users } from './users'
import { Articles } from './articles'
import Navbar from './components/navbar'

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/users' Component={() => <Users />} />
          <Route path='/articles' Component={() => <Articles />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}
export default App