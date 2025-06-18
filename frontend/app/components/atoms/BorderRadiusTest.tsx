"use client"

import { useEffect, useState } from "react"

export default function BorderRadiusTest() {
  const [computedStyles, setComputedStyles] = useState<Record<string, string>>({})

  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      const testElement = document.createElement("div")
      testElement.className = "rounded-lg"
      document.body.appendChild(testElement)

      const styles = window.getComputedStyle(testElement)
      setComputedStyles({
        borderRadius: styles.borderRadius,
        borderTopLeftRadius: styles.borderTopLeftRadius,
        borderTopRightRadius: styles.borderTopRightRadius,
        borderBottomLeftRadius: styles.borderBottomLeftRadius,
        borderBottomRightRadius: styles.borderBottomRightRadius,
      })

      document.body.removeChild(testElement)
    }
  }, [])

  if (process.env.NODE_ENV === "production") {
    return null // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs z-50 max-w-xs">
      <h4 className="font-bold mb-2">Border Radius Debug</h4>
      <div className="space-y-1">
        {Object.entries(computedStyles).map(([property, value]) => (
          <div key={property}>
            <strong>{property}:</strong> {value || "undefined"}
          </div>
        ))}
      </div>
      <div className="mt-2 space-y-1">
        <div className="w-8 h-8 bg-blue-500 rounded-lg inline-block mr-2"></div>
        <span>Test rounded-lg</span>
      </div>
    </div>
  )
}
