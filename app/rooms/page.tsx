"use client";

import { useState } from "react";
import ProtectedPage from "../_components/ProtectedPage";
import { useAuth } from "../_components/AuthProvider";
import { STUDY_ROOMS, ROOM_TIME_SLOTS } from "@/lib/mockData";
import type { StudyRoom } from "@/lib/types";

function isAvailable(roomId: string, slotIndex: number, date: string): boolean {
  const dateSeed = date.split("-").reduce((acc, p) => acc + parseInt(p), 0);
  const seed = roomId.charCodeAt(1) + slotIndex * 7 + dateSeed;
  return seed % 3 !== 0;
}

type Booking = { roomId: string; time: string };

export default function RoomsPage() {
  const { user } = useAuth();
  const [date, setDate]           = useState(() => new Date().toISOString().slice(0, 10));
  const [booking, setBooking]     = useState<Booking | null>(null);
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const findRoom = (id: string): StudyRoom | undefined => STUDY_ROOMS.find((r) => r.id === id);

  return (
    <ProtectedPage>
      <h1 className="font-serif text-4xl font-bold text-stone-900 mb-2">Study Rooms</h1>
      <p className="text-stone-600 mb-8 text-base">Pick a date and an available slot to book a room</p>

      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <label htmlFor="booking-date" className="text-base font-semibold text-stone-800">Date</label>
        <input
          id="booking-date"
          type="date"
          value={date}
          min={today}
          onChange={(e) => { setDate(e.target.value); setBooking(null); setConfirmed(null); }}
          className="border-2 border-stone-200 rounded-xl px-4 py-3 text-base bg-white min-h-[48px] focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
        />
      </div>

      {confirmed && (
        <div role="status" aria-live="polite" className="mb-8 bg-emerald-50 border-2 border-emerald-200 text-emerald-900 rounded-2xl px-6 py-5 hc-card">
          <p className="font-serif font-bold text-lg mb-1">✅ Booking confirmed!</p>
          <p className="text-base">{findRoom(confirmed.roomId)?.name} · {confirmed.time} · {date}</p>
          <p className="text-base text-emerald-800 mt-1">Booked for {user?.name} ({user?.studentId})</p>
        </div>
      )}

      <ul className="space-y-5" role="list">
        {STUDY_ROOMS.map((room) => (
          <li key={room.id} className="bg-white rounded-2xl border border-stone-200 p-6 hc-card">
            <div className="mb-5">
              <h2 className="font-serif font-bold text-stone-900 text-lg">{room.name}</h2>
              <p className="text-base text-stone-600 mt-1 hc-text-muted">
                {room.building} · {room.floor} floor · Up to {room.capacity} people
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {room.features.map((f) => (
                  <span key={f} className="bg-stone-100 text-stone-700 text-sm px-3 py-1 rounded-full">{f}</span>
                ))}
              </div>
            </div>

            <div role="group" aria-label={`Time slots for ${room.name}`} className="flex flex-wrap gap-2.5">
              {ROOM_TIME_SLOTS.map((slot, idx) => {
                const avail    = isAvailable(room.id, idx, date);
                const isBooked = confirmed?.roomId === room.id && confirmed?.time === slot;
                const selected = booking?.roomId === room.id && booking?.time === slot;
                return (
                  <button
                    key={slot}
                    disabled={!avail || isBooked}
                    onClick={() => setBooking(selected ? null : { roomId: room.id, time: slot })}
                    aria-pressed={selected}
                    aria-label={`${slot} — ${isBooked ? "booked by you" : avail ? "available" : "unavailable"}`}
                    className={`px-4 py-2.5 rounded-xl text-base border-2 font-medium min-h-[44px] min-w-[80px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                      isBooked    ? "bg-emerald-100 text-emerald-800 border-emerald-300 cursor-default" :
                      !avail      ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed line-through" :
                      selected    ? "bg-orange-600 text-white border-orange-600" :
                                    "bg-white text-stone-700 border-stone-300 hover:border-orange-400"
                    }`}
                  >
                    {slot}
                    {isBooked && <span className="sr-only"> — booked</span>}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>

      {booking && (
        <div role="dialog" aria-label="Confirm booking" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white border-2 border-stone-200 shadow-xl rounded-2xl px-6 py-5 w-full max-w-md mx-4 hc-card">
          <p className="font-serif font-bold text-stone-900 text-lg mb-1">Confirm booking</p>
          <p className="text-base text-stone-700 mb-4">
            {findRoom(booking.roomId)?.name} · {booking.time} · {date}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => { setConfirmed(booking); setBooking(null); }}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-base font-semibold py-3 rounded-xl min-h-[48px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-700"
            >
              Confirm
            </button>
            <button
              onClick={() => setBooking(null)}
              className="flex-1 border-2 border-stone-300 text-stone-800 text-base font-medium py-3 rounded-xl min-h-[48px] hover:bg-stone-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-stone-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </ProtectedPage>
  );
}
