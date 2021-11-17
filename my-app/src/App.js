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
          {Tasks.map((val, index, arr) => {
            return (
              <Card style = {{margin: '20px'}}>
                <MinusSquareOutlined onClick = {(e) => {handleDelete(e, val.id)}}/>
                { 
                  <Input
                    bordered = {val.selected}
                    onFocus = {() => {val.selected = true; forceUpdate();}}
                    onBlur = {(e) => {
                      arr[index].name = e.target.value;
                      setTasks(arr);
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
