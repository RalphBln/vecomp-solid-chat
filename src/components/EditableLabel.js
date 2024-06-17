import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const EditableLabel = ({
	initialValue,
	save,
    check,
	disableKeys,
	inputClass,
	labelClass,
	inputName,
	inputId,
	user,
	getValue
}) => {
	const [view, setView] = useState('label');
	const [value, setValue] = useState(initialValue);
	const [previous, setPrevious] = useState(initialValue);
	const textInput = useRef(null);

	useEffect(() => {
		if (view === 'text') {
			textInput.current.focus();
		}
	}, [view, textInput]);

	useEffect(() => {
		console.log("### Editable label: user updated");
		if (view === 'label') {
			setValue(getValue());
		}
	}, [user, view, getValue]);

	const keyUp = (e) => {
		if (disableKeys === true) {
			return;
		}

		if (e.key === 'Escape') {
			setValue(previous);
			setView('label');
		} else if (e.key === 'Enter') {
            try {
                check(e.target.value); // throws error if unsuccessful
                setValue(e.target.value);
                setPrevious(e.target.value);
                setView('label');
                save(e.target.value);
            } catch (error) {
                console.log(error);
                setValue(previous);
                setView('label');
            }
		}
	};

	const renderLabel = () => {
		return (
			<span
				className={labelClass !== undefined ? labelClass : ''}
				onClick={(e) => {
					setView('text');
				}}
			>
				{value}
			</span>
		);
	};

	const renderInput = () => {
		return (
			<div>
				<input
					type='text'
					value={value}
					ref={textInput}
					className={inputClass !== undefined ? inputClass : ''}
					id={inputId !== undefined ? inputId : ''}
					name={inputName !== undefined ? inputName : ''}
					onChange={(e) => {
						setValue(e.target.value);
					}}
					onBlur={(e) => {
						setView('label');
						setPrevious(e.target.value);

						save(e.target.value);
					}}
					onKeyUp={keyUp}
				/>
			</div>
		);
	};

	return view === 'label' ? renderLabel() : renderInput();
};

EditableLabel.propTypes = {
	initialValue: PropTypes.string.isRequired,
	save: PropTypes.func.isRequired,
	check: PropTypes.func,
	labelClass: PropTypes.string,
	inputClass: PropTypes.string,
	inputName: PropTypes.string,
	inputId: PropTypes.string,
	disableKeys: PropTypes.bool,
};

export default EditableLabel;