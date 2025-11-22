import { Plus } from "lucide-react";
import Button from "../components/Button";
import Input from "../components/Input";
import { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../context/ContextProvider";

const AddToListPopup = () => {
  const popupRef = useRef(null);

  const { hidePopup, setHidePopup } = useContext(Context);

  useEffect(() => {
    const handleClose = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setHidePopup(true);
      }
    };

    document.addEventListener("mousedown", handleClose);

    return () => document.removeEventListener("mousedown", handleClose);
  }, []);
  const List = ({ name, count = 0 }) => {
    return (
      <div className="flex p-2 items-center justify-center bg-[var(--primary)]/20 rounded-lg">
        <h3 className="text-xl p-2 inter-medium text-[var(--primary)] font-sans font-medium">
          {name} ({count})
        </h3>

        <div className="ml-auto">
          <Button type="primary" icon={<Plus />} />
        </div>
      </div>
    );
  };
  return (
    <>
      {!hidePopup && (
        <div className="flex  fixed w-full  items-center justify-center h-full top-0 bg-black/20 border">
          <div
            ref={popupRef}
            className="w-150 h-max p-5 gap-[20px] flex flex-col bg-white border border-gray-200 shadow-xl rounded-md "
          >
            <h2 className="text-2xl inter-semibold text-[var(--primary)]">
              User Lists
            </h2>

            <div className="flex flex-col gap-2">
              <List name={`Fiction`} />
              <List name={`Horror`} />
              <List name={`Life`} />
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-2xl p-2 inter-medium text-[var(--primary)] inter-semibold">
                Create List
              </h2>
              <div className="flex items-center justify-center gap-[10px] w-full">
                <Input placeholder={`List name`} />
                <Button type="secondary" icon={<Plus />} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddToListPopup;
