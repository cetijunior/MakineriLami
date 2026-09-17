import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="notfound">
      <div>
        <h1>Faqja nuk u gjet</h1>
        <p>Linku mund të jetë i vjetër ose artikulli është shitur.</p>
        <Link className="btn btn-y" to="/">Kthehu te dyqani</Link>
      </div>
    </div>
  )
}
