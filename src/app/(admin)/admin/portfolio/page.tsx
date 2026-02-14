import { PortfolioManager } from "@/components/admin/portfolio-manager";
import { getAllPortfolioItemsForAdmin } from "@/lib/actions/portfolio";

export default async function AdminPortfolioPage() {
  const items = await getAllPortfolioItemsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-plum-dark">Portfolio Management</h1>
        <p className="text-muted-foreground">Upload, publish, and reorder portfolio images without code edits.</p>
      </div>

      <PortfolioManager initialItems={items} />
    </div>
  );
}
