import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'frontity'

const Link = ({actions, link, className, children}) => {
  const onClick = event => {
    // Do nothing if it's an external link
    if (link.startsWith('http')) return

    event.preventDefault()
    // Set the router to the new url.
    actions.router.set(link)
    window.scrollTo(0, 0)
  }

  return (
    <a href={link} onClick={onClick} className={className}>
      {children}
    </a>
  )
}

Link.propTypes = {
  actions: PropTypes.obj,
  link: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node
}

export default connect(Link)
