const todoListEl = document.querySelector("#todo-list");

const form = document.querySelector("form");
const deleteBtn = document.querySelector("#delete-all");

const urlTodos = "https://jsonplaceholder.typicode.com/todos?_start=0&_limit=5";

const saveToLS = (data) => {
  const dataStr = JSON.stringify(data);
  localStorage.setItem("todos", dataStr);
};

const createTodoEL = (todo, newEl) => {
  const todoItemEl = document.createElement("li");
  todoItemEl.textContent = todo.title;
  todoItemEl.classList.add("todo-item");
  todoItemEl.setAttribute("id", todo.id);
  todoItemEl.innerHTML = `
    <label class='taskLabel' id=${"label-" + todo.id}>
        <input type="checkbox" id=${"input-" + todo.id}>
        <h3 class='todo_title'><strong>${todo.id}</strong>${todo.title}</h3>
        <button id="${"edit-" + todo.id}">edit</button>
        <button id="${"remove-" + todo.id}">delete</button>
    </label>

    `;

  if (newEl) {
    todoListEl.prepend(todoItemEl);
  } else {
    todoListEl.append(todoItemEl);
  }

  const input = document.querySelector(`#input-${todo.id}`);
  const label = document.querySelector(`#label-${todo.id}`);
  const remove = document.querySelector(`#remove-${todo.id}`);
  const edit = document.querySelector(`#edit-${todo.id}`);
  if (todo.completed) {
    input.checked = true;
  }
  remove.addEventListener("click", (e) => {
    const currentId = e.currentTarget.id.slice(7);
    // console.log(currentId);
    const date = getData();
    const newDate = date.filter((item) => item.id.toString() !== currentId);

    saveToLS(newDate);
    creatingEl(newDate);
  });
  const labelHandler = function (e) {
    e.preventDefault();
    const currentId = e.currentTarget.id.slice(6);
    const data = getData();
    const newData = data.map((item) => {
      if (item.id.toString() === currentId) {
        return { ...item, completed: !item.completed };
      } else {
        return item;
      }
    });
    saveToLS(newData);
    creatingEl(newData);
  };
  label.addEventListener("click", labelHandler);
  let activestatus = false;
  edit.addEventListener("click", (e) => {
    const currentId = e.target.id.slice(5);
    const date = getData();
    let todoTitle = document.querySelectorAll(".todo_title");
    if (!activestatus) {
      date.forEach((i) => {
        if (currentId == i.id) {
          todoTitle.forEach((j) => {
            if (i.id == j.textContent[0]) {
              j.innerHTML = `<input type='text' class='todo_title' placeholder="edit"id='changed'>`;
            }
          });
        }
      });
      label.removeEventListener("click", labelHandler);
      input.disabled = true;
    } else {
      let changedTitle = document.querySelector(`#changed`);
      let newDate = date.filter((item) => {
        if (currentId == item.id) {
          let newTitle = (item.title = changedTitle.value);
          return {
            newTitle,
          };
        } else {
          return item;
        }
      });
      input.disabled = false;
      saveToLS(newDate);
      creatingEl(newDate);
    }
    activestatus = !activestatus;
  });
};
deleteBtn.addEventListener("click", () => {
  saveToLS("");
  creatingEl("");
});
const creatingEl = (data) => {
  const todoList = document.querySelector("#todo-list");
  todoList.innerHTML = " ";
  data.forEach((todo) => {
    createTodoEL(todo, false);
  });
};

const getData = () => {
  const data = JSON.parse(localStorage.getItem("todos"));
  return data;
};

const getFirstData = () => {
  const data = getData();
  if (data) {
    creatingEl(data);
  }
};
if (!getData() || getData().length ==0) {
  fetch(urlTodos)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      saveToLS(data);
      creatingEl(data);
    })
    .catch((err) => {
      console.log("ss");
    });
}

getFirstData();

form.addEventListener("submit", () => {
  const inputValue = document.getElementById("todo-input");
  const dataLS = getData();
  const newTodo = {
    completed: false,
    id: dataLS.length + 1,
    title: inputValue.value,
    userId: 1,
  };
  const newData = [newTodo, ...dataLS];

  saveToLS(newData);
  createTodoEL(newTodo, true);
  inputValue.value = "";
});
