"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useGetSettings, useUpdateSettings } from "@/services/settings";
import { Settings as SettingsType } from "@/store/types/settings";

export default function Settings() {
  const { data: settings, isLoading } = useGetSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();
  const [localSettings, setLocalSettings] = useState<Partial<SettingsType>>({});

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleChange = <K extends keyof SettingsType>(
    key: K,
    value: SettingsType[K],
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const hasChanges = () => {
    if (!settings || !localSettings) return false;
    return (Object.keys(localSettings) as Array<keyof SettingsType>).some(
      (key) => localSettings[key] !== settings[key],
    );
  };

  const handleSave = () => {
    updateSettings(localSettings);
  };

  if (isLoading) {
    return <div className="p-8">Loading settings...</div>;
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Manage your account settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="space-y-1">
              <Label htmlFor="automatic-sync">Automatic Sync</Label>
              <p className="text-sm text-muted-foreground">
                Automatically fetch and store emails in the SMM database.
              </p>
            </div>
            <Switch
              id="automatic-sync"
              checked={localSettings?.automaticSync || false}
              onCheckedChange={(checked) =>
                handleChange("automaticSync", checked)
              }
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isPending || !hasChanges()}>
              {isPending ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Saving
                </>
              ) : (
                <p>Save</p>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
