import SeatComponent from "./seat";
import { useSeats } from "../../state/provider.jsx";

export default function CompartmentComponent() {
  const tainRows = [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 3];

  const { booked, recentlyBooked } = useSeats();

  function getId(r, c) {
    return 7 * r + c + 1;
  }

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="my-4 font-bold"> Front of train </div>
      {tainRows.map((v, r) => {
        return (
          <div key={r} className="flex items-center">
            <div className="text-xl font-bold text-slate-600 w-12 ">
              {" "}
              R{r + 1}{" "}
            </div>
            {Array.apply(null, { length: v }).map((_, s) => {
              const valueKey = getId(r, s);

              return (
                <SeatComponent
                  key={valueKey}
                  rowId={r + 1}
                  seatId={valueKey}
                  colId={s + 1}
                  isBooked={booked.includes(valueKey)}
                  isRecentlyBooked={recentlyBooked.includes(valueKey)}
                />
              );
            })}
          </div>
        );
      })}
      <div className="my-4 font-bold"> Back of train </div>
      <div className="flex flex-col  items-stretch justify-start">
        <div className="p-2 font-medium ">
          Algorithms & steps to book the seats
        </div>
        <div className="p-2"> 1. try to book all seats in one row </div>
        <div className="p-2">
          2. Try to book them in groups so the seats are close to each other, (using Graph and BFS)
        </div>
        <div className="p-2">
          3. Try to book them with minimum total gap between seats, ( prefix
          sum, sliding window )
        </div>
      </div>
    </div>
  );
}
