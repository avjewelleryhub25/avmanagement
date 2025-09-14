// components/ui/Table.js
import React from "react";

export default function Table({ columns, data, onRowClick }) {
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
              className={`border-b border-gray-200 hover:bg-amber-50 cursor-pointer ${
                row.stock < 10 ? "text-red-500" : ""
              }`}
            >
              {columns.map((col, colIndex) => {
                console.log(row["productId.name"],"--------------",row);
                
                return(
                <td key={colIndex} className="p-3">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              )})}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
