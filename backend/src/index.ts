import { env, smtpConfigured, contactNotifyRecipientCount } from "./config/env";
import { app } from "./app";

const port = env().PORT;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
  if (smtpConfigured()) {
    // eslint-disable-next-line no-console
    console.log(
      `SMTP ready for contact alerts (${contactNotifyRecipientCount()} recipient(s))`,
    );
  } else {
    // eslint-disable-next-line no-console
    console.warn("SMTP not configured — contact form emails are disabled");
  }
});
