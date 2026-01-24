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
import { Switch } from "@/components/ui/switch";
import { useGetSettings, useUpdateSettings } from "@/services/settings";
import { Label } from "@/components/ui/label";

export default function Settings() {
  const { data: settings, isLoading } = useGetSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();
  const [automaticSync, setAutomaticSync] = useState(false);

  useEffect(() => {
    if (settings) {
      setAutomaticSync(settings.automaticSync);
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings({ automaticSync });
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
              checked={automaticSync}
              onCheckedChange={setAutomaticSync}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
