import React from 'react';
import PropTypes from 'prop-types';
import Link from './Link';

function ButtonLink(props) {
  const { children } = props;
  return <Link Component="button" {...props}>{ children }</Link>
}

ButtonLink.propTypes = {
  children: PropTypes.element.isRequired,
}

export default ButtonLink;
