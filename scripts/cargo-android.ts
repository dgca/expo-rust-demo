import path from "path";
import fs from "fs";
import { spawnSync } from "child_process";

const TARGET_TO_DESTINATION = {
  "aarch64-linux-android": "arm64-v8a",
  "armv7-linux-androideabi": "armeabi-v7a",
  "i686-linux-android": "x86",
  "x86_64-linux-android": "x86_64",
} as const;

function build(target: string) {
  spawnSync(
    "cargo",
    ["ndk", "--target", target, "--platform", "31", "build", "--release"],
    {
      stdio: "inherit",
    }
  );
}

function main() {
  console.log("Building rust library for android");

  process.chdir("native_rust_lib");

  Object.keys(TARGET_TO_DESTINATION).forEach(build);

  process.chdir("..");

  Object.entries(TARGET_TO_DESTINATION).forEach(([target, architecture]) => {
    const sourcePath = path.join(
      process.cwd(),
      "native_rust_lib",
      "target",
      target,
      "release",
      "libnative_rust_lib.so"
    );
    const architecturePath = path.join(
      process.cwd(),
      "modules",
      "my-rust-module",
      "android",
      "src",
      "main",
      "jniLibs",
      architecture
    );
    if (!fs.existsSync(architecturePath)) {
      fs.mkdirSync(architecturePath, { recursive: true });
    }
    fs.copyFileSync(
      sourcePath,
      path.join(architecturePath, "libnative_rust_lib.so")
    );
  });
}

main();
