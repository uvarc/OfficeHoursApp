import React, { useState } from "react";
import Form from "react-bootstrap/Form";

const CascadingDropdownStorage = () => {
  const [selectedOption1, setSelectedOption1] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  const [options, setOptions] = useState(SSZ);

  const handleOptionChange = (event) => {
    setSelectedOption1(event.target.value);
    if (event.target.value === "HSZ") {
      setOptions(HSZ);
    } else {
      setOptions(SSZ);
    }
  };

  const handleSelectedOptionChange = (event) => {
    setSelectedOption2(event.target.value);
  };

  return (
    <div>
      <Form.Group className="mb-3" controlId="formDropDownStorage">
        <Form.Label>Storage Platform</Form.Label>
        <Form.Select onChange={handleOptionChange} value={selectedOption1}>
          <option value="">Select Option</option>
          <option value="SSZ">SSZ</option>
          <option value="HSZ">HSZ</option>
        </Form.Select>
        {selectedOption1 && (
          <Form.Select
            required
            onChange={handleSelectedOptionChange}
            value={selectedOption2}
            id="formDropDownStorage2"
          >
            <option value="">Select {selectedOption1} Option</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Select>
        )}
      </Form.Group>
    </div>
  );
};

const SSZ = [
  "Rivanna Home",
  "Rivanna Scratch",
  "Research Project",
  "Research Standard"
];

const HSZ = ["Ivy Home", "ICS", "Research Project (used for ACCORD)", "other"];

export default CascadingDropdownStorage;
