import { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Routes from "./routes/Routes";

function App() {
    useEffect(() => {
        document.title = "ExamEdu";
    }, []);
    return (
        <Router>
            <Routes />
        </Router>
    );
}

export default App;
