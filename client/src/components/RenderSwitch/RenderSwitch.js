import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CustomInput } from 'reactstrap';

class RenderSwitch extends Component {
  render() {
    const {
      input,
      label,
      className,
      disabled,
      autoComplete,
      onChangeListener, // onChange is great, unless you want to run a function/saga that fetches all form values which you expect to include the change performed in this event.
      meta,
    } = this.props;

    return (
      <CustomInput
        {...input}
        id={`${meta.form}-${input.name}-switch`}
        label={label}
        type="switch"
        className={className}
        disabled={disabled}
        autoComplete={autoComplete}
        onChange={(evt) => {
          input.onChange(evt); // do this first - else redux-form reducer won't have run before our func is run.
          if (onChangeListener) {
            onChangeListener();
          }
        }}
        checked={input.value}
      />
    );
  }
}

RenderSwitch.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default RenderSwitch;
