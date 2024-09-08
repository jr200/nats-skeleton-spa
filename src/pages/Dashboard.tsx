import { useEffect, useState } from 'react'
import { interval } from 'rxjs'
import { map, startWith } from 'rxjs/operators'

export default function Dashboard() {
  const [_dashboardData, setDashboardData] = useState<string | null>(null)
  const [timerValue, setTimerValue] = useState('Starting timer...')

  useEffect(() => {
    // Create the observable
    const timer$ = interval(1000).pipe(
      map((val) => `Timer: ${val} seconds`), // Transform each emitted number to a string
      startWith('Starting timer...') // Start with an initial value
    )

    // Subscribe to the observable and update the state
    const subscription = timer$.subscribe(setTimerValue)

    // Cleanup function to unsubscribe on component unmount
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  async function fetchDashboardData() {
    try {
      setDashboardData('LOADED DATA')
    } catch (error) {
      setDashboardData(null)
      console.error('Error fetching dashboard data:', error)
    }
  }

  return (
    <>
      <div className="grid min-h-screen w-full grid-cols-[240px_1fr] overflow-hidden bg-blue-300">
        <h1>Dashboard Content</h1>
        <div>{timerValue}</div>
      </div>
    </>
  )
}
