import { useWatch } from "react-hook-form";

function Charactercounter({ control, number, defaultValue, name }) {
  const bio = useWatch({
    control,
    name: name,
    defaultValue: defaultValue,
  });
  return (
    <p
      className={`${
        bio.length >= 200 ? "text-red-500" : "text-slate-400"
      } flex flex-row items-end justify-end`}
    >
      {bio.length} /{number} characters
    </p>
  );
}

export default Charactercounter;
