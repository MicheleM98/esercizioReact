import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Users } from "./users";
import { Articles } from "./articles";
import Navbar from "./components/navbar";
import singleArticle from "./singleArticle";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/users" Component={() => <Users />} />
          <Route path="/articles" Component={() => <Articles />} />
          <Route path="/article/:id" Component={singleArticle} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
