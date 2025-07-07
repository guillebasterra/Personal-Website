import React, { useEffect, useState, useRef } from 'react'
import './style.css'
import './scripts/cursorTrail.js'
import './scripts/main.js'

function App() {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    import('./scripts/main.js')
    import('./scripts/cursorTrail.js')
  }, [])

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
      <div className="right">
        <p className="now">Writing a video essay on Dostoevsky and AI. Eating a lot of pears. <br />⏳</p>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-window" ref={modalRef}>
            <button className="modal-close" onClick={() => setShowModal(false)} aria-label="Close">&times;</button>
            <h2 className="modal-title">you can reach me at:</h2>
            <div className="modal-content">
              <div className="modal-row"><span className="modal-label">this email:</span> <a href="mailto:guillebasterra@gmail.com">guillebasterra@gmail.com</a></div>
              <div className="modal-row"><span className="modal-label"> or DM me on Instagram:</span> <a href="https://instagram.com/willybasterra" target="_blank" rel="noopener noreferrer">@willybasterra</a></div>
              <div className="modal-row"><span className="modal-label"> I'll read it. Reach out. I'm serious.</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
