import PropTypes from "prop-types";
import styles from "./Button.module.css";

const Button = ({ label, onClick }) => {
  return (
    <button type="button" onClick={onClick} className={styles.button}>
      {label}
    </button>
  );
};

Button.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
