import Board from '~/pages/Boards/_id'
import { Routes, Route } from 'react-router-dom'
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Board />} />
        <Route path="/:boardId" element={<Board />} />
      </Routes>
    </>
  )
}

export default App
