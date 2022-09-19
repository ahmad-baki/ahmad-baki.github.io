import EntryPage from './components/EntryPage';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from './components/HomePage';
import "./styles/App.css"


function App() {
  return(
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/entry/:id" element={<EntryPage newEntry={false}/>}/>
        <Route path="/new_entry/:id" element={<EntryPage newEntry={true}/>}/>
        <Route path="/" element={<HomePage/>}/>
      </Routes>
    </BrowserRouter>
    </>
  );
}
export default App;
