"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const sidebarItems = [
    {
        title: "Manage My Account",
        items: [
            { href: "/profile", label: "My Profile" },
            { href: "/profile/address-book", label: "Address Book" },
            { href: "/profile/payment-options", label: "My Payment Options" },
        ]
    },
    {
        title: "My Orders",
        items: [
            { href: "/profile/orders", label: "My Orders" },
            { href: "/profile/returns", label: "My Returns" },
            { href: "/profile/cancellations", label: "My Cancellations" },
        ]
    },
    {
        title: "My Reviews",
        items: [
            { href: "/profile/reviews", label: "My Reviews" },
        ]
    },
    {
        title: "My Wishlist",
        items: [
            { href: "/profile/wishlist", label: "My Wishlist & Followed Stores" },
        ]
    }
];

export function ProfileSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-full md:w-64 bg-white p-4 hidden md:block border-r min-h-screen">
            <div className="mb-6">
                <p className="text-sm text-gray-500">Hello, User</p>
            </div>
            <nav className="space-y-6">
                {sidebarItems.map((section, idx) => (
                    <div key={idx}>
                        <h3 className="font-semibold text-gray-700 mb-2">{section.title}</h3>
                        <ul className="space-y-1">
                            {section.items.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "block text-sm py-1 hover:text-primary transition-colors",
                                            pathname === item.href ? "text-primary font-medium" : "text-gray-500"
                                        )}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
        </aside>
    );
}
