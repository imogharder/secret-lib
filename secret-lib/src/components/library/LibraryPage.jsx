import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { NicheBar } from './NicheBar'
import { CategorySection } from './CategorySection'
import { EntryDetail } from './EntryDetail'
import { EntryEditor } from './EntryEditor'
import { CategoryEditor } from './CategoryEditor'
import { SearchBar } from './SearchBar'
import { Toast } from '../layout/Toast'
import { useToast } from '../../hooks/useToast'
import {
  subscribeNiches, subscribeCategories, subscribeEntries,
  subscribeTags, addEntry, updateEntry, deleteEntry,
  addCategory, updateCategory, deleteCategory
} from '../../lib/db'

export const LibraryPage = () => {
  const { user, isAdmin } = useAuth()
  const { toast, showToast } = useToast()

  // Data state
  const [niches,     setNiches]     = useState([])
  const [categories, setCategories] = useState([])
  const [entries,    setEntries]    = useState([])
  const [tags,       setTags]       = useState([])
  const [loading,    setLoading]    = useState(true)

  // UI state
  const [activeNicheId,    setActiveNicheId]    = useState(null)
  const [selectedEntry,    setSelectedEntry]    = useState(null)
  const [editingEntry,     setEditingEntry]     = useState(null)   // { entry|null, defaultCatId }
  const [editingCategory,  setEditingCategory]  = useState(null)   // { cat|null, nicheId }
  const [searchEntryId,    setSearchEntryId]    = useState(null)

  // Subscribe to niches
  useEffect(() => {
    const unsub = subscribeNiches(data => {
      setNiches(data)
      setLoading(false)
      if (!activeNicheId && data.length > 0) setActiveNicheId(data[0].id)
    })
    return unsub
  }, [])

  // Subscribe to categories for active niche
  useEffect(() => {
    if (!activeNicheId) return
    const unsub = subscribeCategories(activeNicheId, setCategories)
    return unsub
  }, [activeNicheId])

  // Subscribe to entries for active niche
  useEffect(() => {
    if (!activeNicheId) return
    const unsub = subscribeEntries(activeNicheId, setEntries)
    return unsub
  }, [activeNicheId])

  // Subscribe to tags globally
  useEffect(() => {
    const unsub = subscribeTags(setTags)
    return unsub
  }, [])

  // Handle search select — switch to correct niche and open entry
  const handleSearchSelect = useCallback((entry) => {
    if (entry.nicheId !== activeNicheId) {
      setActiveNicheId(entry.nicheId)
      setSearchEntryId(entry.id)
    } else {
      setSelectedEntry(entry)
    }
  }, [activeNicheId])

  useEffect(() => {
    if (searchEntryId && entries.length > 0) {
      const found = entries.find(e => e.id === searchEntryId)
      if (found) { setSelectedEntry(found); setSearchEntryId(null) }
    }
  }, [entries, searchEntryId])

  // Entry CRUD
  const handleSaveEntry = async (data) => {
    try {
      if (editingEntry?.entry?.id) {
        await updateEntry(editingEntry.entry.id, data)
        showToast('Entry updated', 'success')
        // Refresh selected if open
        if (selectedEntry?.id === editingEntry.entry.id) {
          setSelectedEntry({ ...selectedEntry, ...data })
        }
      } else {
        await addEntry(data, user)
        showToast('Entry created', 'success')
      }
      setEditingEntry(null)
    } catch (e) {
      showToast('Error saving entry', 'error')
      console.error(e)
    }
  }

  const handleDeleteEntry = async (entryId) => {
    try {
      await deleteEntry(entryId)
      setSelectedEntry(null)
      showToast('Entry deleted', 'success')
    } catch (e) {
      showToast('Error deleting entry', 'error')
    }
  }

  // Category CRUD
  const handleSaveCategory = async (data) => {
    try {
      if (editingCategory?.cat?.id) {
        await updateCategory(editingCategory.cat.id, data)
        showToast('Category updated', 'success')
      } else {
        await addCategory({ ...data, nicheId: activeNicheId }, user.uid)
        showToast('Category created', 'success')
      }
      setEditingCategory(null)
    } catch (e) {
      showToast('Error saving category', 'error')
    }
  }

  const handleDeleteCategory = async (catId) => {
    try {
      await deleteCategory(catId)
      showToast('Category deleted', 'success')
    } catch (e) {
      showToast('Error deleting category', 'error')
    }
  }

  const activeNiche = niches.find(n => n.id === activeNicheId)

  // Group entries by category (plus uncategorized)
  const entryByCat = {}
  categories.forEach(c => { entryByCat[c.id] = [] })
  entryByCat['__none__'] = []
  entries.forEach(e => {
    const bucket = e.categoryId && entryByCat[e.categoryId] ? e.categoryId : '__none__'
    entryByCat[bucket].push(e)
  })

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', padding: '28px 20px 80px' }}>
      <Toast toast={toast} />

      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: 28, flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--accent)', letterSpacing: 4, marginBottom: 6 }}>
            PRIVATE LIBRARY · {entries.length} ENTRIES
          </div>
          <h1 style={{
            fontFamily: 'var(--font-serif)', fontSize: 38, fontWeight: 300,
            letterSpacing: 2, lineHeight: 1,
          }}>
            Knowledge <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Base</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <SearchBar entries={entries} niches={niches} onSelect={handleSearchSelect} />
          <button
            onClick={() => setEditingEntry({ entry: null })}
            className="btn btn-primary"
          >
            + New Entry
          </button>
        </div>
      </div>

      {/* Niche selector */}
      {niches.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏛️</div>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16 }}>
            No niches yet. {isAdmin ? 'Create your first niche in the Admin panel.' : 'Ask the admin to create niches.'}
          </div>
          {isAdmin && (
            <a href="/admin/niches" className="btn btn-primary" style={{ display: 'inline-flex' }}>
              Go to Admin → Niches
            </a>
          )}
        </div>
      ) : (
        <NicheBar niches={niches} activeNicheId={activeNicheId} onSelect={setActiveNicheId} />
      )}

      {/* Active niche banner */}
      {activeNiche && (
        <div style={{
          background: `linear-gradient(135deg, ${activeNiche.color}14, transparent)`,
          border: `1px solid ${activeNiche.color}24`,
          borderLeft: `4px solid ${activeNiche.color}`,
          borderRadius: 'var(--radius-md)',
          padding: '14px 20px',
          marginBottom: 20,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>{activeNiche.icon}</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: activeNiche.color, letterSpacing: 1 }}>
                {activeNiche.name}
              </div>
              {activeNiche.description && (
                <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', marginTop: 2 }}>
                  {activeNiche.description}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{
              fontSize: 9, color: `${activeNiche.color}77`,
              background: `${activeNiche.color}10`,
              padding: '5px 12px', borderRadius: 20,
              fontFamily: 'var(--font-mono)',
            }}>
              {entries.length} entries · {categories.length} categories
            </span>
            {isAdmin && (
              <button
                onClick={() => setEditingCategory({ cat: null })}
                className="btn btn-ghost btn-sm"
                style={{ borderColor: `${activeNiche.color}33`, color: `${activeNiche.color}66`, fontSize: 10 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = activeNiche.color; e.currentTarget.style.color = activeNiche.color }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${activeNiche.color}33`; e.currentTarget.style.color = `${activeNiche.color}66` }}
              >
                + Category
              </button>
            )}
          </div>
        </div>
      )}

      {/* Categories + entries */}
      {activeNiche && (
        <>
          {categories.map(cat => (
            <CategorySection
              key={cat.id}
              category={cat}
              niche={activeNiche}
              entries={entryByCat[cat.id] || []}
              tags={tags}
              onEntryClick={setSelectedEntry}
              onAddEntry={() => setEditingEntry({ entry: null, defaultCatId: cat.id })}
              onEditCategory={() => setEditingCategory({ cat })}
              onDeleteCategory={() => handleDeleteCategory(cat.id)}
            />
          ))}

          {/* Uncategorized */}
          {entryByCat['__none__'].length > 0 && (
            <CategorySection
              category={{ id: '__none__', name: 'Uncategorized', icon: '📌', color: activeNiche.color }}
              niche={activeNiche}
              entries={entryByCat['__none__']}
              tags={tags}
              onEntryClick={setSelectedEntry}
              onAddEntry={() => setEditingEntry({ entry: null })}
              onEditCategory={() => {}}
              onDeleteCategory={() => {}}
            />
          )}

          {/* Empty state */}
          {categories.length === 0 && entries.length === 0 && (
            <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>✦</div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
                This niche is empty. Start by adding a category or creating your first entry.
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                {isAdmin && (
                  <button onClick={() => setEditingCategory({ cat: null })} className="btn btn-ghost">
                    + Add Category
                  </button>
                )}
                <button onClick={() => setEditingEntry({ entry: null })} className="btn btn-primary">
                  + New Entry
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* MODALS */}
      {editingEntry && (
        <EntryEditor
          entry={editingEntry.entry}
          niches={niches}
          categories={categories}
          tags={tags}
          activeNicheId={activeNicheId}
          onSave={handleSaveEntry}
          onClose={() => setEditingEntry(null)}
        />
      )}

      {editingCategory && isAdmin && (
        <CategoryEditor
          category={editingCategory.cat}
          nicheColor={activeNiche?.color}
          onSave={handleSaveCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}

      {selectedEntry && (
        <EntryDetail
          entry={selectedEntry}
          niche={niches.find(n => n.id === selectedEntry.nicheId)}
          tags={tags}
          onClose={() => setSelectedEntry(null)}
          onEdit={() => { setEditingEntry({ entry: selectedEntry }); setSelectedEntry(null) }}
          onDelete={() => handleDeleteEntry(selectedEntry.id)}
        />
      )}
    </div>
  )
}
