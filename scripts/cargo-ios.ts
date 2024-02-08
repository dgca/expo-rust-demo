import path from "path";
import fs from "fs";
import { spawnSync } from "child_process";

const TARGETS = {
  ios: "aarch64-apple-ios",
  "ios-sim": "aarch64-apple-ios-sim",
};

function cargoBuild(target: string) {
  spawnSync("cargo", ["build", "--release", "--target", target], {
    stdio: "inherit",
  });
}

function getTarget() {
  const args = process.argv.slice(2);
  const target = (args[0] ?? "").replace("--target=", "");

  if (target !== "ios" && target !== "ios-sim") {
    console.error(
      `Invalid target ${target} found. Please specify --target='ios' or --target='ios-sim'`
    );
    process.exit(1);
  }

  return target;
}

function main() {
  const target = TARGETS[getTarget()];
  console.log(`Building ios for target ${target}`);

  process.chdir("native_rust_lib");

  console.log("Building rust library for ios");
  Object.values(TARGETS).forEach(cargoBuild);

  console.log("Generating bindings for ios");
  spawnSync(
    "cbindgen",
    [
      "--lang",
      "c",
      "--crate",
      "native_rust_lib",
      "--output",
      "native_rust_lib.h",
    ],
    {
      stdio: "inherit",
    }
  );

  process.chdir("..");

  const destinationPath = path.join(
    process.cwd(),
    "modules",
    "my-rust-module",
    "ios",
    "rust"
  );
  const rustLibPath = path.join(
    process.cwd(),
    "native_rust_lib",
    "target",
    target,
    "release",
    "libnative_rust_lib.a"
  );
  const rustHeadersPath = path.join(
    process.cwd(),
    "native_rust_lib",
    "native_rust_lib.h"
  );

  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath, { recursive: true });
  }
  fs.copyFileSync(
    rustLibPath,
    path.join(destinationPath, "libnative_rust_lib.a")
  );
  fs.copyFileSync(
    rustHeadersPath,
    path.join(destinationPath, "native_rust_lib.h")
  );
}

main();
