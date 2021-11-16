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

  function handleDelete(x) {
    let task = Tasks;
    console.log(task[x]);
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
          {Tasks.map((val) => {
            return (
              <Card style = {{margin: '20px'}}>
                <MinusSquareOutlined onClick = {() => {handleDelete(val.id)}}/>
                <Input 
                  bordered = {val.selected}
                  onFocus = {() => {val.selected = true;forceUpdate();}} 
                  onBlur = {(e) => {val.name = e.target.value; val.selected = false;forceUpdate();}}
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
