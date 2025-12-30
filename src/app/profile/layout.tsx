import { ProfileSidebar } from "@/components/profile/profile-sidebar";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto px-4 py-8 flex gap-6">
            <ProfileSidebar />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
