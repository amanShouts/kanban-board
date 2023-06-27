import "../css/Task.css"
import { MdDelete } from 'react-icons/md';
import { remove } from "../redux/taskSlice"
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { addCard } from "../redux/taskSlice";
import { Card } from "./Card";
import { useDrag, useDrop } from 'react-dnd';
import { addCardIndex, addEmptyPreview, deleteDraggedCard } from "../redux/taskSlice";

export function Task({ name, cards }) {

    const dispatch = useDispatch();
    const [cardname, setCardname] = useState("")
    const [check, setCheck] = useState(true)
    const dropRef = useRef(null)
    const dropIndexRef = useRef(null)
    const [possibleDropIndex, setPossibleDropIndex] = useState(null)

    const [{ isOver, canDrop, didDrop }, drop] = useDrop({
        accept: "ITEM",
        drop: (item, monitor) => {
            // Handle the dropped item
            let { draggedCard, draggedIndex, taskname } = item
            let dropIndex = findDropIndex(monitor)
            handleDrop(draggedCard, monitor, dropIndex, draggedIndex, taskname)
        },
        hover: (item, monitor) => {

            // console.log(dropRef.current, name, " this is my ref to drop")
            let dropIndex = findDropIndex(monitor)
            //create a empty div in the final target

            // dispatch empty preview wont work now 
            // dispatch(addEmptyPreview({ taskname: name, index: dropIndex }))

        },

        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            didDrop: monitor.didDrop(),
        })
    });

    // dropRef.current = drop
    drop(dropRef)

    function findDropIndex(monitor) {
        const hoverBoundingRect = dropRef.current.getBoundingClientRect();
        // const hoverMiddleY =
        //     (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        let parentxy

        //find index 
        let cardChildren = dropRef.current.children;
        let foundIndex = -1;
        for (let i = 0; i < cards.length; i++) {
            let dimension = cardChildren[i].getBoundingClientRect()

            let topFromDropTask = dimension.top - hoverBoundingRect.top;
            let bottomFromDropTask = dimension.bottom - hoverBoundingRect.top;
            let middleOfCurrentCard = (topFromDropTask + bottomFromDropTask) / 2;
            // console.log(topFromDropTask, bottomFromDropTask, middleOfCurrentCard, hoverClientY)

            if (hoverClientY < middleOfCurrentCard) {
                foundIndex = i;
                break;
            }
        }

        if (foundIndex == -1)
            foundIndex = cards.length
        dropIndexRef.current = foundIndex
        setPossibleDropIndex(prev => foundIndex)
        return foundIndex
    }
    function deleteTask(taskname) {
        // console.log("deleteing ", taskname)
        dispatch(remove(taskname));
    }

    function addNewCard() {
        let cardObj = {
            cardname: cardname,
            carddesc: ""
        }
        dispatch(addCard({ taskname: name, cardObj: cardObj }))

        setCardname("")
    }

    function handleDrop(item, monitor, dropIndex, draggedIndex, draggedTaskname) {
        // console.log(isOver, " over hai", dropIndex)
        console.log(item)
        dispatch(addCardIndex({ taskname: name, cardObj: item, index: dropIndex, dragIndex: draggedIndex, dragTaskname: draggedTaskname }))
        dispatch(deleteDraggedCard({ taskname: draggedTaskname, cardObj: item, dragIndex: draggedIndex, dropTaskname: name, dropIndex: dropIndex }))
    }


    function checkPreviewHighlight(i) {
        let previewObj = {
            change: false,
            previewColor: "grey",
            height: "100px"
        }
        if (dropIndexRef.current == i && isOver && !didDrop) {
            previewObj.change = true
        }

        return previewObj
    }


    return (
        <div className="task" >
            <h3 className="task_name"> {name} </h3>
            <div className="task_name_delete">
                <p>cards : {cards.length}</p>
                <div>
                    <MdDelete onClick={() => { deleteTask(name) }} />
                </div>
            </div>
            <div className="task_card_input">
                <button onClick={addNewCard}>Add Card</button>
                <input type="text" value={cardname} onChange={(e) => { setCardname(e.target.value) }} placeholder="card details" />
            </div>
            <hr></hr>
            {/* <div ref={daddy}> </div> */}
            <div className="cards" ref={dropRef} draggable={false}>
                {
                    cards.length > 0 &&
                    cards.map((elem, i) => {
                        return <Card key={i} cardname={elem.cardname} taskname={name} totalObj={elem} index={i} isOver={isOver} highlight={isOver && !didDrop && dropIndexRef.current == i ? true : false} />
                    })
                }
            </div>
        </div>
    )
}