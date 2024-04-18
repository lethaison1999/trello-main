import axios from 'axios'
const BACK_END_URL = 'http://localhost:8017/v1/'
/*
- Tại sao ở đây tôi try/catch khi call API để bắt lỗi?
- Sau này tôi sẽ update sử Interceptors trong axios để bắt lỗi chung 
- Interceptors req,res
*/

// board
const getDetailBoardAPI = async (boardId) => {
  const response = await axios.get(`${BACK_END_URL}/broads/${boardId}`)
  return response.data
}
const updateBoardDetailAPI = async (boardId, updateData) => {
  const response = await axios.put(`${BACK_END_URL}/broads/${boardId}`, updateData)
  return response.data
}
//column
const createColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${BACK_END_URL}/columns`, newColumnData)
  return response.data
}
const updateColumnDetailAPI = async (columnId, updateData) => {
  const response = await axios.put(`${BACK_END_URL}/columns/${columnId}`, updateData)
  return response.data
}
//card
const createCardAPI = async (newCardData) => {
  const response = await axios.post(`${BACK_END_URL}/cards`, newCardData)
  return response.data
}

export {
  getDetailBoardAPI,
  createColumnAPI,
  createCardAPI,
  updateBoardDetailAPI,
  updateColumnDetailAPI
}
