import { AppShell } from "@/components/app-shell";
import { SystemAssessment } from "@/components/system-assessment";

export const metadata = {
  title: "New AI System | NEURONBRIGHT",
  description:
    "Assess an AI system and generate its initial governance profile.",
};

export default function NewSystemPage() {
  return (
    <AppShell>
      <SystemAssessment />
    </AppShell>
  );
}
