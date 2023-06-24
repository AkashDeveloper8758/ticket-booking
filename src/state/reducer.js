
export const Actions = {
    addSeates: 'addSeates',
    clearSeats: "clearSeats",
    setRecentlyBookedSeats: "setRecentlyBookedSeats"
}

export const LocalKeys = {
    allBookedSeats :  'allBookedSeats',
    recentlyBooked: "recentlyBooked",
}

export function AppReducer(state, action) {
    switch (action.type) {
        case Actions.addSeates: {
            const data = action.payload
            const newData = new Set([...state.booked,...data])
            localStorage.setItem(LocalKeys.allBookedSeats, JSON.stringify([...newData]))
            return {
                ...state,
                booked: [...newData],
            }
        }
        case Actions.clearSeats:{   
            localStorage.setItem(LocalKeys.allBookedSeats, JSON.stringify([]))
            localStorage.setItem(LocalKeys.recentlyBooked, JSON.stringify([]))
            return {
                ...state,
                booked: [],
                recentlyBooked: [],
            }
        }
        case Actions.setRecentlyBookedSeats:{
            localStorage.setItem(LocalKeys.recentlyBooked, JSON.stringify([...action.payload]))
            
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


