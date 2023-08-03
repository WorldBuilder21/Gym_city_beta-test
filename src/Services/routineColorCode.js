export default function routineColorCode(data) {
  if (data.difficulty.name === "Beginner") {
    return "bg-green-500";
  }
  if (data.difficulty.name === "Intermediate") {
    return "bg-amber-500";
  }
  if (data.difficulty.name === "Expert") {
    return "bg-red-500";
  }
}
