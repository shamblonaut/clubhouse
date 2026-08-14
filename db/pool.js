import { Pool } from "pg";

import { getDatabaseConfiguration } from "./config.js";

export default new Pool(getDatabaseConfiguration());
