import "../css/home.css";
import TaskBox from "./TaskBox";

const Home = () => {
    return (
        <section className="header">
            <h1>Kanban Board</h1>
            <div className="search-task">
                <input type="text" placeholder="Search your task...." />
            </div>
            <TaskBox />
        </section>
    )
}

export default Home;