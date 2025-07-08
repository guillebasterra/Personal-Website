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
  const location = "London";
  // Set your timezone here (e.g., 'Europe/London', 'America/New_York')
  const timeZone = "Europe/London";

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
            <li><a href="https://substack.com/@guillermobasterra">Substack</a></li>
            <li><a href="https://linkedin.com/in/guillermobasterradiezhandino">LinkedIn</a></li>
            <li><a href="https://goodreads.com/guillebasterra">Goodreads</a></li>
            <li><a href="/resume.pdf">Résumé</a></li>
          </ul>
        </div>
      </div>
      <div className="right">
        <p className="now">
          <span className="marquee">Currently reading "Sun & Steel" by Yukio Mishima, training for a 3:30 marathon, finishing my Computer Science degree, and building a Youtube channel</span>
        </p>
        <div id="three-container"></div>
        {/* Location & Clock bottom right */}
        <div className="location-clock">
          <div className="location">{location}</div>
          <div className="clock">{clock}</div>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-window" ref={modalRef}>
            <button className="modal-close" onClick={() => setShowModal(false)} aria-label="Close">&times;</button>
            <div className="modal-content">
              <div className="modal-row"><span className="modal-label">Shoot me an email:</span> <a href="mailto:guillebasterra@gmail.com">guillebasterra@gmail.com</a></div>
              <div className="modal-row"><span className="modal-label">Or DM me on Instagram:</span> <a href="https://instagram.com/willybasterra" target="_blank" rel="noopener noreferrer">@willybasterra</a></div>
              <div className="modal-row"><span className="modal-label">I'll read it. Reach out. I'm serious.</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
