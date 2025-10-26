"use client";

import { format } from "date-fns";
import { CheckCircle, PlusIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useEmailSyncCount, useSyncMails } from "@/services/gmail";
import store from "@/store";

function DashBoard() {
  const { data, isFetching } = useEmailSyncCount();

  const {
    auth: { name, googleId },
  } = store.getState();

  const handleGoogleLogin = async () => {
    window.location.href = "http://localhost:3002/api/auth/google";
  };

  const formatDate = (date: Date) => {
    return date ? format(new Date(date), "MMM d, yyyy, h:mm a") : "";
  };

  const { mutateAsync: syncMail, isPending } = useSyncMails();

  const handleSync = async () => {
    await syncMail({ maxResults: 20 }).then((res) => {
      if (res.status === 200) {
        toast.info(res.data.message);
      }
    });
  };

  return googleId ? (
    <div className="flex flex-col gap-4 w-[80vw] h-[80vh]">
      <h2 className="text-2xl font-bold">Overview</h2>
      <div className="w-xs border border-gray-200 rounded-lg shadow-md">
        {isFetching ? (
          <div className="flex flex-col text-sm gap-8 p-6">
            <div className="flex flex-col gap-1 text-sm">
              <Skeleton className="h-6 w-30" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-6 w-50" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6 w-30" />
              <Skeleton className="h-6 w-50" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="h-6 w-60" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col p-6 text-sm gap-8">
              <div className="flex flex-col text-sm">
                <span className="font-bold text-neutral-600">
                  Email Sync Status
                </span>
                <span className="text-3xl font-bold">{data?.count}</span>
                <span className="font-medium text-neutral-400">
                  with SMM Database
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-neutral-600 font-bold">Last Sync</span>
                <span className="font-medium text-neutral-400">
                  {data?.latestSyncedAt ? (
                    formatDate(data?.latestSyncedAt)
                  ) : (
                    <div>Not Synced Yet</div>
                  )}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <p className="text-green-500 text-sm font-bold">
                    Automatic Sync Active
                  </p>
                </div>
                <Button
                  className="w-fit"
                  variant="outline"
                  size="sm"
                  onClick={handleSync}
                  loading={isPending}
                >
                  Sync Now
                </Button>
              </div>
            </div>
            <div className="border-t border-gray-200 w-full rounded-xs">
              <div className="px-6 py-2 text-xs">
                <ul className="list-disc space-y-2 text-neutral-600 font-thin">
                  <li>
                    <strong className="text-gray-600 font-bold">
                      Automatic Sync Status
                    </strong>
                    : All fetched emails are automatically stored in the SMM
                    database for your convenience.
                  </li>
                  <li>
                    <strong className="text-gray-600 font-bold">
                      Sync Now
                    </strong>
                    : This will synchronize the first 20 emails from your
                    mailbox with the SMM database.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center w-[80vw] h-[80vh]">
      <div className="w-3xl border border-gray-200 rounded-lg shadow-lg p-8 bg-neutral-50">
        <div className="flex items-start w-full gap-3">
          <Image
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
