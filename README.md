# Spiderable for Meteor (NO PhantomJS)

Using [Meteorhacks:SSR](http://atmospherejs.com/meteorhacks/ssr) and [Iron:Router](http://atmospherejs.com/iron/router).

A __temporary solution__ for spiderability to Meteor without PhantomJS and similar
until Meteor and Iron:Router supports server-side rendering.

> Notice! Should not work with coffee script. And probably not on Windows (untested).

## Installation

```
meteor add studiointeract:spiderable
```

## Usage

> This package renders templates on the server.

First create a symlink for the client folder to private.

```
meteor create my-app
cd my-app
ln -s client/ private/
```

Add ```?_escaped_fragment_=``` to the query of your routes and it will now render with SSR!

For example visit the frontpage of your app:
http://localhost:3000/?_escaped_fragment_=

## The trick to make this work

We symlink the client folder to private, which makes it available on the server.

## How it works

1. By loading all client templates and scripts as assets via private.
2. Compiling templates data into templates.
3. Parsing Iron:Router and extracting where all templates and layouts should go.

> Notice! Use with caution – test all routes so they don't break your app!

> Notice! It is __now__ important to make sure things can run on the server too.
