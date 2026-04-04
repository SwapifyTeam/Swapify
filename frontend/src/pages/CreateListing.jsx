import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react'
import api from '../services/api'

const CATEGORIES = ['Textbooks', 'Electronics', 'Furniture', 'Clothing', 'Sports', 'Other']

const INITIAL = { title: '', description: '', price: '', condition: '', type: '', category: '' }

export default function CreateListing() {
  const { isSignedIn, isLoaded } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]      = useState(INITIAL)
  const [error, setError]    = useState(null)
  const [submitting, setSub] = useState(false)

  if (!isLoaded) return <div className="page"><div className="container"><div className="spinner" /></div></div>
  if (!isSignedIn) return <RedirectToSignIn />

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSub(true)
    try {
      const res = await api.post('/listings', {
        ...form,
        price: form.price === '' ? null : parseFloat(form.price),
      })
      navigate(`/listings/${res.data.id}`)
    } catch (err) {
      setError(err.response?.data?.error ?? 'Failed to create listing.')
      setSub(false)
    }
  }

  const showPrice = form.type === 'sale' || form.type === 'both'

  return (
    <div className="page form-page">
      <div className="container form-container">

        <Link to="/" className="back-link">← Back to listings</Link>

        <div className="form-card">
          <div className="form-card-header">
            <h1>List an Item</h1>
            <p>Fill in the details below to post your item to the marketplace.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label>Title *</label>
              <input
                name="title" value={form.title} onChange={handleChange}
                placeholder="e.g. Introduction to Algorithms, 3rd Ed."
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description" value={form.description} onChange={handleChange}
                placeholder="Describe the item — condition details, edition, accessories included…"
              />
            </div>

            <hr className="form-divider" />

            {/* Type / Condition / Category */}
            <div className="form-row">
              <div className="form-group">
                <label>Listing Type *</label>
                <select name="type" value={form.type} onChange={handleChange} required>
                  <option value="">Select type</option>
                  <option value="sale">For Sale</option>
                  <option value="trade">Trade</option>
                  <option value="both">Sale / Trade</option>
                </select>
              </div>

              <div className="form-group">
                <label>Condition *</label>
                <select name="condition" value={form.condition} onChange={handleChange} required>
                  <option value="">Select condition</option>
                  <option value="new">New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c.toLowerCase()}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price */}
            {showPrice && (
              <div className="form-group">
                <label>Price (USD){form.type !== 'both' && ' *'}</label>
                <input
                  name="price" type="number" min="0" step="0.01"
                  value={form.price} onChange={handleChange}
                  placeholder="0.00"
                  required={form.type === 'sale'}
                />
                {form.type === 'both' && (
                  <p className="form-hint">Optional — leave blank if you prefer trade only</p>
                )}
              </div>
            )}

            {error && <div className="error-banner" style={{ marginBottom: '1rem' }}>{error}</div>}

            <div style={{ display: 'flex', gap: '.75rem', marginTop: '1.75rem' }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}
                style={{ flex: 1 }}>
                {submitting ? 'Posting…' : 'Post Listing'}
              </button>
              <button type="button" className="btn btn-outline btn-lg"
                onClick={() => navigate('/')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
