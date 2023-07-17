import React from 'react'
import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <nav>
      <Link to={'/dashboard'} className="navElement">Dashboard</Link>
      <Link to={'/history'} className="navElement">History</Link>
      <p className="flexGrow"></p>
      <Link to={'/dashboard'} className="navElement">Something</Link>
    </nav>
  )
}
