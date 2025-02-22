import React from "react";

const TableHeader = ({
  AdditionalRowClasses = "",
  AdditionalHeaderClasses = "",
  Headers = [],
}) => {
  return (
    <thead className="bg-slate-900">
      <tr
        className={`${AdditionalRowClasses} border-b border-slate-700 text-lg font-medium tracking-wider text-slate-100`}
      >
        {Headers.map((header, i) => (
          <th
            key={i}
            className={`${AdditionalHeaderClasses} p-4 text-left transition-colors duration-200`}
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

const RowWithCheckbox = ({ keys, disabled, value, handleFormChange }) => {
  return (
    <tr
      key={keys}
      className={`group border-t border-slate-700 transition-all duration-300 ease-in-out ${
        value.present
          ? "bg-violet-900/30 hover:bg-violet-900/50"
          : "bg-slate-800 hover:bg-slate-700"
      }`}
    >
      <td className="p-3 text-center">
        <div className="relative inline-block">
          <input
            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-500 bg-slate-700 transition-all duration-200 checked:border-violet-500 checked:bg-violet-600 hover:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            type="checkbox"
            required
            disabled={disabled}
            id={keys}
            checked={value.present}
            onChange={(e) => handleFormChange(e)}
          />
          <svg
            className="pointer-events-none absolute -top-[2px] left-0 h-5 w-5 opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </td>
      <td className="px-4 py-3 text-left">
        <span className="text-lg font-medium text-slate-100 transition-colors duration-200 group-hover:text-white">
          {value.student?.name || value?.name}
        </span>
      </td>
    </tr>
  );
};

// Example usage component
const ExampleTable = () => {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <TableHeader
            Headers={["Select", "Name"]}
            AdditionalHeaderClasses="first:rounded-tl-lg last:rounded-tr-lg"
          />
          <tbody>
            <RowWithCheckbox
              keys="1"
              value={{ present: true, name: "John Doe" }}
              handleFormChange={() => {}}
            />
            <RowWithCheckbox
              keys="2"
              value={{ present: false, name: "Jane Smith" }}
              handleFormChange={() => {}}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { RowWithCheckbox, TableHeader, ExampleTable };