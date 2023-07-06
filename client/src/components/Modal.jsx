import { useState } from "react";
const serverUrl = import.meta.env.VITE_REACT_APP_SERVERURL;
import { useCookies } from 'react-cookie';

const Modal = ({ mode, setShowModal, getData, task }) => {
  const editMode = mode === 'edit' ? true : false;
  const [cookies, setCookie, removeCookie] = useCookies(null);

  const [data, setData] = useState({
    user_email: editMode ? task.user_email : cookies.Email,
    title: editMode ? task.title : null,
    progress: editMode ? task.progress : 50,
    date: editMode ? task.date : new Date()
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({...data, [name]: value});
    console.log(data) 
  }

  const postData = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${serverUrl}/todos`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data) 
      });

      if (response.status === 200) {
        console.log('Worked');
        setShowModal(false);
        getData();
      }

    } catch (error) {
      console.error(error);
    }
  }


  const editData = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${serverUrl}/todos/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify(data)
      });

      if (response.status === 200) {
        setShowModal(false);
        getData();
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className='overlay'>
      <div className='modal'>
        <div className='form-title-container'>
          <h3>Let&apos;s {mode} your task</h3>
          <button onClick={() => setShowModal(false)}>X</button>
        </div>

        <form>
          <input 
            required
            maxLength={30}
            placeholder=' Your tasks goes here' 
            name='title'
            value={data.title}
            onChange={handleChange}
          />
          <label htmlFor="range">Dray to select your current progress</label>
          <input  
            required
            type='range'
            id='range'
            min='0'
            max='110'
            name='progress'
            value={data.progress}
            onChange={handleChange}
          />
          <input className={'edit'} type='submit' onClick={editMode ? editData : postData}/>
        </form>
      </div>
    </div>
  )
}

export default Modal