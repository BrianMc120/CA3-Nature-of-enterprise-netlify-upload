export function clusterSubjects(rows: any[]) {
  return rows.map((row) => {
    const name = row.subject_name.toLowerCase()

    let clusterLabel = "Other"

    if (name.includes("program")) {
      clusterLabel = "Programming"
    } else if (name.includes("web")) {
      clusterLabel = "Web Development"
    } else if (name.includes("data") || name.includes("statistics")) {
      clusterLabel = "Data Science"
    } else if (name.includes("ai") || name.includes("machine learning")) {
      clusterLabel = "Artificial Intelligence"
    } else if (name.includes("business") || name.includes("marketing")) {
      clusterLabel = "Business"
    } else if (name.includes("math") || name.includes("mechanics")) {
      clusterLabel = "Engineering / Maths"
    }

    return {
      ...row,
      clusterLabel,
    }
  })
}
