import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './page/user/Home/Home';
import Blogs from './page/user/Blogs/Blogs';
import Login from './page/account/Login/Login';
import Register from './page/account/Register/Register';
import StudentRoute from './route/StudentRoute';
import MyAccount from './page/user/Account/MyAccount';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        {/* Student + Manager Club Route */}
        <Route exact path='/' element={<StudentRoute />}>
          <Route path='/student/' element={<Home />} />
          <Route path='/student/blog' element={<Blogs />} />
          <Route path='/student/my-account' element={<MyAccount />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
