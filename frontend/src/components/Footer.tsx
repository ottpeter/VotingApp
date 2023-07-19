import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';


export default function Footer() {
  return (
    <footer>
      <p>Mady by Peter Ott</p>
      <p>
        <a href={"https://twitter.com/ottpeter2"} className="socialIcon" target="_blank"><FaTwitter size={22}/></a>
        <a href={"https://www.linkedin.com/in/p%C3%A9ter-o-b4a20218a/"} className="socialIcon" target="_blank"><FaLinkedin size={22}/></a>
        <a href={"https://github.com/ottpeter/"} className="socialIcon" target="_blank"><FaGithub size={22} /></a>
      </p>
        
      </footer>
  )
}
