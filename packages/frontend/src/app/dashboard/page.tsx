"use client";

import { Button } from "@/components/ui/button";
import { useGmailLabels } from "@/services/gmail";
import store from "@/store";
import { PlusIcon } from "lucide-react";

function DashBoard() {
  // const { data: labels } = useGmailLabels();
  // console.log("labelss", labels);

  const {
    auth: { name, googleId },
  } = store.getState();

  const handleGoogleLogin = async () => {
    window.location.href = "http://localhost:3002/api/auth/google";
  };

  return googleId ? (
    <div>Soon...</div>
  ) : (
    <div className="flex justify-center items-center w-[80vw] h-[80vh]">
      <div className="w-3xl border border-gray-200 rounded-lg shadow-lg p-8">
        <div className="flex items-start w-full gap-3">
          <img
            src="https://github.com/shadcn.png"
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
                  It looks like you haven't signed up with Google. To unlock the
                  full potential of <strong>Summarize My Email (SMM)</strong>,
                  we recommend to connect your gmail account with SMM.
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
