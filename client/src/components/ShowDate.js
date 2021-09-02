import React, { useState, useEffect } from "react";

const ShowDate = ({ create, update }) => {
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (create < update) {
      console.log(create);
      setDate(update);
    } else {
      setDate(create);
    }
  }, [create, update]);

  return <>{date}</>;
};

export default ShowDate;
