import React from 'react'
import './homepage.css'
import { Link } from 'react-router-dom'

function Homepage() {

  

  return (
    <div className='homepage'>
      <img src="/orbital.png" className="orbital" alt="" />
      <div className="left">
        <h1>ChatAI</h1>
        <h2>Supercharge your creativity and productivity</h2>
        <h3>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae pariatur maiores nemo repellat
          asperiores
        </h3>
        <Link to="/dashboard">Get Started</Link>
        
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="./bot.png" alt="" className='bot' />
        </div>
      </div>
      <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
          <Link to="/" >Terms of Service</Link>
          <span>|</span>
          <Link to="/" >Privacy Policy</Link>
        </div>

      </div>
    </div>
  )
}

export default Homepage 