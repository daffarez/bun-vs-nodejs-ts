import { exec } from "child_process";
const chalk = require("chalk");

interface BenchmarkResult {
  name: string;
  requests?: number;
  latency?: number;
  throughput?: number;
  error?: boolean;
}

function runBenchmark(name: string, url: string): Promise<BenchmarkResult> {
  return new Promise((resolve) => {
    exec(`autocannon -c 100 -d 10 -j ${url}`, (error, stdout) => {
      if (error) {
        console.error(chalk.red(`Error running benchmark for ${name}:`), error);
        return resolve({ name, error: true });
      }

      try {
        const result = JSON.parse(stdout);
        const summary: BenchmarkResult = {
          name,
          requests: result.requests.average,
          latency: result.latency.average,
          throughput: result.throughput.average,
        };
        resolve(summary);
      } catch (e) {
        console.error(chalk.red(`Failed to parse results for ${name}: ${e}`));
        resolve({ name, error: true });
      }
    });
  });
}

async function main() {
  console.log(chalk.blue.bold("🚀 Running benchmarks for Bun and Node.js..."));

  const bun = await runBenchmark("Bun", "http://localhost:3001");
  const node = await runBenchmark(
    "Node.js + TypeScript",
    "http://localhost:3002"
  );

  console.log(chalk.yellow("Benchmark Results:"));

  const format = (val?: number) => (val !== undefined ? val.toFixed(2) : "N/A");

  console.table([
    {
      Runtime: "Bun",
      "Requests/sec": format(bun.requests),
      "Latency (ms)": format(bun.latency),
      "Throughput (bytes/sec)": format(bun.throughput),
    },
    {
      Runtime: "Node.js + TS",
      "Requests/sec": format(node.requests),
      "Latency (ms)": format(node.latency),
      "Throughput (bytes/sec)": format(node.throughput),
    },
  ]);

  console.log(chalk.green("Benchmark complete."));
}

main();
