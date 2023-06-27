import { createSlice, current } from '@reduxjs/toolkit'

export const taskSlice = createSlice({
    name: 'task',
    initialState: [],
    reducers: {
        add(state, action) {
            state.push(action.payload)
        },
        remove(state, action) {
            console.log(action.payload, current(state), " before remove")
            // let filtered_task = state.filter((elem) => {
            //     if (elem.name != action.payload)
            //         return true
            //     return false
            // })
            let delete_index = -1
            for (let index = 0; index < state.length; index++) {
                if (state[index].name == action.payload) {
                    delete_index = index;
                    break;
                }
            }
            state.splice(delete_index, 1)
        },
        addCard(state, action) {

            let { taskname, cardObj } = action.payload
            console.log(taskname, cardObj, " inside adding card")
            //find task with name 
            let taskIndex = -1
            for (let i = 0; i < state.length; i++) {
                if (state[i].name == taskname) {
                    taskIndex = i;
                    break;
                }
            }

            if (taskIndex != -1)
                state[taskIndex].cards.push(cardObj)
        },
        addCardIndex(state, action) {

            let { taskname, cardObj, index, dragIndex, dragTaskname } = action.payload
            console.log(taskname, " inside add card indexxxxxxxxxxxxxxxxxxx", index, cardObj)

            let taskIndex = -1
            for (let i = 0; i < state.length; i++) {
                if (state[i].name == taskname) {
                    taskIndex = i;
                    break;
                }
            }

            let dragtaskIndex = -1
            for (let i = 0; i < state.length; i++) {
                if (state[i].name == dragTaskname) {
                    dragtaskIndex = i;
                    break;
                }
            }

            let obj = state[dragtaskIndex].cards[dragIndex];
            console.log(obj, " objjjjjjjjjjjjjjjjjjjj thats picked with")

            state[taskIndex].cards.splice(index, 0, cardObj)
        },
        addEmptyPreview(state, action) {
            console.log(action.payload, " yeah hai preview index")
            let { taskname, index } = action.payload
            let taskIndex = -1
            for (let i = 0; i < state.length; i++) {
                if (state[i].name == taskname) {
                    taskIndex = i;
                    break;
                }
            }

            // state[taskIndex].cards.splice(index, 0, {})
        },
        addCardDescription(state, action) {

            let { taskname, cardname, carddesc } = action.payload
            console.log(taskname, cardname, carddesc)
            // find task
            let taskIndex = -1
            for (let i = 0; i < state.length; i++) {
                if (state[i].name == taskname) {
                    taskIndex = i;
                    break;
                }
            }

            //find card
            let cardIndex = -1
            for (let i = 0; i < state[taskIndex].cards?.length; i++) {
                // console.log(cardname, state[taskIndex].cards[i].cardname)
                if (cardname == state[taskIndex].cards[i].cardname) {
                    cardIndex = i;
                    break;
                }
            }

            if (cardIndex != -1) {
                state[taskIndex].cards[cardIndex].carddesc = carddesc
            }
            else {
                console.log("cant find cardindex in addCardDescription")
            }
        },
        deleteDraggedCard(state, action) {
            let { taskname, cardObj, dragIndex, dropTaskname, dropIndex } = action.payload
            console.log(" doubt hai", taskname, cardObj, dragIndex, " inside delete draggeddddddddddddddddd")

            let taskIndex = -1
            for (let i = 0; i < state.length; i++) {
                if (state[i].name == taskname) {
                    taskIndex = i;
                    break;
                }
            }

            if (taskname == dropTaskname) {
                if (dropIndex > dragIndex) {
                    // dropping the same element below itself somehwere

                    //do nothing
                }
                else {
                    dragIndex += 1
                }
            }

            if (state[taskIndex].cards[dragIndex].cardname == cardObj.cardname)
                state[taskIndex].cards.splice(dragIndex, 1)


        },
    }
})

console.log(taskSlice, "this is task slice", taskSlice.actions)


export const { add, remove, addCard, addCardIndex, addEmptyPreview, addCardDescription, deleteDraggedCard } = taskSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`

export default taskSlice.reducer
