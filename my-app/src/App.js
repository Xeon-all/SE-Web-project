import {
  Button,
  Card,
  Layout,
  Input,
} from 'antd'
import {
  PlusCircleOutlined,
  MinusSquareOutlined,
} from '@ant-design/icons'
import { useState, useReducer } from 'react'
import './App.css';

const { Header, Content, Sider } = Layout;

function App() {
  const [Tasks, setTasks] = useState([]);
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

  function handleDelete(e, x) {
    let task = Tasks;
    task.splice(x, 1);
    for(let i = x; i < task.length; i ++)
    {
      task[i].id = task[i].id - 1;
    }
    setTasks(task);
    //console.log(Tasks, e.target.parentNode.parentNode.parentNode.parentNode.childNodes);
    e.target.parentNode.parentNode.parentNode.parentNode.childNodes.forEach(refreshInput);
    forceUpdate();
  }

  function refreshInput(e, index) {
    console.log(e.firstChild.childNodes[1]);
    if(index < Tasks.length){
      e.firstChild.childNodes[1].value = Tasks[index].name;
      console.log(e.firstChild.childNodes[1], e.firstChild.childNodes[1].value);
      //console.log(e.firstChild.childNodes[1].value, e.firstChild.childNodes[1]);
    }
  }

  function handleChangeName(e, val){
    val.name = e.target.value;
    e.target.blur();
  }

  return (
    <>
    <Layout>
      <Header>
        <Button style = {{marginLeft: '50%'}} onClick = {handleAdd}>
          add
        </Button>
      </Header>
      <Layout>
        <Sider style = {{background: '#49C7CD', minHeight: '90vh'}} collapsible></Sider>
        <Content>
          {Tasks.map((val, index, arr) => {
            return (
              <Card style = {{margin: '20px'}}>
                <MinusSquareOutlined onClick = {(e) => {handleDelete(e, val.id)}}/>
                <Input 
                  bordered = {val.selected}
                  onFocus = {() => {val.selected = true; forceUpdate();}} 
                  onBlur = {(e) => {
                    arr[index].name = e.target.value;
                    setTasks(arr);
                    val.selected = false;
                    forceUpdate();}}
                  defaultValue = {val.name}
                  onPressEnter = {(e) => {handleChangeName(e, val);}} 
                  style = {{width: "10vw",}}/>
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
