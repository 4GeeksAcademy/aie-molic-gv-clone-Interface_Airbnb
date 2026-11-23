import { Suspense } from "react";
import { RoomDetailClient } from "@/components/room/RoomDetailClient";

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

export default function RoomDetailPage({ params }: RoomPageProps) {
  return <Suspense fallback={<main className="min-h-screen bg-white px-5 py-12"><div className="mx-auto max-w-7xl"><p role="status" aria-live="polite" className="text-center text-sm text-stone-600">Cargando alojamiento…</p></div></main>}><RoomDetailClient params={params} /></Suspense>;
}
