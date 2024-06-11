import React from "react";

const AvailabilityShowModel = ({
  isOpen,
  availableParticipants,
  unavailableParticipants,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-blackD p-4 rounded  w-[30%]" onMouseLeave={onClose}>
        <button
          onClick={onClose}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Close
        </button>

        <div className="flex  justify-between">
          <div className="flex flex-col gap-2">
            <strong className="text-greenF">Available:</strong>
            <ul>
              {availableParticipants.map((participant) => (
                <li key={participant} className="text-white">
                  {participant}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <strong className="text-greenF">Unavailable:</strong>
            <ul>
              {unavailableParticipants.map((participant) => (
                <li key={participant} className="text-white">
                  {participant}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityShowModel;
