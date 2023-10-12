import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Users } from "./pages/users";
import { Articles } from "./pages/articles";
import Navbar from "./components/navbar";
import SingleArticle from "./pages/single-article";
import SingleUser from "./pages/single-user";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/users" Component={() => <Users />} />
          <Route path="/articles" Component={() => <Articles />} />
          <Route path="/article/:id" Component={() => <SingleArticle />} />
          <Route path="/user/:id" Component={() => <SingleUser />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
