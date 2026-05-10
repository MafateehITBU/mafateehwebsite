import { env } from "./config/env";
import { app } from "./app";

const port = env().PORT;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:${port}`);
});
