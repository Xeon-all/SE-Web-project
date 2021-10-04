import {
  Button,
  Modal,
} from 'antd'
import { useState } from 'react'
import './App.css';

function App() {
  const [ModalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Button
      onClick = {() => {setModalVisible(true)}}
      style = {{transform: 'translate(50%, 50%)'}}>
        Hello, world!
      </Button>
      <Modal
      visible = {ModalVisible}
      footer = {null}
      onCancel = {() => {setModalVisible(false)}}>
        <h1>Hello, world!</h1>
      </Modal>
    </>
  );
}

export default App;
