import React from "react";

const ItemDropdown = ({ items, disabled }) => {
  return (
    <div>
      <label htmlFor="item">Select Item:</label>
      <select id="item" disabled={disabled}>
        <option value="">--Choose an Item--</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.item_description}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ItemDropdown;
