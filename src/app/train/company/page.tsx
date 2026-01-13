import LearnEnglishWrapper from "@/modules/train/LearnEnglishWrapper";
import Footer from "@/components/footer";

export default function CompanyPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <LearnEnglishWrapper mode="company" />
      <Footer />
    </div>
  );
}