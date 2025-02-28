/* eslint-disable no-unused-vars */
import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '~/utils/formatters'
import { refreshTokenAPI} from '~/apis'
import { logoutUserAPI } from '~/redux/user/userSlice'


let axiosReduxStore
export const injectStore = mainStore => {axiosReduxStore = mainStore}


// Khởi tạo một đối tượng Axios ( authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án.
let authorizedAxiosInstance = axios.create()
// Thời gian chờ tối đa của 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// withCredentials: Sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE ( phục vụ việc chúng ta sẽ lưu JWT tokens (refresh & access) vapf trong httpOnly Cookie của trình duyêt)
authorizedAxiosInstance.defaults.withCredentials = true

/**
 * Cấu hình Interceptors ( Bộ đánh chặn vào mọi request và response )
 */
// Interceptor Request: Can thiệp vào giữa những request API.
authorizedAxiosInstance.interceptors.request.use( (config) => {
  // Kỹ thuật chặn spam click ( Xem kỹ trong file formatters chứa function)
  interceptorLoadingElements(true)

  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Khởi tạo một cái promise cho việc gọi api refresh_token
// Mục đích tạo Promise này để khi nào gọi api refresh_token xong xuôi thì mới retry lại nhiều api bị lỗi trước đó

let refreshTokenPromise = null

// Interceptor Response: Can thiệp vào giữa những response API.
authorizedAxiosInstance.interceptors.response.use( (response) => {
  // Kỹ thuật chặn spam click ( Xem kỹ trong file formatters chứa function)
  interceptorLoadingElements(false)

  return response
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  /* Mọi mã http StatusCode ngoài khoảng 200 - 299 sẽ là error và rơi vào đây */

  // Kỹ thuật chặn spam click ( Xem kỹ trong file formatters chứa function)
  interceptorLoadingElements(false)

  /* Xử Lý Refresh Token tự động */
  // Trường hợp 1: Nếu như nhận mã 401 từ BE gọi gọi API đăng xuất luôn
  if ( error.response?.status === 401) {
    axiosReduxStore.dispatch( logoutUserAPI(false) )
  }

  // Trường hợp 2: Nếu nhận mã 410 từ BE, thì sẽ gọi refresh token để làm mới lại refresh token
  // Đầu tiên lấy được các request API đang bị lỗi thông qua error.config
  const originalRequests = error.config
  if ( error.response?.status === 410 && originalRequests ) {
    if (!refreshTokenPromise) {
      // Gọi API refToken
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          return data?.accessToken
        })
        .catch((err) => {
          // Nhận bất kỳ lỗi nào ở API refresh Token thì đăng xuất luôn.
          axiosReduxStore.dispatch( logoutUserAPI(false) )
          return Promise.reject(err)
        }).finally(() => {
          refreshTokenPromise = null
        })
    }

    return refreshTokenPromise.then( accessToken => {
      // Đối với các trường hợp cần lưu lại accessToken hoặc refreshToken vào localStorage thì sẽ thêm code xử lý ở đây

      // return axios instant để gọi lại các api bị lỗi ban đầu
      return authorizedAxiosInstance(originalRequests)
    })
  }
  // Xử lý tập trung phần hiển thị thông báo lỗi và trả về từ mọi API ở đây (viết code 1 lần clean code)
  // console.log error ra là sẽ thấy cấu trúc data dẫn tới message lỗi như dưới đây
  let errorMessage = error?.message

  if ( error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  // Dùng toastify để hiển thị bất kỳ mọi mã lỗi nào lên màn hình - Ngoại trừ mã 410 - GONE phục vụ việc tự động refresh token.
  if ( error.response?.status !== 410) {
    toast.error(errorMessage)
  }
  return Promise.reject(error)
})
export default authorizedAxiosInstance
