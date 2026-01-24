"use client";

import { format } from "date-fns";
import { CheckCircle, PlusIcon, XCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmailSyncCount, useSyncMails } from "@/services/gmail";
import store from "@/store";
import { Spinner } from "@/components/ui/spinner";

function DashBoard() {
  const { data, isFetching } = useEmailSyncCount();

  const {
    auth: { name, googleId },
  } = store.getState();

  const handleGoogleLogin = async () => {
    const url = process.env.NEXT_PUBLIC_BASE_API_URL;
    window.location.href = `${url}/api/auth/google`;
  };

  const formatDate = (date: Date) => {
    return date ? format(new Date(date), "MMM d, yyyy, h:mm a") : "";
  };

  const { mutateAsync: syncMail, isPending } = useSyncMails();

  const handleSync = async () => {
    await syncMail({ maxResults: 50 }).then((res) => {
      if (res.status === 200) {
        toast.info(res.data.message);
      }
    });
  };

  return googleId ? (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Overview of your email synchronization status.
          </p>
        </div>
        <Button onClick={handleSync} disabled={isPending} className="gap-2">
          {isPending ? (
            <div className="flex items-center gap-2">
              <Spinner data-icon="inline-start" />
              Syncing...
            </div>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-white dark:bg-black animate-pulse" />
              Sync Now
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Synced Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
              Total Emails Synced
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 17a2 2 0 0 1-2 2h-2v2l-4-4h6a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4l4-4h8" />
            </svg>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{data?.count || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Emails stored in our database
            </p>
          </div>
        </div>

        {/* Recently Synced Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
              Synced Last Hour
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">
              {data?.recentlySyncedCount || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Emails processed in last 60 mins
            </p>
          </div>
        </div>

        {/* Last Sync Time Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
              Last Sync
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div className="p-6 pt-0">
            <div className="text-lg font-bold truncate">
              {data?.latestSyncedAt ? formatDate(data.latestSyncedAt) : "Never"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Time since last successful sync
            </p>
          </div>
        </div>

        {/* Automatic Sync Status Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
              Automatic Sync
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className="p-6 pt-0 ">
            <div className="flex items-center gap-2">
              {data?.isAutomaticSyncActive ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <div className="text-lg font-bold text-green-500">Active</div>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-red-500" />
                  <div className="text-lg font-bold text-red-500">Inactive</div>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              If Active, emails will be automatically synced every 15 minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center w-[80vw] h-[80vh]">
      <div className="w-3xl border border-gray-200 rounded-lg shadow-lg p-8 bg-neutral-50">
        <div className="flex items-start w-full gap-3">
          <Image
            width="52"
            height="52"
            src="/avatar.png"
            alt="support"
            className="w-13 h-13 rounded-full"
          />
          <div className="flex items-start justify-center flex-col gap-4">
            <div className="flex flex-col items-start justify-center text-sm mt-1.5">
              <div>
                <span className="font-bold">SMM Support</span>
                <span className="font-medium text-neutral-400">
                  &lt;support@gmail.com&gt;
                </span>
              </div>
              <div>
                <span className="text-xs font-medium text-neutral-400">
                  to {name}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4 text-sm">
              <div>
                <h2 className="text-base font-medium">
                  Hey <strong className="font-bold">{name}</strong>,
                </h2>
              </div>
              <div>
                <p>
                  Here are some important information before you proceed with
                  any of the feature with <strong>Summarize My Email</strong>
                </p>
              </div>
              <div>
                <p>
                  It looks like you haven&apos;t signed up with Google. To
                  unlock the full potential of{" "}
                  <strong>Summarize My Email (SMM)</strong>, we recommend to
                  connect your gmail account with SMM.
                  <br />
                  <br />
                  <strong>Why is this necessary?</strong> SMM summarizes your
                  Gmail messages, so it requires your authorization to read your
                  emails. Rest assured, this access is strictly{" "}
                  <strong>read-only</strong> and SMM will never write, reply, or
                  modify your emails unless you choose to enable additional
                  permissions.
                  <br />
                  <br />
                  By default, SMM only requests the minimal permissions needed
                  to work with Gmail APIs securely and effectively. Your privacy
                  and control over your data remain our top priorities.
                </p>
              </div>
              <div>
                You can authorize SMM. By clicking the follwing button. This
                will only grant read only access.
              </div>
              <Button className="w-fit" onClick={handleGoogleLogin}>
                <PlusIcon className="w-6 h-6 font-bold" /> Link your gmail
                account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
