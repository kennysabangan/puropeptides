import { useEffect, useState } from 'react'
import { adminListSubscribers } from '../../lib/supabase'

function toCsv(rows) {
  const header = 'email,subscribed_at\n'
  const body = rows
    .map((r) => `"${r.email.replace(/"/g, '""')}",${r.subscribed_at}`)
    .join('\n')
  return header + body
}

export default function AdminSubscribersPage() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminListSubscribers().then(setSubs).finally(() => setLoading(false))
  }, [])

  const handleExport = () => {
    const blob = new Blob([toCsv(subs)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[18px] font-semibold text-[#1D1D1F]">Subscribers</h2>
        <button
          onClick={handleExport}
          disabled={subs.length === 0}
          className={`px-4 py-2 rounded-full text-[12px] font-medium transition ${
            subs.length === 0 ? 'bg-[#1D1D1F]/20 text-white cursor-not-allowed' : 'bg-[#1D1D1F] text-white btn-apple'
          }`}
        >
          Export CSV
        </button>
      </div>

      {loading ? (
        <p className="text-[13px] text-[#86868B]">Loading…</p>
      ) : subs.length === 0 ? (
        <p className="text-[13px] text-[#86868B]">No subscribers yet.</p>
      ) : (
        <div className="overflow-hidden bg-white border border-black/5 rounded-2xl">
          <table className="w-full text-[13px]">
            <thead className="bg-[#FBFBFD] text-[#86868B] text-[11px] uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((s) => (
                <tr key={s.id} className="border-t border-black/5">
                  <td className="px-4 py-3 text-[#1D1D1F]">{s.email}</td>
                  <td className="px-4 py-3 text-[#86868B]">{new Date(s.subscribed_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
