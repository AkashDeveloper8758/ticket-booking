// eslint-disable-next-line react/prop-types
function SeatComponent({
  seatId,
  rowId,
  colId,
  isBooked,
  isRecentlyBooked,
}) {
  return (
    <div className={` relative w-20 h-20 border-2 m-1 p-2 hover:bg-slate-200 ${(isBooked && !isRecentlyBooked) && "bg-slate-200 " } ${isRecentlyBooked && "bg-green-300" } `}>
      <div className="absolute bottom-2 right-2 text-xs">
        R{rowId}-{colId} ({seatId})
      </div>
    </div>
  );
}

export default SeatComponent