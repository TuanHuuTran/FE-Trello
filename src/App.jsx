import { Routes, Route, Navigate } from 'react-router-dom'

import Board from './pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'

import Auth from '~/pages/Auth/Auth'

function App() {
  return (
    <Routes>
      < Route path='/' element={
        // Ở đây cần replace giá trị true để nó thay thế route /, có thể hiểu là route / sẽ không còn nằm trong history của browser
        // Thực hành dễ hiểu hơn bằng cách nhấn Go Home từ trang 404 xong thử quay lại bằng nút back của trình duyệt giữa 2 trường hợp có replace hoặc không có
        <Navigate to="/boards/67bad895f32682458041b898" replace={ true } />
      } />
      {/**Route Board Details */ }
      < Route path='/boards/:boardId' element={ <Board /> } />

      {/**Route Authentication */ }
      <Route path='/login' element={ <Auth /> } />
      <Route path='/register' element={ <Auth /> } />


      {/**Route 404 */ }
      <Route path='*' element={ <NotFound /> } />
    </Routes>
  )
}

export default App
