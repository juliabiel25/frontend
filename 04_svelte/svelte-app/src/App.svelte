<script>
  import { onMount, onDestroy } from 'svelte';	

  import axios from 'axios';

  const config = {
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  };
  const api = axios.create({
    baseURL: 'http://localhost:4000/api'
  });

  let todos = [];
  let tab = 'all';
  let newTodo = '';

  const updateTodos = async () => {
    const response = await api.get('/todos');
    console.log('updating todos: ', response.data);
    todos = response.data;
  };

  const handleAdd = async () => {
    const data = {
      text: newTodo,
      done: false
    };
    const newTodos = await api
      .post('/todos', data, config)
      .then(result => result?.data)
      .catch(error => console.error(error));

    newTodo = '';
    todos = newTodos;
    console.log('todos after add:', newTodos);
  };

  const handleToggleDone = async todo => {
    const data = {
      done: !todo.done
    };
    const newTodos = await api
      .post(`/todos/done/${todo._id}`, data, config)
      .then(result => result?.data)
      .catch(error => console.error(error));

    newTodo = '';
    todos = newTodos;
    console.log('todos after toggle done:', newTodos);
  };

  const handleDelete = async todo => {
    const newTodos = await api
      .delete(`/todos/${todo._id}`, config)
      .then(result => result?.data)
      .catch(error => console.error(error));

    todos = newTodos;
    console.log('todos after delete:', newTodos);
  };

  onMount(updateTodos);
  onDestroy(() => {
    // Clean up any necessary resources
  });

  const isTaskInTab = (todo, tab) => {
    if (tab === 'done' && !todo.done) return false;
    if (tab === 'todo' && todo.done) return false;
    return true;
  };
</script>

<style>
  .nav {
    display: flex;
    justify-content: center;
  }

  .task-done {
    color: gray;
    text-decoration: line-through;
  }

  .checkbox {
    display: flex;
    justify-content: space-between;
  }

</style>

<div class="container">
  <div class="jumbotron text-center">
    <h1>
      nodeTODO
      <span class="label label-info">{todos.length}</span>
    </h1>
  </div>
  <div id="todo-form" class="row">
    <div class="col-sm-8 col-sm-offset-2 text-center">
      <div class="form-group">
        <input
          id="newTodo"
          type="text"
          class="form-control input-lg text-center"
          placeholder="co jeszcze chcesz zrobić?"
          bind:value={newTodo}
          on:input={e => (newTodo = e.target.value)}
        />
      </div>
      <button class="btn btn-primary btn-lg" on:click={handleAdd}>
        Dodaj
      </button>
    </div>
  </div>
  <ul class="nav nav-tabs">
    <li class="nav-item">
      <button
        class="btn {tab === 'all' ? 'btn-primary' : ''}"
        on:click={() => { $: tab = 'all'; }}
      >
        Wszystkie
      </button>
    </li>
    <li class="nav-item">
      <button
        class="btn {tab === 'todo' ? 'btn-primary' : ''}"
        on:click={() => { $: tab = 'todo'; }}
      >
        Do zrobienia
      </button>
    </li>
    <li class="nav-item">
      <button
        class="btn {tab === 'done' ? 'btn-primary' : ''}"
        on:click={() => { $: tab = 'done'; }}
      >
        Zrobione
      </button>
    </li>
  </ul>
  {#if Array.isArray(todos)}
    {#each todos.filter(todo => isTaskInTab(todo, tab)) as todo (todo._id)}
      <div id="todo-list" class="row">
        <div class="col-sm-4 col-sm-offset-4">
          <div class="checkbox">
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                on:change={() => handleToggleDone(todo)}
              />
              <span class:task-done={todo.done}>{todo.text}</span>
            </label>
            <button
              class="btn btn-danger"
              on:click={() => handleDelete(todo)}
            >
              Usuń
            </button>
          </div>
        </div>
      </div>
    {/each}
  {/if}
</div>