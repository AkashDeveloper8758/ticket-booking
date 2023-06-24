
export const Actions = {
    addSeates: 'addSeates',
    clearSeats: "clearSeats",
    setRecentlyBookedSeats: "setRecentlyBookedSeats"
}

export function AppReducer(state, action) {
    switch (action.type) {
        case Actions.addSeates: {
            const data = action.payload
            const newData = new Set([...state.booked,...data])
            return {
                ...state,
                booked: [...newData],
            }
        }
        case Actions.clearSeats:{   
            return {
                ...state,
                booked: [],
                recentlyBooked: [],
            }
        }
        case Actions.setRecentlyBookedSeats:{
            return {
                ...state,
                recentlyBooked: [...action.payload]
            }
        }
        default: {
            return state
        }

    }
}


