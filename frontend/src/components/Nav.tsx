import React from 'react'
import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <nav>
      <Link to={'/dashboard'}>Dashboard</Link>
      <Link to={'/history'}>History</Link>
    </nav>
  )
}
