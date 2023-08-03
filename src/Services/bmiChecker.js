export const bmiCalaculator = (userheight, userweight) => {
  const weight = parseFloat(userweight);
  const height = parseFloat(userheight);
  const bmi = (weight / height ** 2) * 10000;
  const round_bmi = bmi.toFixed(1);
  return round_bmi;
};

export const bmiTextStatus = (userheight, userweight) => {
  const bmi = bmiCalaculator(userheight, userweight);
  console.log(bmi);
  if (bmi <= 18.4) {
    return "text-[#FFE189]";
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return "text-green-600";
  } else if (bmi >= 25.0 && bmi <= 39.9) {
    return "text-[#FFB54C]";
  } else if (bmi >= 40.0) {
    return "text-red-700";
  }
};

export const bmiBorderColor = (userheight, userweight) => {
  const colorbmi = bmiCalaculator(userheight, userweight);
  console.log("color:", colorbmi);
  if (colorbmi <= 18.4) {
    return "bg-[#FFE189] text-amber-800 border-amber-400";
  } else if (colorbmi >= 18.5 && colorbmi <= 24.9) {
    return "text-green-800 border-green-400 bg-green-500";
  } else if (colorbmi >= 25.0 && colorbmi <= 39.9) {
    return "bg-[#FFB54C] text-amber-800 border-amber-400";
  } else if (colorbmi >= 40.0) {
    return "bg-red-100 text-red-800 border-red-400";
  }
};

export const bmiBorderStatus = (userheight, userweight) => {
  const colorbmi = bmiCalaculator(userheight, userweight);
  console.log("color:", colorbmi);
  if (colorbmi <= 18.4) {
    return "Underweight";
  } else if (colorbmi >= 18.5 && colorbmi <= 24.9) {
    return "Normal";
  } else if (colorbmi >= 25.0 && colorbmi <= 39.9) {
    return "Overweight";
  } else if (colorbmi >= 40.0) {
    return "Obese";
  }
};
