import PropTypes from "prop-types";

import styles from "./Input.module.css";

const Input = ({ value, label, name, placeholder, type, onChange }) => (
  <div>
    {label && (
      <label htmlFor="input-field" className={styles.label}>
        {label}
      </label>
    )}
    <input
      id="input-field"
      type={type}
      value={value}
      name={name}
      className={styles.input}
      placeholder={placeholder}
      onChange={onChange}
    />
  </div>
);

Input.propTypes = {
  value: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
};

export default Input;
