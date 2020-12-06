import React, { Component as Comp } from 'react'
import PropTypes from 'prop-types'

class Link extends Comp {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    if (this.props.onClick) {
      this.props.onClick(event)
    }

    if (event.defaultPrevented) return

    if (!this.props.externalLink && !event.ctrlKey && !event.metaKey && !event.shiftKey && this.isSameOrigin()) {
      event.preventDefault()
      this.context.redirectTo(this.props.href, !!this.props.replace)
    }
  }

  isSameOrigin() {
    const { href } = this.props
    return !href.match(/^https?:\/\//) || href.startsWith(window.location.origin)
  }

  render() {
    const props = { ...this.props }
    const { Component } = props
    delete props.Component
    delete props.externalLink
    props.href = props.href || ''
    props.onClick = this.onClick
    return <Component ref={node => { this.link = node }} {...props}>{props.children}</Component>
  }
}

Link.contextTypes = {
  redirectTo: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  location: PropTypes.shape({
    origin: PropTypes.string,
  }).isRequired,
};

Link.propTypes = {
  Component: PropTypes.node.isRequired,
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  href: PropTypes.string,
  path: PropTypes.string,
  onClick: PropTypes.func,
  externalLink: PropTypes.bool,
};

Link.defaultProps = {
  Component: 'a',
  externalLink: false,
};

export default Link
