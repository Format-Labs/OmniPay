import "./App.css";
import Main from "./components/Main";
import Header from "./components/NavBar";

const style = {
  wrapper: `h-screen max-h-screen h-min-screen w-screen bg-gradient-to-r from-cyan-700 to-blue-800 text-white select-none flex flex-col justify-between`,
};

function App() {
  return (
    <div className={style.wrapper}>
      <Header />;
      <Main />;
    </div>
  );
}

export default App;
