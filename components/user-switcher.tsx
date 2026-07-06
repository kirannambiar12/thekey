"use client";

import { DEMO_USERS, useAuth } from "@/lib/auth/context";
import { useTranslations } from "@/lib/i18n/context";

export function UserSwitcher() {
  const { user, setUser } = useAuth();
  const { t } = useTranslations();

  return (
    <label className="flex items-center gap-2 text-sm text-gray-700">
      <span className="font-medium">{t("common.user")}</span>
      <select
        className="rounded border border-gray-300 bg-white px-2 py-1.5 text-sm"
        value={user.id}
        onChange={(event) => {
          const selected = DEMO_USERS.find(
            (demoUser) => demoUser.id === event.target.value,
          );

          if (selected) {
            setUser({ id: selected.id, role: selected.role });
          }
        }}
      >
        {DEMO_USERS.map((demoUser) => (
          <option key={demoUser.id} value={demoUser.id}>
            {demoUser.name} ({t(`roles.${demoUser.role}`)})
          </option>
        ))}
      </select>
    </label>
  );
}
