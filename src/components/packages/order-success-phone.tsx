"use client";

import { useEffect } from "react";
import { site } from "@/lib/site";

export function OrderSuccessPhone({
  orderNumber,
  customerName,
  onClose,
}: {
  orderNumber: string;
  customerName: string;
  onClose: () => void;
}) {
  const whatsappMessage = [
    `Good day Team please find my order number ${orderNumber}.`,
    customerName ? `Name: ${customerName}` : null,
  ]
    .filter(Boolean)
    .join(" ");
  const whatsappHref = `https://wa.me/27746502580?text=${encodeURIComponent(whatsappMessage)}`;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-success-title"
        className="relative w-[min(100%,20.5rem)] overflow-hidden rounded-[2.6rem] border-[10px] border-slate-900 bg-[#071422] px-5 pb-8 pt-10 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <span aria-hidden className="absolute left-1/2 top-3 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
        >
          <div className="order-success-logo-spin flex h-56 w-56 items-center justify-center overflow-hidden rounded-full bg-white opacity-[0.22]">
            {/* Native img avoids next/image color-scheme hydration on this overlay. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.jpg"
              alt=""
              width={720}
              height={480}
              className="h-[90%] w-[90%] object-contain"
            />
          </div>
          <div className="absolute inset-0 bg-[#071422]/45" />
        </div>
        <div className="relative z-10">
          <p
            id="order-success-title"
            className="mt-4 text-center font-serif text-2xl font-semibold leading-snug text-white [text-shadow:0_1px_2px_#000,0_0_18px_rgba(0,0,0,0.95)]"
          >
            Your order was submitted to Creative-CV
          </p>
          <p className="mt-4 text-center text-sm font-semibold leading-relaxed text-white [text-shadow:0_1px_2px_#000,0_0_14px_rgba(0,0,0,0.95)]">
            and your order number is
          </p>
          <p className="mt-2 text-center font-sans text-3xl font-extrabold tracking-tight text-blue-300 [text-shadow:0_1px_2px_#000,0_0_16px_rgba(0,0,0,0.95)]">
            {orderNumber}
          </p>
          <p className="mt-6 text-center text-sm font-semibold leading-relaxed text-white [text-shadow:0_1px_2px_#000,0_0_14px_rgba(0,0,0,0.95)]">
            For all the follow-ups and necessary info, please contact
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`WhatsApp Creative-CV about order ${orderNumber}`}
            className="mt-3 flex justify-center rounded-full bg-accent px-4 py-3 text-center text-base font-bold text-white"
          >
            {site.phone}
          </a>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full text-sm font-semibold text-slate-300 underline-offset-2 hover:text-white hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
