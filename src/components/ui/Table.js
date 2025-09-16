// components/ui/Table.js
import React from "react";

export default function Table({ columns, data, onRowClick }) {

  function getValueByPath(obj, path) {
    if (!path) return undefined;
    return path
      .replace(/\?/g, "") // remove all "?" so productId?.name → productId.name
      .split(".")
      .reduce((acc, key) => acc?.[key], obj);
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-jewelGold text-white">
            {columns.map((col, index) => (
              <th key={index} className="p-3 text-left font-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={`border-b border-gray-200 hover:bg-amber-50 cursor-pointer ${row.stock < 10 ? "text-red-500" : ""
                }`}
            >
              {columns.map((col, colIndex) => {
                return (
                  <td key={colIndex} className="p-3">
                    {col.render ? col.render(row) : getValueByPath(row, col.key)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
