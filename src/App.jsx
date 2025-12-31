import React, { useEffect, useState, useRef } from 'react'
import './style.css'
import './scripts/cursorTrail.js'
import './scripts/main.js'

function App() {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  // Location and clock state
  const [clock, setClock] = useState("");
  // Change this value to update the location
  const location = "Los Angeles";
  // Set your timezone here (e.g., 'Europe/London', 'America/New_York')
  const timeZone = "America/Los_Angeles";

  useEffect(() => {
    import('./scripts/main.js')
    import('./scripts/cursorTrail.js')
  }, [])
  

  // Update clock every second
  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone };
      setClock(now.toLocaleTimeString([], options));
    }
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [timeZone]);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    }
    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  return (
    <div className="container">
      <div className="left">
        <div className="links-vertical-center">
          <ul className="links">
            <li>
              <a href="#" onClick={e => { e.preventDefault(); setShowModal(true); }}>Contact</a>
            </li>
            <li><a href="https://github.com/guillebasterra">GitHub</a></li>
            <li><a href="https://youtube.com/@willybasterra">YouTube</a></li>
            <li><a href="https://tothinkabout.substack.com/">Substack</a></li>
            <li><a href="https://www.linkedin.com/in/guillermo-basterra-diezhandino">LinkedIn</a></li>
            <li><a href="https://goodreads.com/guillebasterra">Goodreads</a></li>
            <li><a href="/resume.pdf">Résumé</a></li>
          </ul>
        </div>
      </div>
      <div className="right">
        <p className="now">
          <span className="marquee">Currently: Computer Science @ USC, machine learning @ Kantar, reading "The Brothers Karamazov" by Fyodor Dostoyevsky, training for a 3:30 marathon</span>
        </p>
        {/* Location & Clock bottom right */}
        <div className="location-clock">
          <div className="location">{location}</div>
          <div className="clock">{clock}</div>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-window modal-open" ref={modalRef}>
            <div className="modal-content">
              <div className="modal-row"><span className="modal-label">Shoot me an email:</span> <a href="mailto:guillebasterra@gmail.com">guillebasterra@gmail.com</a></div>
              <div className="modal-row"><span className="modal-label">Or DM me on X/Twitter:</span> <a href="https://x.com/willybasterra" target="_blank" rel="noopener noreferrer">@willybasterra</a></div>
              <div className="modal-row"><span className="modal-label">Reach out, I'd love to talk.</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
