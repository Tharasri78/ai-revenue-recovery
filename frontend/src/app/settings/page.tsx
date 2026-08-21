import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-2">
          <Card title="Merchant profile" className="space-y-4 p-5">
            <div>
              <label className="mb-2 block text-sm text-[#B7AEA2]">Merchant name</label>
              <input className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#F5F0E6]" defaultValue="Northwind Studio" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-[#B7AEA2]">Business email</label>
              <input className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#F5F0E6]" defaultValue="billing@northwindstudio.in" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-[#B7AEA2]">Account tier</label>
              <input className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#F5F0E6]" defaultValue="Growth Merchant" />
            </div>
          </Card>

          <Card title="Store information" className="space-y-4 p-5">
            <div>
              <label className="mb-2 block text-sm text-[#B7AEA2]">Store name</label>
              <input className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#F5F0E6]" defaultValue="Northwind Studio" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-[#B7AEA2]">Primary region</label>
              <input className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#F5F0E6]" defaultValue="India / IN" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-[#B7AEA2]">Business category</label>
              <input className="w-full rounded-md border border-white/10 bg-[#121210] px-3 py-2.5 text-[#F5F0E6]" defaultValue="Digital lifestyle" />
            </div>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card title="Recovery preferences" className="space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3"><span className="text-[#B7AEA2]">Enable auto retry</span><input type="checkbox" defaultChecked className="h-4 w-4" /></div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3"><span className="text-[#B7AEA2]">Enable customer messaging</span><input type="checkbox" defaultChecked className="h-4 w-4" /></div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3"><span className="text-[#B7AEA2]">Require approval on high-value attempts</span><input type="checkbox" defaultChecked className="h-4 w-4" /></div>
          </Card>

          <Card title="Notification preferences" className="space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3"><span className="text-[#B7AEA2]">Email summary</span><input type="checkbox" defaultChecked className="h-4 w-4" /></div>
            <div className="flex items-center justify-between border-b border-white/5 pb-3"><span className="text-[#B7AEA2]">Slack alerts</span><input type="checkbox" className="h-4 w-4" /></div>
            <div className="flex items-center justify-between"><span className="text-[#B7AEA2]">Daily exception digest</span><input type="checkbox" defaultChecked className="h-4 w-4" /></div>
          </Card>
        </div>

        <Card title="Test environment" className="p-5">
          <div className="flex items-center justify-between gap-4 rounded-md border border-[#D7A455]/20 bg-[#D7A455]/10 p-4">
            <div>
              <p className="text-sm font-medium text-[#F3C77F]">Razorpay Test Mode</p>
              <p className="mt-1 text-sm text-[#DCC7A3]">No live credentials are configured in this frontend build.</p>
            </div>
            <Button variant="secondary">Update placeholder</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
