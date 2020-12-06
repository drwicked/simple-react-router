/* eslint-disable max-classes-per-file, no-restricted-globals, react/static-property-placement */
import React from 'react'
import PropTypes from 'prop-types'
import PathnameRouter from 'pathname-router'
import Location from './Location'

const instantiatePathnameRouter = (mapper, props) => {
  const router = new PathnameRouter()
  const map = (path, Component, params = {}) => router.map(path, { Component, ...params })
  mapper.call(null, map, props)
  return router
}

const staticResolver = (mapper) => {
  const router = instantiatePathnameRouter(mapper)
  return (location) => router.resolve(location.pathname)
}

const dynamicResolver = (mapper) => (location, props) => instantiatePathnameRouter(mapper, props).resolve(location.pathname)

class Router {
  constructor({ component, staticRoutes, getRoutes }) {
    this.component = component
    this.resolve = staticRoutes
      ? staticResolver(getRoutes)
      : dynamicResolver(getRoutes)
    this.rerender = this.rerender.bind(this)
    this.redirectTo = this.redirectTo.bind(this)
    addEventListener('popstate', this.rerender)
    this.update(component.props)
  }

  update(props = this.component.props) {
    this.location = new Location(window.location)
    this.location.params = this.resolve(this.location, props)
    this.component.location = this.location
  }

  rerender() {
    this.update()
    this.component.forceUpdate()
  }

  redirectTo(href, replace) {
    if (replace) {
      window.history.replaceState(null, document.title, href)
    } else {
      window.history.pushState(null, document.title, href)
    }
    this.rerender()
  }

  unmount() {
    removeEventListener('popstate', this.rerender)
  }
}

export default class SimpleReactRouter extends React.Component {
  static childContextTypes = {
    location: PropTypes.shape({
      origin: PropTypes.string,
      params: PropTypes.string,
      pathname: PropTypes.string,
    }).isRequired,
    redirectTo: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    if (process.env.NODE_ENV === 'development') {
      if (this.routes && this.getRoutes) throw new Error('you cannot define both routes() and getRoutes()')
      if (!this.routes && !this.getRoutes) throw new Error('you must define either routes() or getRoutes()')
    }

    this.router = new Router({
      component: this,
      staticRoutes: !!this.routes,
      getRoutes: this.routes || this.getRoutes,
    })
  }

  getChildContext() {
    return {
      location: this.router.location,
      redirectTo: this.router.redirectTo,
    }
  }

  componentDidUpdate(nextProps) {
    this.router.update(nextProps)
  }

  componentWillUnmount() {
    this.router.unmount()
  }

  render() {
    const { router } = this
    if (!router.location.params) {
      return React.createElement('span', null, 'No Route Found')
    }
    const { Component } = router.location.params
    const props = { ...this.props }
    props.location = router.location
    props.router = router;
    return React.createElement(Component, props)
  }
}
