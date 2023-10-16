import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Cancel } from "@mui/icons-material";

const TaskModal = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [editedTask, setEditedTask] = useState({ title: "", description: "" });

    const date = new Date();
    console.log(id);

    function saveDataToLocalStorage(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function getTaskFromLocalStorage() {
        return JSON.parse(localStorage.getItem("tasks"));
    }
    let tasks = getTaskFromLocalStorage();
    let selectedTask = tasks.filter((item) => item.id === id);
    function handleCloseOpenedTask() {
        navigate("/");
    }

    function handleStateChange(e) {
        console.log(e.target.value);
        let updateTask = tasks.map((item) => {
            if (item.id === id) {
                return { ...item, category: e.target.value }
            }
            return item;
        })
        saveDataToLocalStorage(updateTask)
    }

    function handleCloseOpenAreaClick(e) {
        if (e.target.className === 'task-modal') {
            handleCloseOpenedTask();
            // setSelectedTask({});
        }
    }

    function handleTaskTitleChange(e) {
        setEditedTask((task) => ({ ...task, title: e.target.textContent }))
    }

    function handleTaskDescriptionChange(e) {
        setEditedTask((task) => ({ ...task, description: e.target.textContent }))
    }

    function handleSaveAndCloseTask() {
        let updateTaskIndex = tasks.findIndex((item) => item.id === id);
        if (editedTask.title !== "") {
            let tempTask = ({ ...tasks[updateTaskIndex], title: editedTask.title, updatedDate: date.toISOString() });
            tasks[updateTaskIndex] = tempTask;
            saveDataToLocalStorage(tasks);
        }
        if (editedTask.description !== "") {
            let tempTask = ({ ...tasks[updateTaskIndex], description: editedTask.description, updatedDate: date.toISOString() });
            tasks[updateTaskIndex] = tempTask;
            saveDataToLocalStorage(tasks);
        }
        setEditedTask({ ...editedTask, title: "", description: "" })
        handleCloseOpenedTask();
    }

    return (
        <section className="task-modal" onClick={(e) => handleCloseOpenAreaClick(e)}>
            <div className="task-selected-modal">
                <div className="title-icon-task">
                    <span>{selectedTask[0].id}</span>
                    <Cancel className="icon" onClick={handleCloseOpenedTask} />
                </div>
                <div>
                    <p className="modal-task-title" contentEditable={true} onBlur={(e) => handleTaskTitleChange(e)}>{selectedTask[0].title}</p>
                </div>
                <div>
                    <select status="status" id="status" onChange={(e) => { handleStateChange(e) }}>
                        <option value="todo">Todo</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                    </select>
                </div>
                <div className="description-box">
                    <label for="description" className="modal-state">Description </label>
                    <p className="modal-task-desc" contentEditable={true} onBlur={(e) => handleTaskDescriptionChange(e)}>{selectedTask[0].description}</p>
                </div>
                <div className="task-date-btn">
                    <div className="task-date">
                        <span className="date">Created on : {selectedTask[0].createdDate.substr(0, 10)}</span>
                        {selectedTask[0].category === "done" && <span className="date closed-date">Closed on : {selectedTask[0].updatedDate.substr(0, 10)}</span>}
                    </div>
                    <button className="save-task-btn" onClick={handleSaveAndCloseTask}>Save & Close</button>
                </div>
                {/* <p>{selectedTask.description}</p> */}
            </div>
        </section>
    )
}

export default TaskModal;