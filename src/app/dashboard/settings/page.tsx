import { getSettings } from "@/lib/actions/settings";
import SettingsForm from "./settings-form";

export default async function SettingsPage() {
  const { data: settings, error } = await getSettings();

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto w-full">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-200">
          Impossible de charger vos paramètres. ({error})
        </div>
      )}
      <SettingsForm settings={settings || null} />
    </div>
  );
}
