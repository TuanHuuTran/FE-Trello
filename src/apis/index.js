import axios from 'axios'
import { API_ROOT } from '~/utils/constants'


export const fetchBoardDetailAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  return response.data
}

export const createColumnAPI = async (newColumn) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumn)
  return response.data
}

export const createCardAPI = async (newCard) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCard)
  return response.data
}
