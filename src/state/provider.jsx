import { createContext, useContext, useReducer } from "react"
import { AppReducer } from "./reducer"


export const initialState = {
    booked:[],
    recentlyBooked:[]
  }

const AppContext = createContext(null)
const AppContextDispatch = createContext(null)
  
export function useSeats(){
    return useContext(AppContext)
  }
export function useSeatsDispatch(){
    return useContext(AppContextDispatch)
  }

export function AppProvider({children}){
    const [state,dispatch] = useReducer(AppReducer,initialState)  

    return (
        <AppContext.Provider value={state} >
        <AppContextDispatch.Provider value={dispatch} >
            {children}
        </AppContextDispatch.Provider>
        </AppContext.Provider>
    )
}