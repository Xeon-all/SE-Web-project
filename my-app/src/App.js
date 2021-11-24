import {
  Button,
  Card,
  Layout,
  Input,
  message,
  Radio,
  Row,
  Col,
  Space,
  Modal,
  Slider,
} from 'antd'
import {
  InfoCircleOutlined,
  MinusSquareOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { useState, useReducer } from 'react';
import { request } from './API/api.js';
import { urls } from './API/urls.js';
import './App.css';

const { Header, Content, Sider } = Layout;

function App() {
  const [Tasks, setTasks] = useState([]);
  const [token, setToken] = useState({});
  const [tempToken, setTempToken] = useState({
    user: '',
    password: '',
  });
  const [isRegisting, setIsRegisting] = useState(false);
  const [isLogIn, setIsLogIn] = useState(false);
  const [isDraggable, setIsDraggable] = useState(true);
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

  const priorityLevel = [
    '#EB5558',
    '#F7CE74',
    '#F5F3B0',
    '#FFFFFF',
    '#DDDDDD'
  ]

  function handleAdd() {
    let newTask = {
      id: Tasks.length,
      priority: 3,
      name: `第${Tasks.length}个任务`,
      Info: '无',
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

  async function logIn(){
    // let user = '1';
    // let password = '1';
    let taskname = await request('get', urls.getTasks, tempToken);
    if(taskname.status === 200){
      if(taskname.data === 'Wrong password'){
        message.error('密码错误!');
      }
      else if(taskname.data === 'No such user') {
        message.error('该用户不存在!');
      }
      else {
        setToken(tempToken)
        setIsLogIn(true);
        let task = [{
          id: 0,
          name: taskname.data,
          selected: false,
        }]
        setTasks(task);
        forceUpdate();
      }
    }
    
  }

  function logOut(){
    setIsLogIn(false);
    setTempToken({});
    setToken({});
    setTasks([]);
  }

  async function uploadData(tasks){
    let tasknames = tasks.map((e) => {
      return e.name;
    });
    let formData = new FormData();
    formData.append('name', token.user);
    formData.append('password', token.password);
    formData.append('task', tasknames[0]);
    let result = await request('POST', urls.postTasks, formData);
    if(result.status !== 200){
      message.error('同步任务失败!');
    }
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
    let formData = new FormData();
    formData.append('name', tempToken.user);
    formData.append('password', tempToken.password);

    let result = await request('post', urls.createUser, formData);
    if(result.status && result.status === 200){
      if(result.data === 'already have the name'){
        message.error('用户名已被注册!');
      }
      else {
        message.success('注册成功');
        setIsLogIn(true);
        setToken(tempToken)
      }
    }
    else {
      message.error('注册失败：网络问题!');
    }
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

  function sliderFormatter(value) {
    switch(value) {
      case 0 :
        return '要命了';
      case 1:
        return '赶紧做';
      case 2:
        return '该做了';
      case 3:
        return '不着急';
      case 4:
        return '拖着吧';
    }
  }

  return (
    <>
    <Layout>
      <Header>
        {
          isLogIn?
          <Space>
            <text style = {{color: 'white'}}>welcome! {token.user}</text>
            <Button onClick = {logOut} type = 'text' danger>log out</Button>
          </Space>
          :
          <Space>
            <Input 
            prefix = {'user:'} 
            style = {{width: "8vw",}}
            onChange = {(e) => {
              let temp = {
                user: e.target.value,
                password: tempToken.password,
              }
              setTempToken(temp)
            }}
            />
            <Input.Password 
            prefix = {'password:'} 
            style = {{width: "10vw",}}
            onChange = {(e) => {
              let temp = {
                user: tempToken.user,
                password: e.target.value,
              }
              setTempToken(temp)
            }}
            />
            { 
              !isRegisting
              ? <Button onClick = {logIn}> log in </Button>
              : <Button onClick = {register}>register </Button>}
            <Radio 
              checked = {isRegisting}
              onClick = {() => {setIsRegisting(!isRegisting)}}
              style = {{color: 'white'}}
              > 
              register 
            </Radio>
          </Space>
        }
        <Button style = {{marginLeft: '20vw'}} onClick = {handleAdd}>
          add
        </Button>
      </Header>
      <Layout>
        <Sider style = {{background: '#49C7CD', minHeight: '90vh'}} collapsible></Sider>
        <Content>
          {Tasks.map((val, index, arr) => {
            return (
              <Card 
              style = {{margin: '20px', backgroundColor: priorityLevel[val.priority]}}
              draggable = {isDraggable}
              onDragStart = {(e) => drag(e, val.id, val.name)}
              onDragOver = {(e) => allowDrop(e)}
              onDrop = {(e) => dropOnTask(e, val.id)}>
                <Row align = 'middle' gutter = {16}>
                  <Col>
                    <MinusSquareOutlined onClick = {() => {handleDelete(val.id)}}/>
                  </Col>
                  <Col>
                    <Input
                    bordered = {val.selected}
                    onFocus = {() => {val.selected = true; setIsDraggable(false); forceUpdate();}}
                    onBlur = {(e) => {
                      arr[index].name = e.target.value;
                      setTasks(arr);
                      setIsDraggable(true);
                      if(isLogIn){
                        uploadData(arr);
                      }
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
                  </Col>
                  <Col span = {2}>
                    <Slider
                    max = {4}
                    min = {0}
                    value = {val.priority}
                    defaultValue = {3}
                    tipFormatter={sliderFormatter}
                    onChange = {(value) => {
                      let task = Tasks;
                      task[index].priority = value;
                      setTasks(task);
                      forceUpdate();}}
                    />
                  </Col>
                  <Col>
                    <EnvironmentOutlined style = {{paddingRight: '1rem'}}/>
                    <Input
                    bordered = {val.selectedLocation}
                    onFocus = {() => {val.selectedLocation = true; setIsDraggable(false); forceUpdate();}}
                    onBlur = {(e) => {
                      arr[index].location = e.target.value;
                      setTasks(arr);
                      setIsDraggable(true);
                      if(isLogIn){
                        uploadData(arr);
                      }
                      val.selectedLocation = false;
                      forceUpdate();}}
                    value = {Tasks[index].location}
                    onChange = {({ target: { value } }) => {
                      let task = Tasks;
                      task[index].location = value;
                      setTasks(task);
                      forceUpdate();}}
                    onPressEnter = {(e) => {handleChangeName(e, val);}}
                    style = {{width: "10vw",}}/>
                  </Col>
                  <Col offset = {14}>
                    <InfoCircleOutlined onClick = {() => {val.showInfo = true; forceUpdate();}}/>
                    <Modal
                    title = '任务详细信息'
                    visible = {val.showInfo}
                    onOK = {() => {val.showInfo = false; forceUpdate();}}
                    onCancel = {() => {val.showInfo = false; forceUpdate();}}
                    footer = {[
                      <Button
                      type = 'primary'
                      onClick = {() => {val.showInfo = false; forceUpdate();}}
                      >
                        确认
                      </Button>
                    ]}
                    >
                      <p>{val.Info}</p>
                    </Modal>
                  </Col>
                </Row>
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
