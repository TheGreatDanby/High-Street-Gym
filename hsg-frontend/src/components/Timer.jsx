import React, { useState, useEffect } from "react";

function CountdownTimer() {
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    const targetDate = new Date("2023-04-20T09:30:00");
    const intervalId = setInterval(() => {
      const now = new Date();
      const difference = targetDate - now;
      setRemainingTime(difference);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
  const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));

  return (
    <div>
      <span className="badge badge-info gap-2">
        Next Session starts in {days} days and {hours}h:{minutes}m
      </span>
    </div>
  );
}

export default CountdownTimer;
