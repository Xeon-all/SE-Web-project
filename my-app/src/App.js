import {
  Button,
  Card,
  Layout,
  Input,
  message,
} from 'antd'
import {
  PlusCircleOutlined,
  MinusSquareOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useState, useReducer } from 'react';
import { request } from './API/api.js';
import { urls } from './API/urls.js';
import './App.css';
import pic from './Add.png'

const { Header, Content, Sider } = Layout;

function App() {
  const [Tasks, setTasks] = useState([]);
  const [token, setToken] = useState({});
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  function handleAdd() {
    let newTask = {
      id: Tasks.length,
      key: 2,
      name: `第${Tasks.length}个任务`,
      selected: false,
    }
    
    let task = [...Tasks, newTask];
    setTasks(task);
  }

  function handleDelete(x) {
    let task = Tasks;
    task.splice(x, 1);
    for(let i = x; i < task.length; i ++)
    {
      task[i].id = task[i].id - 1;
    }
    setTasks(task);
    forceUpdate();
  }

  function handleChangeName(e, val){
    val.name = e.target.value;
    e.target.blur();
  }

  async function getTask(e){
    let user = e.target.parentNode.parentNode.childNodes[0].lastChild.value;
    let password = e.target.parentNode.parentNode.childNodes[1].lastChild.value;
    setToken({
      user: user,
      password: password,
    })
    let data = {
      name: user,
      password: password,
    }
    // const response = await axios({
    //   method: 'GET',
    //   baseURL: urls.baseUrl,
    //   url: urls.getTasks,
    //   [data]: data,
    // });
    // console.log(response);
    let taskname = await request('get', urls.getTasks, data);
    if(taskname.status === 200){
      let task = [{
        id: 0,
        name: taskname.data,
        selected: false,
      }]
      setTasks(task);
      forceUpdate();
    }
    
  }

  async function uploadData(tasks){
    let tasknames = tasks.map((e) => {
      return e.name;
    });
    let data = {...token, task: tasknames[0]};
    console.log(data);

    let formData = new FormData();
    formData.append('name', token.user);
    formData.append('password', token.password);
    formData.append('task', tasknames[0]);
    let result = await request('POST', urls.postTasks, formData);
    console.log(result);

    // const response = await axios({
    //   method: 'POST',
    //   baseURL: urls.baseUrl,
    //   url: urls.postTasks,
    //   ...token,
    //   task: tasknames[0],
    // });
    //console.log(response);
  }

  async function register(e){
    let user = e.target.parentNode.parentNode.childNodes[0].lastChild.value;
    let password = e.target.parentNode.parentNode.childNodes[1].lastChild.value;
    
    /*let data = {
      name: user,
      password: password,
    }*/

    let formData = new FormData();
    formData.append('name', token.user);
    formData.append('password', token.password);

    let result = await request('post', urls.createUser, formData);
    if(result.status === 200){
      if(result.status === 200){
        message.success('注册成功!');
      }
    }
    else {
      message.error('注册失败!');
    }
    console.log(result);
  }

  function drag(ev, drag_id, drag_name) {
    ev.dataTransfer.setData('drag_id', drag_id);
    ev.dataTransfer.setData('drag_name', drag_name);
  };

  function allowDrop(ev)
  {
    ev.preventDefault();
  }

  function dropOnTask(ev, target_id)
  {
    ev.preventDefault();
    var drag_id = ev.dataTransfer.getData('drag_id');
    var drag_name = ev.dataTransfer.getData('drag_name');
    let task = Tasks;
    
    let drag_task = task[drag_id];
    task.splice(drag_id, 1);
    for(let i = drag_id; i < task.length; i ++)
    {
      task[i].id -= 1;
    }
    task.splice(target_id, 0, [drag_task]);
    for(let i = target_id + 1; i < task.length; i ++)
    {
      task[i].id += 1;
    }
    for(let i = 0; i < task.length; i ++)
    {
      console.log("the %d target_task id is %d", i + 1, task[i].id);
    }
    task[target_id].id = target_id;
    task[target_id].name = drag_name;

    setTasks(task);
    forceUpdate();
  }

  return (
    <>
    <Layout>
      <Header>
        <Input prefix = {'user:'} style = {{width: "8vw",}}/>
        <Input prefix = {'password:'} style = {{width: "10vw",}}/>
        <Button onClick = {getTask}> log in </Button>
        <Button onClick = {register}> register </Button>

      </Header>
      <Layout>
        <Sider style = {{background: '#49C7CD', minHeight: '90vh'}} collapsible></Sider>
        <Content>
        <div class = "Add">
          <img src={pic} alt = 'add' width = '100%' height = '100%' 
          onClick= {handleAdd}/>
        </div>
          {Tasks.map((val, index, arr) => {
            return (
              <Card 
                style = {{margin: '20px'}}
                draggable = {true}
                onDragStart = {(e) => drag(e, val.id, val.name)}
                onDragOver = {(e) => allowDrop(e)}
                onDrop = {(e) => dropOnTask(e, val.id)}>
                <MinusSquareOutlined onClick = {() => {handleDelete(val.id)}}/>
                { 
                  <Input
                    bordered = {val.selected}
                    onFocus = {() => {val.selected = true; forceUpdate();}}
                    onBlur = {(e) => {
                      arr[index].name = e.target.value;
                      setTasks(arr);
                      uploadData(arr);
                      val.selected = false;
                      forceUpdate();}}
                    value = {Tasks[index].name}
                    onChange = {({ target: { value } }) => {
                      let task = Tasks;
                      task[index].name = value;
                      setTasks(task);
                      forceUpdate();}}
                    onPressEnter = {(e) => {handleChangeName(e, val);}}
                    style = {{width: "10vw",}}/>
                }
                <PlusCircleOutlined style = {{float: 'right'}}/>
              </Card>
            )
          })}
        </Content>
        <Sider style = {{background: '#49C7CD', minHeight: '90vh'}} collapsible></Sider>
      </Layout>
    </Layout>
    </>
  );
}

export default App;
