"use client";

import { useState } from "react";
import { GuestCounter } from "@/components/room/GuestCounter";

interface BookingCardProps {
  pricePerNight: number;
  minGuests: number;
  maxGuests: number;
}

const euroPrice = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export const BookingCard = ({ pricePerNight, minGuests, maxGuests }: BookingCardProps) => {
  const [guestCount, setGuestCount] = useState(minGuests);
  const [showDemoMessage, setShowDemoMessage] = useState(false);
  const safeMaximum = Math.max(minGuests, maxGuests);
  const updateGuests = (count: number) => setGuestCount(Math.min(safeMaximum, Math.max(minGuests, count)));

  return (
    <aside className="rounded-2xl border border-stone-200 bg-white p-5 shadow-lg shadow-stone-900/5 sm:p-6" aria-label="Información de reserva">
      <p className="text-2xl font-semibold text-stone-900">{euroPrice.format(pricePerNight)} <span className="text-base font-normal text-stone-600">/ noche</span></p>
      <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-stone-300 px-4 py-3">
        <div><p className="text-sm font-semibold text-stone-900">Huéspedes</p><p className="text-xs text-stone-500">Máximo {maxGuests}</p></div>
        <GuestCounter value={guestCount} min={minGuests} max={safeMaximum} onChange={updateGuests} />
      </div>
      <button type="button" onClick={() => setShowDemoMessage(true)} className="mt-5 w-full rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white transition hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700">Reservar</button>
      {showDemoMessage && <p role="status" aria-live="polite" className="mt-3 text-center text-xs leading-5 text-stone-600">Esta es una aplicación de demostración. Las reservas reales no están disponibles</p>}
    </aside>
  );
};
