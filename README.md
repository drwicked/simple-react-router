# simple-react-router

## Why

React Router is too heavy weight. Most of my projects just need a dead simple top level router.

This is that router.

## Usage

#### Static Routes

To create a static router simply subclass from `SimpleReactRouter` and define the `routes()` method.

```js
import React from 'react'
import SimpleReactRouter from 'simple-react-router'

// Pages
import NotFound from './components/NotFound'
import HomePage from './components/HomePage'
import SignupPage from './components/SignupPage'
import LoginPage from './components/LoginPage'
import LogoutPage from './components/LogoutPage'
import PostIndexPage from './components/PostIndexPage'
import NewPostPage from './components/NewPostPage'
import PostShowPage from './components/PostShowPage'
import PostEditPage from './components/PostEditPage'

export default class Router extends SimpleReactRouter {
  routes(map){
    map('/',                   HomePage)
    map('/signup',             SignupPage)
    map('/login',              LoginPage)
    map('/logout',             LogoutPage)
    map('/posts',              PostIndexPage)
    map('/posts/new',          NewPostPage)
    map('/posts/:postId',      PostShowPage)
    map('/posts/:postId/edit', PostEditPage)
    map('*path',               NotFound) // catchall route
  }
}
```
The route exression syntax is based on [backbone.js](http://backbonejs.org/#Router-route). If anything doesnt work as expected please [create and issue here](https://github.com/deadlyicon/simple-react-router/issues).

#### Dynamic Routes

To use dynamic routes define `getRoute()` instead of `routes()` and you're routes will be calculated every time the `Router` component is constructed or receives props.


```js
import React from 'react'
import SimpleReactRouter from 'simple-react-router'

// Pages
import NotFound from './components/NotFound'
import HomePage from './components/HomePage'
import SignupPage from './components/SignupPage'
import LoginPage from './components/LoginPage'
import LogoutPage from './components/LogoutPage'
import PostIndexPage from './components/PostIndexPage'
import NewPostPage from './components/NewPostPage'
import PostShowPage from './components/PostShowPage'
import PostEditPage from './components/PostEditPage'

export default class Router extends SimpleReactRouter {
  getRoutes(map, props){
    const { loggedIn } = props
    if (loggedIn){
      map('/',                   LoggedInHomePage)
      map('/logout',             LogoutPage)
      map('/posts/new',          NewPostPage)
      map('/posts/:postId/edit', PostEditPage)
    } else {
      map('/',       LoggedOutHomePage)
      map('/signup', SignupPage)
      map('/login',  LoginPage)
    }
    map('/posts',         PostIndexPage)
    map('/posts/:postId', PostShowPage)
    map('*path',          NotFound) // catchall route
  }
}
```
