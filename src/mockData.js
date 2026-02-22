export const MOCK_CALLS = [
  {
    id: "mock-1",
    priority: "P0",
    issue_type: "Flight Cancellation — Stranded at JFK",
    summary: "Passenger stranded at JFK, flight cancelled due to weather. Needs immediate rebooking.",
    caller_number: "+15559982121",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    manually_reordered: false,
  },
  {
    id: "mock-2",
    priority: "P0",
    issue_type: "Unaccompanied Minor — No Gate Agent",
    summary: "12-year-old traveling alone, no agent at gate A4 to meet them. Parent on line.",
    caller_number: "+15551234567",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    manually_reordered: false,
  },
  {
    id: "mock-3",
    priority: "P1",
    issue_type: "Lost Baggage — Contains Medication",
    summary: "Checked bag missing after LAX connection. Passenger claims insulin inside.",
    caller_number: "+15557743392",
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    manually_reordered: false,
  },
  {
    id: "mock-4",
    priority: "P1",
    issue_type: "Missed Connection — Rebooking Needed",
    summary: "Missed connecting flight in Dallas due to incoming delay. Needs next available.",
    caller_number: "+15552938475",
    timestamp: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
    manually_reordered: false,
  },
  {
    id: "mock-5",
    priority: "P2",
    issue_type: "Flight Date Change — Next Week",
    summary: "Wants to move Thursday flight to Saturday. Flexible on time.",
    caller_number: "+15559932211",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    manually_reordered: false,
  },
  {
    id: "mock-6",
    priority: "P2",
    issue_type: "Refund Status Inquiry",
    summary: "Requesting update on refund submitted 3 weeks ago for cancelled trip.",
    caller_number: "+15556628192",
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    manually_reordered: false,
  },
  {
    id: "mock-7",
    priority: "P3",
    issue_type: "Baggage Allowance Question",
    summary: "Asking about carry-on size limits for international flight to Tokyo.",
    caller_number: "+15558371928",
    timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    manually_reordered: false,
  },
  {
    id: "mock-8",
    priority: "P3",
    issue_type: "Loyalty Points Balance",
    summary: "Wants to know current miles balance and expiration date.",
    caller_number: "+15554482910",
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    manually_reordered: false,
  },
]

const MOCK_NEW_CALLS = [
  { priority: "P0", issue_type: "Medical Emergency — Diabetic Episode", summary: "Passenger reporting diabetic episode on board. Flight still in air. Family calling from gate.", caller_number: "+15551110001" },
  { priority: "P1", issue_type: "Group Booking Disruption — 15 Passengers", summary: "Corporate group of 15 bumped from oversold flight to Chicago. Need rebooking.", caller_number: "+15552220002" },
  { priority: "P2", issue_type: "Seat Upgrade Request", summary: "Frequent flyer requesting upgrade for long-haul flight next month. Has miles available.", caller_number: "+15553330003" },
  { priority: "P3", issue_type: "Check-in Help", summary: "First-time flyer needs help with online check-in process.", caller_number: "+15554440004" },
  { priority: "P1", issue_type: "Flight Cancelled — Tomorrow Departure", summary: "Flight cancelled for tomorrow morning. Passenger needs alternative routing to London.", caller_number: "+15555550005" },
  { priority: "P0", issue_type: "Stranded — Last Flight Missed", summary: "Passenger missed last flight of the day due to security delay. No accommodation arranged.", caller_number: "+15556660006" },
]

let mockNewIndex = 0
export function getNextMockCall() {
  const base = MOCK_NEW_CALLS[mockNewIndex % MOCK_NEW_CALLS.length]
  mockNewIndex++
  return {
    ...base,
    id: `mock-new-${Date.now()}`,
    timestamp: new Date().toISOString(),
    manually_reordered: false,
  }
}
