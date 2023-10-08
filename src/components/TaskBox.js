import "../css/taskbox.css";
import { AddCircle, Cancel, MoreHorizOutlined } from '@mui/icons-material';
import { useState, useEffect } from "react";

const TaskBox = () => {
    const [modalState, setModalState] = useState(false);
    const [taskData, setTaskData] = useState([]);
    const [checkError, setCheckError] = useState({});
    const [modalTask, setTaskModalState] = useState(false);
    const [selectedTask, setSelectedTask] = useState({});
    const [editedTask, setEditedTask] = useState({ title: "", description: "" });

    const date = new Date();

    function saveDataToLocalStorage(tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function handleTaskModal() {
        setModalState(true);
    }

    function handleCloseModal() {
        setModalState(false);
        setCheckError({})
    }

    function handleModalClickArea(e) {
        if (e.target.className === 'task-modal') {
            setModalState(false);
            setCheckError({})
        }
    }

    function validateForm(title, desc) {
        let newErrors = {};
        if (!title) {
            newErrors.title = "*Title should be required";
        }
        else if (title.length > 40) {
            newErrors.title = "*Title should not me more than 40 characters"
        }
        if (!desc) {
            newErrors.description = "*Description should be required"
        }
        setCheckError(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    function getTaskFromLocalStorage() {
        return JSON.parse(localStorage.getItem("tasks"));
    }

    function handleSubmitForm(e) {
        e.preventDefault();
        const { title, description } = e.target.elements;
        const isForm = validateForm(title.value, description.value);
        console.log(isForm);
        let items = getTaskFromLocalStorage();
        let newId = parseInt(items[items.length - 1].id.substr(5)) + 1;

        if (isForm) {
            const date = new Date();
            const newTask = {
                id: `TASK-${newId.toString().padStart(3, '0')}`,
                title: title.value,
                description: description.value,
                category: "todo",
                createdDate: date.toISOString(),
                updatedDate: date.toISOString()
            };

            // Update the task data array with the new task
            const updatedTasks = [...taskData, newTask];
            setTaskData(updatedTasks);

            // Save the updated tasks to local storage
            saveDataToLocalStorage(updatedTasks);

            handleCloseModal();
        }

    }
    function handleCloseOpenedTask() {
        setTaskModalState(false);
        setSelectedTask({});
    }
    function handleCloseOpenAreaClick(e) {
        if (e.target.className === 'task-modal') {
            setTaskModalState(false);
            setSelectedTask({});
        }
    }
    useEffect(() => {
        // Load tasks from local storage when the component mounts
        const date = new Date();
        const taskArray = [
            {
                id: "TASK-001",
                title: "Example 1",
                description: "You can enter your description",
                category: "todo",
                createdDate: date.toISOString(),
                updatedDate: date.toISOString()
            }
        ];

        const storedTasks = JSON.parse(localStorage.getItem("tasks")) || taskArray;
        setTaskData(storedTasks);
        saveDataToLocalStorage(storedTasks);
    }, []);


    let taskItems = taskData || [];

    function openTaskDetails(task) {
        setTaskModalState(true);
        setSelectedTask({
            id: task.id,
            title: task.title,
            category: task.category,
            description: task.description,
            createdDate: task.createdDate,
            updatedDate: date.toISOString()
        })
    }
    function handleStateChange(e) {
        console.log(e.target.value);
        let updateTaskIndex = taskItems.findIndex((item) => item.title === selectedTask.title);
        taskItems[updateTaskIndex].category = e.target.value;
        console.log(taskItems[updateTaskIndex]);
        saveDataToLocalStorage(taskItems)
    }
    function handleTaskTitleChange(e) {
        setEditedTask((task) => ({ ...task, title: e.target.textContent }))
    }

    function handleTaskDescriptionChange(e) {
        setEditedTask((task) => ({ ...task, description: e.target.textContent }))
    }
    function handleSaveAndCloseTask() {
        let updateTaskIndex = taskItems.findIndex((item) => item.title === selectedTask.title);
        if (editedTask.title !== "") {
            let tempTask = ({ ...taskItems[updateTaskIndex], title: editedTask.title, updatedDate: date.toISOString() });
            taskItems[updateTaskIndex] = tempTask;
            saveDataToLocalStorage(taskItems);
        }
        if (editedTask.description !== "") {
            let tempTask = ({ ...taskItems[updateTaskIndex], description: editedTask.description, updatedDate: date.toISOString() });
            taskItems[updateTaskIndex] = tempTask;
            saveDataToLocalStorage(taskItems);
        }
        setEditedTask({ ...editedTask, title: "", description: "" })
        handleCloseOpenedTask();
    }

    let todoTasks = taskItems.filter((item) => item.category === "todo");
    let inprogressTasks = taskItems.filter((item) => item.category === "inprogress");
    let doneTasks = taskItems.filter((item) => item.category === "done");
    return (
        <>
            <section className="task">
                <div className="task-board" id="todo">
                    <div className="todo-task">
                        <h2>TO DO📜</h2>
                        <AddCircle className="icon" onClick={handleTaskModal} />
                    </div>
                    {todoTasks.map((item) =>
                    (<div className="task-item" onClick={() => openTaskDetails(item)}>
                        {item.category === "todo" ?
                            <div className="title-icon">
                                <p>{item.title}</p>
                                <MoreHorizOutlined />
                            </div>
                            : ""}
                    </div>))}
                </div>
                <div className="task-board" id="inProgress">
                    <h2>IN PROGRESS⏳</h2>
                    {inprogressTasks.map((item) =>
                    (<div className="task-item" onClick={() => openTaskDetails(item)}>
                        {item.category === "inprogress" ?
                            <div className="title-icon">
                                <p>{item.title}</p>
                                <MoreHorizOutlined />
                            </div>
                            : ""}
                    </div>))}
                </div>
                <div className="task-board" id="done">
                    <h2>DONE✅</h2>
                    {doneTasks.map((item) =>
                    (<div className="task-item task-done" onClick={() => openTaskDetails(item)}>
                        {item.category === "done" ? <div className="title-icon">
                            <p>{item.title}</p>
                            <MoreHorizOutlined />
                        </div> : ""}
                    </div>))}
                </div>
            </section>
            {modalState && (
                <section className="task-modal" onClick={handleModalClickArea}>
                    <div className="task-card">
                        <div>
                            <h3>Create Task</h3>
                            <Cancel onClick={handleCloseModal} className="icon" />
                        </div>
                        <form onSubmit={handleSubmitForm}>
                            <label htmlFor="title">Title</label>
                            <input type="text" placeholder="Enter task title" title="title" id="title" autoFocus />
                            {checkError.title && <p className="error">{checkError.title}</p>}
                            <label htmlFor="description">Description</label>
                            <textarea type="text" placeholder="Enter task description" name="description" id="description" />
                            {checkError.description && <p className="error">{checkError.description}</p>}
                            <div className="form-btn">
                                <button type="submit" className="create-btn">Create Task</button>
                                <button type="reset" className="reset-btn">Reset</button>
                            </div>
                        </form>
                    </div>
                </section>
            )}

            {modalTask && (
                <section className="task-modal" onClick={(e) => handleCloseOpenAreaClick(e)}>
                    <div className="task-selected-modal">
                        <div className="title-icon-task">
                            <span>{selectedTask.id}</span>
                            <Cancel className="icon" onClick={handleCloseOpenedTask} />
                        </div>
                        <div>
                            <p className="modal-task-title" contentEditable={true} onBlur={(e) => handleTaskTitleChange(e)}>{selectedTask.title}</p>
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
                            <p className="modal-task-desc" contentEditable={true} onBlur={(e) => handleTaskDescriptionChange(e)}>{selectedTask.description}</p>
                        </div>
                        <div className="task-date-btn">
                            <div className="task-date">
                                <span className="date">Created on : {selectedTask.createdDate.substr(0, 10)}</span>
                                {selectedTask.category === "done" && <span className="date closed-date">Closed on : {selectedTask.updatedDate.substr(0, 10)}</span>}
                            </div>
                            <button className="save-task-btn" onClick={handleSaveAndCloseTask}>Save & Close</button>
                        </div>
                        {/* <p>{selectedTask.description}</p> */}
                    </div>
                </section>
            )}
        </>
    );
}

export default TaskBox; 