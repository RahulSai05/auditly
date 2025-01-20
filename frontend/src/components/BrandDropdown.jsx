import React from "react";

const BrandDropdown = ({ brands, onChange }) => {
  return (
    <div>
      <label>Select Brand:</label>
      <select onChange={onChange}>
        <option value="">--Choose a Brand--</option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.brand_name}>
            {brand.brand_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BrandDropdown;
  