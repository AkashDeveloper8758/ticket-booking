/* eslint-disable react-hooks/exhaustive-deps */
import CompartmentComponent from "./train/compartment";
import { Actions, LocalKeys } from "../state/reducer";
import { useSeats, useSeatsDispatch } from "../state/provider";
import { useEffect } from "react";
import { useState } from "react";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MainComponent() {
  const dispatch = useSeatsDispatch();
  const state = useSeats();
  const [isLoading, setIsLoading] = useState(false);
  const [seatsCount, setSeatsCount] = useState(0);

  function getId(r, c) {
    return 7 * r + c + 1;
  }

  function generateGraphAdjacencyMatrix() {
    let adj = {};
    for (let i = 0; i < 11; i++) {
      for (let j = 0; j < 7; j++) {
        let dirs = [
          [-1, 0],
          [1, 0],
          [0, 1],
          [0, -1],
        ];
        for (let d of dirs) {
          let [nx, ny] = [i + d[0], j + d[1]];
          if (nx >= 0 && nx < 11 && ny >= 0 && ny < 7) {
            adj[getId(i, j)] = adj[getId(i, j)] ?? [];
            adj[getId(i, j)].push(getId(nx, ny));
          }
        }
      }
    }
    // other 6 combinations for 3 extra seats at the end
    adj[78] = [73, 79];
    adj[79] = [78, 80, 74];
    adj[80] = [79, 75];

    adj[73] = [78];
    adj[74] = [79];
    adj[75] = [80];
    return adj;
  }

  async function fetchData() {
    const allBookedSeats = JSON.parse(localStorage.getItem(LocalKeys.allBookedSeats))
    const recentBookedSeata = JSON.parse( localStorage.getItem(LocalKeys.recentlyBooked))
    // console.log('all seats : ',JSON.parse(allBookedSeats))

    dispatch({type:Actions.addSeates , payload: allBookedSeats })
    dispatch({type:Actions.setRecentlyBookedSeats, payload: recentBookedSeata})
    
  }
  useEffect(() => {
    fetchData()
  }, []);

  function bfs(start, targetLength, visited) {
    let queue = [start];
    let res = [start];
    visited.push(start);
    let adjGraph = generateGraphAdjacencyMatrix();
    while (queue.length > 0) {
      if (res.length == targetLength) return res;
      let v = queue.shift();
    //   console.log("bfs value : ", adjGraph);
      for (let u of adjGraph[v]) {
        if (!visited.includes(u)) {
          queue.push(u);
          res.push(u);
          visited.push(u);
        }
        if (res.length == targetLength) return res;
      }
    }
    return [];
  }

  function nearestGroupSearchWithGraph(currVis, targetSeats) {
    let visited = [...currVis];
    console.log("-- bfs starts ---");
    for (let i = 1; i <= 80; i++) {
      if (!visited.includes(i)) {
        let output = bfs(i, targetSeats, visited);
        if (output.length > 0) {
          console.log("-- bfs successfull ---");

          return output;
        }
      }
    }
    console.log("-- bfs fails ---");
    return [];
  }

  function nearestLinearSearch(targetSeats, bookedSeats) {
    console.log('--- nearest lenear search -- starts')
    let [res, minDist, tempRes, distCounter] = [[], 80 * 3, [], 0];

    for (let i = 1; i <= 80; i++) {
      if (!bookedSeats.includes(i)) {
        if (tempRes.length > 0) {
          // add the distance diff between current and last picked seat
          distCounter += i - tempRes.at(-1);

          if (tempRes.length == targetSeats) {
            // if length is already equal to required seats, then remove the first picked seat
            let first = tempRes.shift();
            distCounter -= tempRes[0] - first;
            // push the new seat
          }
          tempRes.push(i);
          console.log('-- > ',[distCounter,minDist,tempRes])
          if (distCounter < minDist && tempRes.length == targetSeats) {
            minDist = distCounter;
            res = [...tempRes];
          }
        }else{
            tempRes.push(i)
        }
      }
    }
    return res;
  }
  function linearRowSearch(targetSeats, bookedSeats) {
    let currentBookings = bookedSeats;
    // console.log('current logged ',[currentBookings.length,seatsCount])

    let currentSeat = 1;
    // check if possible to allocate seats in one row

    while (currentSeat <= 80) {
      let innerCount = 0;

      let seatArr = [];
      let allocatedSeats = 0;
      // check if possible in one looop
      while (innerCount < 7) {
        if (!currentBookings.includes(currentSeat) && currentSeat < 81) {
          seatArr.push(currentSeat);

          allocatedSeats += 1;
          if (allocatedSeats == targetSeats) {
            return seatArr;
          }
        }
        innerCount += 1;
        currentSeat += 1;
      }
      // check in multiple rows with minimum distances using Graph BFS
    }
    return [];
  }

  function getCollectiveSeats() {
    // console.log('current state : ',state)
    if (80 - state.booked.length < seatsCount) return [];

    let res = [];
    // try to find all seats in one row
    res = linearRowSearch(seatsCount, [...state.booked]);
    if (res.length == 0) {
      // try to find all seats in one group
      res = nearestGroupSearchWithGraph([...state.booked], seatsCount);
    }
    if (res.length == 0) {
      // try to find all seats with minimum total distance between seats
      res = nearestLinearSearch(seatsCount, [...state.booked]);
    }
    return res;
  }

  function onButtonPress() {
    if (seatsCount > 0 && seatsCount < 8) {
      let res = getCollectiveSeats();
      console.log("res : ", res);
      if (res.length == 0) {
        let warningText = "";
        if (state.booked.length == 80) {
          warningText = "No seats are not available";
        } else {
          warningText = `${seatsCount} seats are not available`;
        }
        toast.warning(warningText, {
          autoClose: 2000,
        });
      } else {
        dispatch({ type: Actions.addSeates, payload: res });
        dispatch({ type: Actions.setRecentlyBookedSeats, payload: res });
      }
    } else {
      toast("seats must be between 1 and 7");
    }
  }
  function clearAllSeats(){
    dispatch({type:Actions.clearSeats})
  }

  return (
    <div className="p-12 w-full">
      <div className=" flex flex-col justify-center items-center w-full">
        <div className="flex flex-col md:flex-row w-full justify-center items-center  ">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("-- submitting -- ");
              onButtonPress();
            }}
          >
            <input
              name="Enter number"
              className="border-2 p-2 w-56  m-1"
              type="number"
              min={1}
              onChange={(e) => setSeatsCount(parseInt(e.target.value) ?? 0)}
              max={7}
              placeholder="Enter no of seats to book"
            />
          </form>
          <button
            onClick={onButtonPress}
            className="border px-4 mx-2 hover:bg-slate-300 p-2 m-1"
          >
            Book Ticket
          </button>
          <button
            onClick={clearAllSeats}
            className="border px-4 mx-2 hover:bg-slate-300 p-2 m-1"
          >
            Clear All Seats
          </button>

          <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Slide}
          />
          {isLoading && (
            <p className="p-2 text-green-500"> fetching tickets ...</p>
          )}
        </div>
        <p className="text-slate-600 my-2">
          {" "}
          You can select seats between 1 - 7
        </p>
        <div className="flex ">
            <div className="flex p-2">
                <div className="bg-green-300 h-6 w-6 rounded-full " />
                <div className="ml-2"> Recently booked seats</div>
            </div>
            <div className="flex p-2">
                <div className="bg-slate-200 h-6 w-6 rounded-full " />
                <div className="ml-2"> Already Booked seats</div>
            </div>
        </div>
        <div className="flex m-2">
            {state.recentlyBooked.map((item)=>{
                let r = Math.floor(item / 7 + 1)
                if(item % 7 == 0 ) r -=1
                let c = (item-1) % 7 + 1
                return <div className="mr-2 flex border " key={item}> 
                <div className="p-2 bg-blue-100">R{r} : {c}</div>
                <div className="p-2 bg-slate-500 text-white">{item}</div>
                
                 </div>
            })}
        </div>
        <div className="w-full mt-12">
          <CompartmentComponent />
        </div>
      </div>
    </div>
  );
}


//todo: 1. add color market
//todo: 1. add instructions
//todo: 1. link to the backend