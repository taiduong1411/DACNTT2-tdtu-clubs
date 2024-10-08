import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './page/user/Home/Home';
import Login from './page/account/Login/Login';
// import Register from './page/account/Register/Register';
import StudentRoute from './route/StudentRoute';
import MyAccount from './page/user/Account/MyAccount';
import ForgotPassword from './page/account/ForgotPassword/ForgotPassword';
import VerifyEmail from './page/account/ForgotPassword/VerifyEmail';
import ChangePassword from './page/account/ForgotPassword/ChangePassword';
import MailBox from './page/user/MailBox/MailBox';
import MyClub from './page/user/MyClub/MyClub';
import Dashboard from './page/manager/Dashboard/Dashboard'
import ManagerRoute from './route/ManagerRoute';
import AdminRoute from './route/AdminRoute';
import DashboardAdmin from './page/admin/Dashboard/DashboardAdmin';
import Blog from './page/manager/Blog/Blog';
import News from './page/user/Blogs/News';
import AllNews from './page/user/Blogs/AllNews';
import NewsByTag from './page/user/Blogs/NewsByTag';
import MailDetail from './page/user/MailBox/MailDetail';
import AdminBlogs from './page/admin/Blog/Blog';
import MailBoxAdmin from './page/admin/MailBox/MailBoxAdmin';
import ClubAdmin from './page/admin/Club/ClubAdmin';
import AddClub from './page/user/AddClub/AddClub';
import Event from './page/manager/_Event/Event';
import ClubDetail from './page/user/ClubDetail/ClubDetail';
import ClubManagement from './page/manager/Club/ClubManagement';
import EventAdmin from './page/admin/Event_/EventAdmin';
import EventTask from './page/manager/_Event/EventTask';
import Task from './page/user/Task/Task';
import Schedule from './page/manager/Schedule/Schedule';
import Approval from './page/manager/Approval/Approval';
import Mail from './page/manager/Mail/Mail';
import ScheduleActivity from './page/user/ScheduleActivity/ScheduleActivity';
import Attendances from './page/manager/Attendances/Attendances';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        {/* <Route path='/register' element={<Register />} /> */}
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/change-password' element={<ChangePassword />} />
        {/* Student Route */}
        <Route exact path='/' element={<StudentRoute />}>
          <Route path='/student/' element={<Home />} />
          <Route path='/student/my-account' element={<MyAccount />} />
          <Route path='/student/mailbox' element={<MailBox />} />
          <Route path='/student/mailbox/:type/:encryptedId' element={<MailDetail />} />
          <Route path='/student/my-club' element={<MyClub />} />
          <Route path='/student/create-club' element={<AddClub />} />
          <Route path='/student/news/:slug' element={<News />} />
          <Route path='/student/news/all-news' element={<AllNews />} />
          <Route path='/student/news/tag/:tag' element={<NewsByTag />} />
          <Route path='/student/club-detail/:id' element={<ClubDetail />} />
          <Route path='/student/student-task' element={<Task />} />
          <Route path='/student/schedule-activity' element={<ScheduleActivity />} />
        </Route>
        {/* Manager Club Route */}
        <Route exact path='/' element={<ManagerRoute />}>
          <Route path='/manager/dashboard' element={<Dashboard />} />
          <Route path='/manager/blog-management' element={<Blog />} />
          <Route path='/manager/event-management' element={<Event />} />
          <Route path='/manager/club-management' element={<ClubManagement />} />
          <Route path='/manager/club-schedule-management' element={<Schedule />} />
          <Route path='/manager/club-approval-management' element={<Approval />} />
          <Route path='/manager/club-mail-management' element={<Mail />} />
          <Route path='/manager/event-manager/event-task/:id' element={<EventTask />} />
          <Route path='/manager/club-schedule-management/attendance/:id' element={<Attendances />} />
        </Route>
        {/* Admin Route */}
        <Route exact path='/' element={<AdminRoute />}>
          <Route path='/admin/dashboard' element={<DashboardAdmin />} />
          <Route path='/admin/blogs' element={<AdminBlogs />} />
          <Route path='/admin/mailbox' element={<MailBoxAdmin />} />
          <Route path='/admin/club' element={<ClubAdmin />} />
          <Route path='/admin/event' element={<EventAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
