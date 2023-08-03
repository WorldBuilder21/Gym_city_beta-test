import { useState } from "react";
import { TextField, IconButton } from "@mui/material";
import { Dialog, Transition } from "@headlessui/react";
import { Close } from "@mui/icons-material";
import Selector from "../../Auth/Components/Selector";
import { useForm, Controller, useWatch } from "react-hook-form";
import InputAdornment from "@mui/material/InputAdornment";
import { useMutation } from "@tanstack/react-query";
import { updateGoalDoc } from "../../../Services/firebase";
import { useSelector } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import moment from "moment";

const goalTypes = [{ name: "Lossing weight" }, { name: "Gaining weight" }];

export default function GoalDialogBox({
  isOpen,
  Fragment,
  handleClose,
  startingWeight,
  refetch,
}) {
  const [selectedType, setSelectedType] = useState(goalTypes[0]);
  const [isLoading, setIsLoading] = useState(false);
  const { handleSubmit, getValues, control, watch, reset } = useForm();
  const custom_user = useSelector((state) => state.user.user);
  const [pickedDate, setPickedDate] = useState();

  const goalMutation = useMutation({
    mutationFn: updateGoalDoc,
    onSuccess: (data) => {
      setIsLoading(false);
      handleClose();
      reset();
      refetch();
    },
  });

  function getTotalWeeksBetweenMonths(deadline) {
    const currentDate = new Date();

    const endYear = new Date(deadline).getFullYear();
    const endMonth = new Date(deadline).getMonth();

    const endDate = new Date(endYear, endMonth + 1, 0);

    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
    const totalWeeks = Math.ceil((endDate - currentDate) / millisecondsPerWeek);

    return totalWeeks;
  }

  const onSubmit = async (data, e) => {
    e.preventDefault();
    const { current_weight, target_weight, deadline } = getValues();
    // console.log(new Date(deadline));
    setIsLoading(true);
    goalMutation.mutate({
      uid: custom_user.uid,
      currentWeight: current_weight,
      targetWeight: target_weight,
      goalStatus: selectedType,
      deadline: new Date(deadline),
    });
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            handleClose();
            reset();
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex flex-row items-center justify-between mb-2">
                    <Dialog.Title as="h3" className="font-semibold text-lg">
                      Set goal
                    </Dialog.Title>
                    <IconButton
                      onClick={() => {
                        handleClose();
                        reset();
                      }}
                    >
                      <Close />
                    </IconButton>
                  </div>
                  <Selector
                    Fragment={Fragment}
                    selectedType={selectedType}
                    list={goalTypes}
                    setSelectedType={setSelectedType}
                  />

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5 mt-4"
                  >
                    <Controller
                      name="current_weight"
                      defaultValue=""
                      control={control}
                      rules={{
                        required: "This field is empty.",
                        pattern: {
                          value:
                            /^([0-9]*[1-9][0-9]*(\.[0-9]+)?|[0]+\.[0-9]*[1-9][0-9]*)$/,
                          message: "Invalid weight",
                        },
                      }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <TextField
                          label="Current weight"
                          className="w-full"
                          type="number"
                          value={value}
                          error={!!error}
                          helperText={error ? error.message : null}
                          onChange={onChange}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">kg</InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                    <Controller
                      name="target_weight"
                      defaultValue=""
                      control={control}
                      rules={{
                        required: "This field is empty.",
                        validate: (val) => {
                          if (
                            // an error should be thrown if the Target weight is lower than the starting weight but the user chooses gaining weight as their goal
                            val < startingWeight &&
                            selectedType === goalTypes[1].name
                          ) {
                            return "Goal type and target weight don't match. You've chosen 'Gaining weight' but set a targeted weight lower than your starting weight. For 'Gaining weight,' the target should be higher. If you intend to lose weight, choose the 'Loss Weight' goal type";
                          }
                          if (
                            val > startingWeight &&
                            selectedType === goalTypes[0].name
                          ) {
                            return "Goal type and target weight don't match. You've chosen 'Losing weight' but set a targeted weight lower than your starting weight. For 'Losing weight,' the target should be lower. If you intend to gain weight, choose the 'Gaining Weight' goal type";
                          }
                          if (val === startingWeight) {
                            return "Your target weight cannot be the same as your starting weight";
                          }
                        },
                        pattern: {
                          value:
                            /^([0-9]*[1-9][0-9]*(\.[0-9]+)?|[0]+\.[0-9]*[1-9][0-9]*)$/,
                          message: "Invalid weight",
                        },
                      }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <TextField
                          label="Target weight"
                          className="w-full"
                          type="number"
                          value={value}
                          error={!!error}
                          helperText={error ? error.message : null}
                          onChange={onChange}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">kg</InputAdornment>
                            ),
                          }}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="deadline"
                      rules={{
                        required: "This field is required.",
                        validate: (val) => {
                          const d = new Date();
                          const formatted = moment(d).format("MMMM YYYY");

                          const format_val = moment(new Date(val)).format(
                            "MMMM YYYY"
                          );

                          console.log("val:", format_val);
                          console.log("formatted:", formatted);

                          if (formatted === format_val) {
                            return "You cannot pick this month.";
                          }
                        },
                      }}
                      render={({
                        field: { onChange, value },
                        fieldState: { error },
                      }) => (
                        <DatePicker
                          className="w-full"
                          onChange={onChange}
                          value={pickedDate}
                          label="Deadline"
                          views={["month", "year"]}
                          slotProps={{
                            textField: {
                              margin: "normal",
                              helperText: error ? error.message : null,
                              error: !!error,
                            },
                          }}
                        />
                      )}
                    />
                    {watch("deadline") ? (
                      <div className="flex">
                        <h1 className="font-semibold">
                          Total number of weeks:
                        </h1>
                        <p className="ml-2">
                          {getTotalWeeksBetweenMonths(watch("deadline"))} weeks
                        </p>
                      </div>
                    ) : (
                      <></>
                    )}
                    <button
                      className="w-full disabled:opacity-25  text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      type="submit"
                      disabled={isLoading}
                    >
                      Done
                    </button>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </LocalizationProvider>
  );
}
