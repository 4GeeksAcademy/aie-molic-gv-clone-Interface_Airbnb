import type { Host } from "@/types/accommodation";
import Image from "next/image";

interface HostInfoProps {
  host: Host;
}

export const HostInfo = ({ host }: HostInfoProps) => (
  <section className="flex items-center gap-4 border-y border-stone-200 py-5" aria-label="Anfitrión">
    <Image src={host.avatarUrl || "/accommodation-placeholder.svg"} alt="" width={56} height={56} className="h-14 w-14 rounded-full bg-stone-100 object-cover" />
    <div>
      <h2 className="font-semibold text-stone-900">Te recibe {host.name}</h2>
      <p className="mt-1 text-sm text-stone-600">{host.yearsHosting} años como anfitrión</p>
    </div>
  </section>
);
