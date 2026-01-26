import { inngest } from "../client";

export const emailProcessor = inngest.createFunction(
  { id: "email-processor" },
  { event: "email/send" },
  async ({ event, step }: { event: any, step: any }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Email sent to ${event.data.email}!` };
  },
);