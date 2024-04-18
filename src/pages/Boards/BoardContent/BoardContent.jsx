import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import {
  DndContext,
  useSensor,
  useSensors,
  // MouseSensor,
  // TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndkitSensors'
import { useCallback, useEffect, useRef, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({
  board,
  createNewColumn,
  createNewCard,
  moveColumns,
  moveCardTheSameColumn
}) {
  //fix khi click ma chua keo tha thi k handle event click,khuyen dung mouse and touch tren mobie(bug)
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderredColumns, setOrderredColumns] = useState([])
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  //xử lý thuật toán va chạm
  const lastOverId = useRef(null)
  // console.log('orderredColumns ', orderredColumns)
  // Tai 1 thoi diem thi chi co 1 phan  tu duoc keo (colunm of card)
  useEffect(() => {
    // da sap xep o component cha board.jsx _id.jsx
    setOrderredColumns(board?.columns)
  }, [board])
  // tim kiem colum theo cardid
  const findColumnByCardId = (cardId) => {
    return orderredColumns.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    )
  }
  // fun chung Cập nhật lại state trong trường hợp kéo thả card ở 2 column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderredColumns((prevColums) => {
      const overCardIndex = overColumn?.cards?.findIndex((card) => card._id === overCardId)
      // logic tính toán cardIndex mới sau khi m kéo rồi thả
      let newCardIndex
      const isBelowOverItem =
        active.rect.current.translated && active.rect.current.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
      //clone du lieu cu thanh 1 du lieu moi de xuly
      const nextColumns = cloneDeep(prevColums)
      const nextActiveColumn = nextColumns.find((column) => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find((column) => column._id === overColumn._id)
      //column cũ
      if (nextActiveColumn) {
        // xóa card ở column cũ khi kéo card sang colum khác
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        )
        //thêm plaholder card nếu column rỗng:bị kéo hết card đi,k còn cái nào cả :D :D
        if (isEmpty(nextActiveColumn.cards)) {
          //thêm 1 cái card khi column rỗng giữ chổ để kéo card giữa các column khác nhau
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        //cập nhật lại mảng cardOrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((card) => card._id)
      }
      //colum mới
      if (nextOverColumn) {
        //kiểm tra card đang kéo nó có tồn tài ở overcolumn hay chưa,nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        )
        // cập nhật lại columId sau khi kéo thả vào column khác
        const rebuid_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        // thêm 1 cái card dang kéo vào overColumn theo vị trí  index mới
        //toSpliced trả về 1 mảng mới, k làm thay đổi mảng ban đầu, còn thằng splice làm modifed mảng bản đầu
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuid_activeDraggingCardData
        )
        // xóa cái placeholder card đi nếu nó tồn tại
        nextOverColumn.cards = nextOverColumn.cards.filter((card) => !card.FE_placeholderCard)
        //cập nhật lại mảng cardOrderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card) => card._id)
      }
      return nextColumns
    })
  }

  const handleDragStart = (event) => {
    // console.log('handleDragStart: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)
    //lay du liệu cũ của column
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }
  //trigger trong quá trình kéo 1 phần tử (drag)
  const handleDragOver = (event) => {
    // console.log(event, 'handleDragOver')
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // xử lý card
    const { active, over } = event
    if (!active || !over) return

    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData }
    } = active
    const { id: overCardId } = over

    // tim 2 cai column theo cardID
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    if (!activeColumn || !overColumn) return
    // khi kéo 2 column khác nhau thì xử xý ở đay (column này kéo qua column khác)
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  // handle xu ly sau khi keo 1 phan tu xong
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!active || !over) return
    // console.log('handleDragEnd: ', event) handle xu ly keo tha card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData }
      } = active
      const { id: overCardId } = over

      // tim 2 cai column theo cardID
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      if (!activeColumn || !overColumn) return
      //hành đồng kéo thả card giữa 2 column khác nhau
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
        //'hành đồng kéo thả card trong cùng 1 column'
      } else {
        //lay vi tri cu oldColumnWhenDraggingCard

        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId
        )
        //lay vi tri moi over
        const newCardIndex = overColumn?.cards?.findIndex((c) => c._id === overCardId)

        //tương tự như kéo column
        const dndOrderredCard = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        )
        const dndCardOrderIds = dndOrderredCard.map((card) => card._id)
        setOrderredColumns((prevColums) => {
          //clone du lieu cu thanh 1 du lieu moi de xuly
          const nextColumns = cloneDeep(prevColums)
          // tìm tới cái column mà mà chúng ta đang thả
          const targetColumn = nextColumns.find((column) => column._id === overColumn._id)
          //cập nhật lại state
          targetColumn.cards = dndOrderredCard
          targetColumn.cardOrderIds = dndCardOrderIds
          return nextColumns
        })
        moveCardTheSameColumn(dndOrderredCard, dndCardOrderIds, oldColumnWhenDraggingCard._id)
      }
    }
    //xử lý kéo thả column trong  1 broadContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        //lay vi tri cu active
        const oldColumnIndex = orderredColumns.findIndex((c) => c._id === active.id)
        //lay vi tri moi over
        const newColumnIndex = orderredColumns.findIndex((c) => c._id === over.id)
        //dung arrayMove de sap xep lai mang coluns ban dau
        const dndOrderredColumns = arrayMove(orderredColumns, oldColumnIndex, newColumnIndex)
        setOrderredColumns(dndOrderredColumns)
        moveColumns(dndOrderredColumns)
      }
    }
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }
  //customstyle
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
          // duration: 250,
          // easing: 'ease'
        }
      }
    })
  }
  //Custom thuật toán va cham
  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args })
      }
      // Tìm các điểm giao nhau, va chạm
      const pointerIntersections = pointerWithin(args)
      // khi kéo 1 card ra khỏi vùng thì k làm gì cả
      if (!pointerIntersections?.length) return
      // const intersections = !!pointerIntersections?.length
      //   ? pointerIntersections
      //   : rectIntersection(args)

      let overId = getFirstCollision(pointerIntersections, 'id')
      if (overId) {
        const checkColumn = orderredColumns.find((col) => col._id === overId)
        if (checkColumn) {
          //xài cái này mượt hơn center
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) =>
                container.id !== overId && checkColumn?.cardOrderIds?.includes(container.id)
            )
          })[0]?.id
        }
        lastOverId.current = overId
        return [{ id: overId }]
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderredColumns]
  )
  return (
    <DndContext
      sensors={sensors} //cảm biến
      // collisionDetection={closestCorners} //keo card to
      //Custom thuật toán va cham fix bug(37)
      collisionDetection={collisionDetectionStrategy} //keo card to
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#334563' : '#2089D5'),
          width: '100%',
          height: (theme) => theme.trello.boardContentHeight,
          p: '10px 0'
        }}
      >
        <ListColumns
          columns={orderredColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
        />
        {/* dung de giu cho khi keo tha card off column */}
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
