import { COURSES_CS, COURSES_BM } from "@/lib/mockData"
import { clusterSubjects } from "@/lib/clusterSubjects"

export default function MLPage() {
  const allCourses = [...COURSES_CS, ...COURSES_BM]

  // Map Course shape → subject shape expected by clusterSubjects
  const rows = allCourses.map((c) => ({
    subject_id: c.id,
    subject_name: c.name,
  }))

  const clustered = clusterSubjects(rows)

  return (
    <main style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>ML Subject Clustering</h1>
      <p>Total subjects found: {clustered.length}</p>

      {clustered.map((row) => (
        <div
          key={row.subject_id}
          style={{
            border: "1px solid white",
            padding: "15px",
            marginTop: "15px",
            borderRadius: "8px",
          }}
        >
          <h2>{row.subject_name}</h2>
          <p><b>Subject ID:</b> {row.subject_id}</p>
          <p><b>Cluster:</b> {row.clusterLabel}</p>
        </div>
      ))}
    </main>
  )
}
