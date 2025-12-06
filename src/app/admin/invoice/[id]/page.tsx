'use client';
import { use, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { recentOrders } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type InvoicePageProps = {
  params: Promise<{ id: string }>;
};

export default function InvoicePage({ params }: InvoicePageProps) {
  // Asynchronously get the slug from the params promise.
  const { id } = use(params);

  const order = recentOrders.find((o) => o.id === id);

  if (!order) {
    notFound();
  }

  const subtotal = order.products.reduce((acc, p) => acc + p.price * p.quantity, 0);

  return (
    <div className="bg-white text-black min-h-screen font-mono">
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none;
          }
        }
        @page {
          size: 80mm auto;
          margin: 0.5cm;
        }
      `}</style>
      <div className="max-w-[80mm] mx-auto p-2">
        <header className="text-center pb-2 border-b border-dashed border-black">
          <h1 className="text-xl font-bold">Rodelas lifestyle</h1>
          <p className="text-xs">Your destination for premium apparel.</p>
        </header>

        <section className="text-xs my-2">
            <p><strong>Invoice:</strong> {order.id}</p>
            <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {order.status}</p>
        </section>

        <section className="text-xs my-2 border-y border-dashed border-black py-2">
            <p className="font-bold">Bill To:</p>
            <p>{order.customer}</p>
            <p>{order.address}</p>
            <p>{order.phone}</p>
        </section>

        <section>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-dashed border-black">
                <th className="p-1 font-bold text-left">Item</th>
                <th className="p-1 font-bold text-center">Qty</th>
                <th className="p-1 font-bold text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((product, index) => (
                <tr key={index}>
                  <td className="p-1">{product.name}</td>
                  <td className="p-1 text-center">{product.quantity}</td>
                  <td className="p-1 text-right">{(product.price * product.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-2 border-t border-dashed border-black pt-2 text-xs">
            <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">{subtotal.toLocaleString()}</span>
            </div>
             <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium">{(parseInt(order.amount) - subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-sm mt-1">
                <span>Total</span>
                <span>BDT {parseInt(order.amount).toLocaleString()}</span>
            </div>
        </section>

        <footer className="mt-4 text-center text-xs border-t border-dashed border-black pt-2">
          <p>Thank you for your business!</p>
          <p>Questions? Contact us at support@rodelas.com</p>
           <div className="mt-4 no-print">
              <Button onClick={() => window.print()} size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Invoice
              </Button>
            </div>
        </footer>
      </div>
    </div>
  );
}
