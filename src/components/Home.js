import "../css/home.css";
import TaskBox from "./TaskBox";
import { useState } from "react";
import { CancelOutlined, InfoOutlined } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Home = () => {
    const taskFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));
    const [filter, setFilter] = useState([]);
    const [taskClear, setTaskClear] = useState("");
    // const [taskProp, setTaskProp] = useState({});


    function clearSearchInput() {
        setFilter([]);
        setTaskClear("");
    }
    function handleSearchInput(event) {
        let userInput = event.target.value;
        let filteredTask
        console.log(userInput);
        if (event.target.value.length > 2) {
            filteredTask = taskFromLocalStorage.filter((item) => item.title.toLowerCase().includes(userInput.toLowerCase()));
            setFilter(filteredTask);
        }
        // let filteredTask = taskFromLocalStorage.filter((item) => item.title.toLowerCase().includes(userInput));
    }

    let debounceTimer;
    const debounceSearch = (e) => {
        clearTimeout(debounceTimer);
        setTaskClear(e.target.value);
        debounceTimer = setTimeout(() => { handleSearchInput(e) }, 1500);
    }


    return (
        <section className="header">
            <h1>Kanban Board</h1>
            <div className="search-task">
                <input type="text" placeholder="Search your task...." value={taskClear} onChange={(e) => debounceSearch(e)} />
                {taskClear && <CancelOutlined className="clear-search icon" onClick={clearSearchInput} />}
            </div>
            {taskClear !== "" ?
                <div className="search-result-container">
                    {filter.length > 0 && taskClear.length > 2 ?
                        <div>
                            <p className="task-result">Results found {filter.length}</p>
                            <hr />
                            {filter.map((item) =>
                                <Link to={`/tasks/${item.id}`} className="search-input-link"><div className="search-result">
                                    <p>{item.title}</p>
                                    <hr />
                                </div></Link>)
                            }
                        </div>
                        : taskClear.length < 3 ?
                            <div className="search-info">
                                <span>Please enter atleast three words</span>
                                <InfoOutlined />
                            </div>
                            :
                            <span className="search-info">No results found☹️</span>}
                </div> : ""}
            <TaskBox />
        </section>
    )
}

export default Home;