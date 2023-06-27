import { useEffect, useRef, useState } from "react";
import "../css/Card.css"
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from "react-redux";
import { addCardDescription } from "../redux/taskSlice"

export function Card({ cardname, totalObj, highlight, taskname, index }) {

    const dispatch = useDispatch()
    // const dragRef = useRef(null)
    const [cardDesc, setCardDesc] = useState("")
    const descBox = useRef(null)

    useEffect(() => {
        descBox.current.textContent = totalObj.carddesc
    }, [totalObj.carddesc])

    const [{ isDragging }, drag] = useDrag({

        type: "ITEM",
        item: { draggedCard: totalObj, draggedIndex: index, taskname: taskname },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),

        })
    });

    function storeDesc(e) {
        dispatch(addCardDescription({ taskname: taskname, cardname: cardname, carddesc: e.target.textContent }))
        setCardDesc(prev => e.target.textContent)
    }

    // drag(dragRef)

    const [isMouseTop, setMouseTop] = useState(false)

    return (
        <div className="card_main" ref={drag} style={isDragging ? { opacity: "0.3", backgroundColor: "grey" } : (highlight == true ? { marginTop: "50px" } : {})} >
            <p className="card_main_name">
                {cardname}
            </p>
            <div contentEditable="true" className="card_main_details" onInput={(e) => storeDesc(e)} ref={descBox}>  </div>
        </div >
    )
}