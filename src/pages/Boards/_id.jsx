/* eslint-disable no-console */
//detail boards
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect, useState } from 'react'
import {
  createColumnAPI,
  getDetailBoardAPI,
  createCardAPI,
  updateBoardDetailAPI,
  updateColumnDetailAPI
} from '~/apis/index'
import { useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sort'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // eslint-disable-next-line no-extra-semi
    ;(async () => {
      const boardId = '6610f2bc99aa57b0ef1b5597'
      const board = await getDetailBoardAPI(boardId)
      //sap xep truoc khi truyen xuong component con
      board.columns = mapOrder(board.columns, board?.columnOrderIds, '_id')
      // xu ly keo tha khi column card rong
      board.columns.forEach((column) => {
        // card empty
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          //card co du lieu
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
        }
      })
      setBoard(board)
    })()
  }, [])

  // api new column
  const createNewColumn = async (newData) => {
    const createColumn = await createColumnAPI({
      ...newData,
      boardId: board._id
    })
    // khi column rong xu ly keo tha
    createColumn.cards = [generatePlaceholderCard(createColumn)]
    createColumn.cardOrderIds = [generatePlaceholderCard(createColumn)._id]
    //cap nhat state
    const newBoard = { ...board }
    newBoard.columns.push(createColumn)
    newBoard.columnOrderIds.push(createColumn._id)
    setBoard(newBoard)
  }

  //api new card
  const createNewCard = async (newData) => {
    const createCard = await createCardAPI({
      ...newData,
      boardId: board._id
    })
    //cap nhat state

    const newBoard = { ...board }
    const columnUpdate = newBoard.columns.find((c) => c._id === createCard.columnId)
    if (columnUpdate) {
      columnUpdate.cards.push(createCard)
      columnUpdate.cardOrderIds.push(createCard._id)
    }
    setBoard(newBoard)
  }
  // goi api khi keo tha column xong xuoi
  const moveColumns = async (dndOrderredColumns) => {
    const dndOrderredColumnsIds = dndOrderredColumns.map((c) => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderredColumns
    newBoard.columnOrderIds = dndOrderredColumnsIds
    setBoard(newBoard)

    // goi api update columns sau khi keo tha
    await updateBoardDetailAPI(newBoard._id, { columnOrderIds: dndOrderredColumnsIds })
  }
  // update card khi keo tha trong 1 column ->cardOrderIds

  const moveCardTheSameColumn = (dndOrderredCard, dndCardOrderIds, columnId) => {
    //update board chuan state
    const newBoard = { ...board }
    const columnUpdate = newBoard.columns.find((c) => c._id === columnId)
    if (columnUpdate) {
      columnUpdate.cards = dndOrderredCard
      columnUpdate.cardOrderIds = dndCardOrderIds
    }
    setBoard(newBoard)
    //update api
    updateColumnDetailAPI(columnId, { cardOrderIds: dndCardOrderIds })
  }
  if (!board) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <CircularProgress />
        <Typography sx={{ color: 'blue' }}>Loading Board...</Typography>
      </Box>
    )
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardTheSameColumn={moveCardTheSameColumn}
      />
    </Container>
  )
}

export default Board
