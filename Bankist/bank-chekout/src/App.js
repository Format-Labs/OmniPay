import "./App.css";
import Chekout from "./components/checkout/Modal";
import Page from "./components/Socket/Page";
import { TransactionProvider } from "./context/GContext";

function App() {
  return (
    <div className="App">
      <TransactionProvider>
        <Chekout />
      </TransactionProvider>
    </div>
  );
}

export default App;
