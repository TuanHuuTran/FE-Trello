import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

import Board from './pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'

import Auth from '~/pages/Auth/Auth'
import AccountVerification from '~/pages/Auth/AccountVerification'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import Settings from '~/pages/Settings/Settings'
import Boards from '~/pages/Boards'


/**
 * Giải pháp clean code trong việc xác định các route cần đăng nhập tài khoản xong mới cho phép truy cập
 *  Sử dụng <Outlet /> của react-route-dom để hiển thị các child route
 */
const ProtectedRoute = ( { user } ) => {
  if ( !user ) return <Navigate to='/login' replace={ true } />
  return <Outlet />
}

function App() {
  const currentUser = useSelector( selectCurrentUser )
  return (
    <Routes>
      < Route path='/' element={
        // Ở đây cần replace giá trị true để nó thay thế route /, có thể hiểu là route / sẽ không còn nằm trong history của browser
        // Thực hành dễ hiểu hơn bằng cách nhấn Go Home từ trang 404 xong thử quay lại bằng nút back của trình duyệt giữa 2 trường hợp có replace hoặc không có
        <Navigate to="/boards" replace={ true } />
      } />

      {/*Protected Route: Hiểu đơn giản là những route chỉ truy cập được sau khi login*/ }
      <Route element={ <ProtectedRoute user={ currentUser } /> }>
        < Route path='/boards/:boardId' element={ <Board /> } />

        < Route path='/boards' element={ <Boards /> } />

        {/*Setting route */ }
        < Route path='/settings/account' element={ <Settings /> } />
        < Route path='/settings/security' element={ <Settings /> } />

      </Route>


      {/**Route Board Details */ }
      {/**Route Authentication */ }
      <Route path='/login' element={ <Auth /> } />
      <Route path='/register' element={ <Auth /> } />
      <Route path='/account/verification' element={ <AccountVerification /> } />

      {/**Route 404 */ }
      <Route path='*' element={ <NotFound /> } />
    </Routes>
  )
}

export default App
