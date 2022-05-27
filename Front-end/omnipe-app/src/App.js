import "./App.css";
import Main from "./components/Main";
import Header from "./components/NavBar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AccountDetatils from "./components/AccountDetatils";

const style = {
  wrapper: `h-screen max-h-screen h-min-screen w-screen bg-gradient-to-r from-cyan-700 to-blue-800 text-white select-none flex flex-col justify-between overflow-hidden `,
};

function App() {
  return (
    <Router>
      <div className={style.wrapper}>
        <Header />
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <Route path="/details">
            <AccountDetatils />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
